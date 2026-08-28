import { env } from 'cloudflare:workers';
import { getVideoProject } from '@/data/video-projects';

type MediaEnv = {
  PORTFOLIO_MEDIA: R2Bucket;
  MEDIA_UPLOAD_SECRET?: string;
};

type RouteContext = {
  params: Promise<{ slug: string }>;
};

const mediaEnv = env as unknown as MediaEnv;
const HERO_MEDIA_SLUG = 'hero-smartphone';

function isKnownMedia(slug: string) {
  return slug === HERO_MEDIA_SLUG || Boolean(getVideoProject(slug));
}

function objectKey(slug: string) {
  return `videos/${slug}.mp4`;
}

function mediaHeaders(object: R2Object) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Content-Type', 'video/mp4');
  headers.set('Content-Disposition', 'inline');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'private, max-age=86400');
  headers.set('ETag', object.httpEtag);
  return headers;
}

function parseRange(value: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match) return null;

  const [, startValue, endValue] = match;
  let start: number;
  let end: number;

  if (!startValue) {
    const suffix = Number(endValue);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(startValue);
    end = endValue ? Number(endValue) : size - 1;
  }

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= size || end < start) {
    return null;
  }

  return { start, end: Math.min(end, size - 1) };
}

export async function HEAD(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!isKnownMedia(slug)) return new Response(null, { status: 404 });

  const object = await mediaEnv.PORTFOLIO_MEDIA.head(objectKey(slug));
  if (!object) return new Response(null, { status: 404 });

  const headers = mediaHeaders(object);
  headers.set('Content-Length', String(object.size));
  return new Response(null, { status: 200, headers });
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!isKnownMedia(slug)) return new Response('Video not found', { status: 404 });

  const key = objectKey(slug);
  const metadata = await mediaEnv.PORTFOLIO_MEDIA.head(key);
  if (!metadata) return new Response('Video is being prepared', { status: 404 });

  const rangeValue = request.headers.get('range');
  if (rangeValue) {
    const range = parseRange(rangeValue, metadata.size);
    if (!range) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${metadata.size}` },
      });
    }

    const length = range.end - range.start + 1;
    const object = await mediaEnv.PORTFOLIO_MEDIA.get(key, {
      range: { offset: range.start, length },
    });
    if (!object) return new Response('Video not found', { status: 404 });

    const headers = mediaHeaders(object);
    headers.set('Content-Length', String(length));
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${metadata.size}`);
    return new Response(object.body, { status: 206, headers });
  }

  const object = await mediaEnv.PORTFOLIO_MEDIA.get(key);
  if (!object) return new Response('Video not found', { status: 404 });

  const headers = mediaHeaders(object);
  headers.set('Content-Length', String(object.size));
  return new Response(object.body, { status: 200, headers });
}

export async function PUT(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (!isKnownMedia(slug)) return new Response('Unknown media item', { status: 404 });

  const expectedSecret = mediaEnv.MEDIA_UPLOAD_SECRET;
  const suppliedSecret = request.headers.get('x-media-upload-key');
  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!request.body) return new Response('Missing video body', { status: 400 });

  const object = await mediaEnv.PORTFOLIO_MEDIA.put(objectKey(slug), request.body, {
    httpMetadata: {
      contentType: 'video/mp4',
      contentDisposition: 'inline',
      cacheControl: 'private, max-age=86400',
    },
    customMetadata: {
      project: slug,
      uploadedBy: 'portfolio-media-pipeline',
    },
  });

  return Response.json({ key: object.key, size: object.size, etag: object.etag });
}
