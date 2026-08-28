/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BorderGlow from '@/components/BorderGlow';
import ProjectDetailMotion from '@/components/ProjectDetailMotion';
import { getVideoProject, videoProjects } from '@/data/video-projects';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return videoProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getVideoProject(slug);
  if (!project) return {};

  return {
    title: `${project.title} — 王亚宁`,
    description: project.description,
    openGraph: {
      title: `${project.title} — 王亚宁`,
      description: project.description,
      type: 'video.other',
      images: [{ url: project.poster, alt: `${project.title}视频封面` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — 王亚宁`,
      description: project.description,
      images: [project.poster],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getVideoProject(slug);
  if (!project) notFound();
  const staticMediaBase = process.env.NEXT_PUBLIC_VIDEO_BASE_URL?.replace(/\/$/, '');
  const projectVideoSource = staticMediaBase
    ? `${staticMediaBase}/${project.slug}.mp4`
    : `/api/media/${project.slug}`;

  return (
    <main className="project-detail">
      <ProjectDetailMotion projectKey={project.slug} />

      <div className="project-opening" aria-hidden="true">
        <div className="project-opening-panels">
          <span className="project-opening-panel" />
          <span className="project-opening-panel" />
          <span className="project-opening-panel" />
        </div>
        <div className="project-opening-inner shell">
          <div className="project-opening-kicker">WYN® / MOTION ARCHIVE</div>
          <div className="project-opening-title">
            <span>{project.number}</span>
            <strong>{project.title}</strong>
          </div>
          <div className="project-opening-rule" />
          <div className="project-opening-meta">
            <span>{project.english}</span>
            <span>{project.year} · HANGZHOU</span>
          </div>
        </div>
        <div className="project-opening-progress shell">
          <span>OPENING</span>
          <span className="project-opening-counter">000</span>
        </div>
      </div>

      <div className="project-detail-nav-slot shell">
        <nav className="project-detail-nav" aria-label="项目详情导航">
          <a className="wordmark" href="/#top" aria-label="返回王亚宁作品集首页">
            W<span>Y</span>N<sup>26</sup>
          </a>
          <a className="project-back" href="/#work">← 返回精选项目</a>
        </nav>
      </div>

      <header className="project-detail-head shell">
        <div className="project-detail-index">
          <span>PROJECT / {project.number}</span>
          <span>{project.year}</span>
        </div>
        <p>{project.english}</p>
        <h1><span>{project.title}</span></h1>
        <div className="project-detail-summary">
          <p>{project.description}</p>
          <span>{project.credit}</span>
        </div>
      </header>

      <section className="project-film-section">
        <div className="project-chapter project-film-chapter shell" data-project-chapter>
          <span>PROJECT FILM</span>
          <i>01 / 03</i>
        </div>
        <section className="project-player shell" aria-label={`${project.title}高清视频`}>
          <div className="project-player-frame">
            <video controls playsInline preload="metadata" poster={project.poster}>
              <source src={projectVideoSource} type="video/mp4" />
              当前浏览器暂不支持视频播放。
            </video>
          </div>
          <div className="project-player-meta">
            <span>{staticMediaBase ? 'NETLIFY CDN STREAM' : 'R2 HIGH-RES STREAM'}</span>
            <span>1080P · ORIGINAL FRAME RATE</span>
          </div>
        </section>
      </section>

      <section className="project-notes-section">
        <div className="project-chapter project-notes-chapter shell" data-project-chapter>
          <span>PROJECT NOTES</span>
          <i>02 / 03</i>
        </div>
        <section className="project-detail-info shell">
          <div>
            <span>PROJECT NOTE</span>
            <h2>用镜头与运动，<br />把功能变成感知。</h2>
          </div>
          <div className="project-services">
            <span>SERVICES</span>
            <ul>
              {project.services.map((service, index) => (
                <li key={service}><i>0{index + 1}</i>{service}</li>
              ))}
            </ul>
          </div>
        </section>
      </section>

      <nav className="project-index" aria-label="全部视频项目导航">
        <div className="project-chapter project-index-chapter shell" data-project-chapter>
          <span>MORE PROJECTS</span>
          <i>03 / 03</i>
        </div>
        <div className="project-index-content">
          <header className="shell">
            <span>PROJECT INDEX / 06</span>
            <p>浏览全部视频项目</p>
          </header>
          <div className="project-index-grid shell">
            {videoProjects.map((item) => {
              const isCurrent = item.slug === project.slug;
              return (
                <BorderGlow
                  className={`project-index-glow${isCurrent ? ' is-current' : ''}`}
                  edgeSensitivity={28}
                  glowColor="83 100 62"
                  backgroundColor="#0a0e0b"
                  borderRadius={20}
                  glowRadius={24}
                  glowIntensity={0.28}
                  coneSpread={24}
                  animated={false}
                  fillOpacity={0.045}
                  colors={['#d7ff66', '#c9ff3f', '#5f9d1a']}
                  key={item.slug}
                >
                  <a
                    className="project-index-card"
                    href={`/work/${item.slug}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    <span>{item.number}</span>
                    <div>
                      <small>{item.english}</small>
                      <strong>{item.title}</strong>
                    </div>
                    <i>{isCurrent ? 'CURRENT' : '↗'}</i>
                  </a>
                </BorderGlow>
              );
            })}
          </div>
        </div>
      </nav>
    </main>
  );
}
