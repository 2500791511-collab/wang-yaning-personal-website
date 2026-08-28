import type { Config, Context } from '@netlify/functions';

declare const Netlify: {
  env: {
    get(name: string): string | undefined;
  };
};

function knownMedia(slug: string) {
  return new Set([
    'chair-structure',
    'chair-function',
    'team-product-cg',
    'personal-cg-studies',
    'carplay-adapter-01',
    'carplay-adapter-02',
  ]).has(slug);
}

function boundedRange(value: string | null) {
  const maxChunk = 2 * 1024 * 1024;
  if (!value) return `bytes=0-${maxChunk - 1}`;

  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match) return `bytes=0-${maxChunk - 1}`;

  const [, startValue, endValue] = match;
  if (!startValue) {
    const suffix = Math.min(Number(endValue) || maxChunk, maxChunk);
    return `bytes=-${suffix}`;
  }

  const start = Number(startValue);
  if (!Number.isSafeInteger(start) || start < 0) return `bytes=0-${maxChunk - 1}`;

  const requestedEnd = endValue ? Number(endValue) : start + maxChunk - 1;
  const end = Number.isSafeInteger(requestedEnd)
    ? Math.min(requestedEnd, start + maxChunk - 1)
    : start + maxChunk - 1;

  return `bytes=${start}-${Math.max(start, end)}`;
}

const mediaProxy = async (request: Request, context: Context) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  const slug = context.params.slug;
  if (!slug || !knownMedia(slug)) {
    return new Response('Video not found', { status: 404 });
  }

  const bearer =
    process.env.SITES_MEDIA_BEARER ??
    (typeof Netlify !== 'undefined'
      ? Netlify.env.get('SITES_MEDIA_BEARER')
      : undefined);
  const headers = new Headers();
  if (bearer) {
    headers.set('OAI-Sites-Authorization', `Bearer ${bearer}`);
  }

  if (request.method === 'GET') {
    headers.set('Range', boundedRange(request.headers.get('range')));
  }

  const upstream = await fetch(
    `https://wang-yaning-portfolio.misty-titan-9955.chatgpt.site/api/media/${encodeURIComponent(slug)}`,
    {
      method: request.method,
      headers,
    },
  );

  const responseHeaders = new Headers();
  for (const name of [
    'accept-ranges',
    'cache-control',
    'content-length',
    'content-range',
    'content-type',
    'etag',
    'last-modified',
  ]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  responseHeaders.set('Content-Disposition', 'inline');
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  responseHeaders.set('Vary', 'Range');

  if (upstream.ok) {
    responseHeaders.set('Cache-Control', 'public, max-age=86400');
    responseHeaders.set(
      'Netlify-CDN-Cache-Control',
      'public, durable, max-age=604800, stale-while-revalidate=86400',
    );
    responseHeaders.set('Netlify-Vary', 'header=Range');
  }

  return new Response(request.method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};

export default mediaProxy;

export const config: Config = {
  path: '/api/media/:slug',
};
