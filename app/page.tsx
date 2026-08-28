'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from '@/components/BorderGlow';
import { videoProjects } from '@/data/video-projects';

type ImageProject = {
  number: string;
  title: string;
  english: string;
  image: string;
  alt: string;
  description: string;
  tags: string[];
  size: 'wide' | 'standard' | 'tall';
};

const commercialProjects: ImageProject[] = [
  {
    number: '01',
    title: '人体工学椅商业视觉',
    english: 'ERGONOMIC CHAIR / CGI CAMPAIGN',
    image: '/media/project-commerce.webp',
    alt: '深色场景中的人体工学椅商业渲染',
    description: '围绕产品定位与材质质感，完成场景搭建、HDR 灯光、构图与商业静帧输出。',
    tags: ['商业静帧', '材质灯光', '场景视觉'],
    size: 'wide',
  },
  {
    number: '02',
    title: '电商卖点视觉系统',
    english: 'E-COMMERCE / VISUAL SYSTEM',
    image: '/media/project-chair.webp',
    alt: '人体工学椅电商卖点主视觉',
    description: '将腰托、头枕与后仰结构转化为清晰的卖点层级，适配详情页、独立站与 B 端宣传。',
    tags: ['详情页 KV', '卖点拆解', '多渠道适配'],
    size: 'standard',
  },
];

const renderProjects: ImageProject[] = [
  {
    number: '03',
    title: '手机产品风格化渲染',
    english: 'MOBILE DEVICE / STYLE FRAME',
    image: '/media/project-phone.webp',
    alt: '双手机产品风格化三维渲染',
    description: '以精确的材质控制和明快光影，呈现产品轮廓、镜头模组与金属细节。',
    tags: ['产品渲染', '材质研究', '灯光设计'],
    size: 'standard',
  },
  {
    number: '04',
    title: 'Xiaomi 产品渲染练习',
    english: 'XIAOMI / PRODUCT CGI STUDY',
    image: '/media/project-xiaomi.webp',
    alt: 'Xiaomi 手机镜头模组三维产品渲染',
    description: '围绕旗舰手机的镜头模组、金属边框与深色材质，完成克制而精确的产品视觉练习。',
    tags: ['产品练习', '镜头模组', '材质灯光'],
    size: 'wide',
  },
  {
    number: '05',
    title: 'Coloso 概念视觉',
    english: 'COLOSO / CONCEPT WORLD',
    image: '/media/project-coloso.webp',
    alt: 'Coloso 概念系列三维场景',
    description: '用三维场景、品牌色与大量细节建立一个兼具秩序感和叙事性的创意世界。',
    tags: ['概念场景', '品牌表达', '三维合成'],
    size: 'wide',
  },
  {
    number: '06',
    title: '透明结构表达',
    english: 'INNER STRUCTURE / MATERIAL STUDY',
    image: '/media/project-structure.webp',
    alt: '透明手机内部结构产品渲染',
    description: '通过透明材质与结构分层，让内部构造成为准确、直观且具有张力的产品语言。',
    tags: ['结构拆解', '透明材质', '产品特写'],
    size: 'tall',
  },
];

const strengths = [
  {
    number: '01',
    title: '产品视觉策略',
    english: 'VISUAL STRATEGY',
    description: '从定位、受众与核心卖点出发，确定画面重点、构图和信息层级，让视觉真正服务于产品表达。',
    tags: ['卖点拆解', '视觉定位', '内容规划'],
  },
  {
    number: '02',
    title: '三维商业呈现',
    english: '3D VISUALIZATION',
    description: '独立完成场景、材质、灯光与渲染，以稳定的技术流程控制产品质感和商业完成度。',
    tags: ['Cinema 4D', 'Octane', 'PBR'],
  },
  {
    number: '03',
    title: '动态与后期',
    english: 'MOTION & POST',
    description: '将复杂结构翻译为镜头语言，覆盖功能动画、结构拆解、剪辑调色、字幕与动效包装。',
    tags: ['Animation', 'After Effects', 'Premiere'],
  },
  {
    number: '04',
    title: 'AI 协同设计',
    english: 'AI-AUGMENTED DESIGN',
    description: '用 AI 加速创意研究、方向探索和内容迭代，同时保持品牌判断与三维制作的一致性。',
    tags: ['AI Workflow', 'Brand', 'Iteration'],
  },
];

const profileMetrics = [
  { value: '04', label: '内容落地渠道', detail: '独立站 / 电商 / 短视频 / B 端' },
  { value: '06', label: '视觉交付形态', detail: '静帧 / 场景 / 动画 / KV / 后期 / 页面' },
  { value: '05+', label: '核心视觉工具', detail: 'C4D / Octane / AE / PR / PS / AI' },
  { value: '0-1', label: '全链路工作方法', detail: '策略 → 三维 → 动态 → 多渠道落地' },
];

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [activeSection, setActiveSection] = useState('top');
  const [navPinned, setNavPinned] = useState(false);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const requestPlayback = () => {
      if (document.visibilityState !== 'visible') return;
      void video.play().catch(() => undefined);
    };

    const playbackTimer = window.setTimeout(requestPlayback, 1400);
    document.addEventListener('visibilitychange', requestPlayback);

    return () => {
      window.clearTimeout(playbackTimer);
      document.removeEventListener('visibilitychange', requestPlayback);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.12, 0.35, 0.62], rootMargin: '-14% 0px -58% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const openingScreen = root.querySelector<HTMLElement>('.opening-screen');

    // The in-app preview reports reduced motion by default. Keep the authored
    // portfolio motion visible there, while using a gentler image parallax.
    if (openingScreen) openingScreen.style.display = 'grid';

    document.documentElement.classList.add('motion-lock');

    const context = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
      const isDesktop = window.matchMedia('(min-width: 900px)').matches;
      const openingCounter = root.querySelector<HTMLElement>('.opening-footer span:last-child');
      const openingProgress = { value: 0 };

      const finishOpening = () => {
        document.documentElement.classList.remove('motion-lock');
        gsap.set('.opening-screen', { display: 'none' });
        ScrollTrigger.refresh();
      };

      gsap.timeline({
        defaults: { ease: 'power4.inOut' },
        onComplete: finishOpening,
      })
        .set('.hero-media', { scale: isDesktop ? 1.12 : 1.07 })
        .to(openingProgress, {
          value: 100,
          duration: 2.65,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (openingCounter) {
              openingCounter.textContent = `00 — ${Math.round(openingProgress.value).toString().padStart(3, '0')}`;
            }
          },
        }, 0)
        .from('.opening-kicker', { yPercent: 160, opacity: 0, duration: 0.95 }, 0.08)
        .from('.opening-word span', {
          yPercent: 135,
          xPercent: -5,
          scaleX: 0.48,
          opacity: 0,
          transformOrigin: 'left center',
          duration: 1.45,
          ease: 'expo.out',
        }, 0.34)
        .from('.opening-rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.15 }, 0.72)
        .from('.opening-meta span', { y: 32, opacity: 0, stagger: 0.12, duration: 0.85 }, 0.92)
        .to('.opening-word span', {
          xPercent: 7,
          scaleX: 1.12,
          transformOrigin: 'right center',
          duration: 0.85,
          ease: 'power3.in',
        }, 2.35)
        .to('.opening-center, .opening-footer', {
          y: -62,
          scaleX: 0.94,
          opacity: 0,
          transformOrigin: 'center top',
          duration: 0.9,
          ease: 'power3.in',
        }, 2.62)
        .to('.opening-panel', {
          yPercent: -105,
          stagger: { each: 0.11, from: 'start' },
          duration: 1.45,
          ease: 'expo.inOut',
        }, 3.12)
        .fromTo('.hero-media',
          { scale: isDesktop ? 1.12 : 1.07 },
          { scale: 1.015, duration: 2.15, ease: 'power3.out' },
          3.18)
        .from('.site-nav', { y: -44, opacity: 0, duration: 1.05, ease: 'power4.out' }, 3.46)
        .from('.hero-meta span', { y: 38, opacity: 0, stagger: 0.13, duration: 0.95, ease: 'power4.out' }, 3.55)
        .fromTo('.hero-title > p',
          { y: 76, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.15, ease: 'power4.out' },
          3.78)
        .fromTo('.hero-title h1 span:first-child',
          {
            xPercent: -12,
            yPercent: 145,
            scaleX: 0.38,
            skewX: -6,
            clipPath: 'inset(100% 0 0 0)',
            transformOrigin: 'left center',
          },
          {
            xPercent: 0,
            yPercent: 0,
            scaleX: 1,
            skewX: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.85,
            ease: 'expo.out',
          },
          3.94)
        .fromTo('.hero-title h1 span:last-child',
          {
            xPercent: 12,
            yPercent: 150,
            scaleX: 0.44,
            skewX: 5,
            clipPath: 'inset(100% 0 0 0)',
            transformOrigin: 'right center',
          },
          {
            xPercent: 0,
            yPercent: 0,
            scaleX: 1,
            skewX: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.95,
            ease: 'expo.out',
          },
          4.16)
        .fromTo('.hero-bottom',
          { y: 86, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.35, ease: 'power4.out' },
          4.66);

      gsap.utils.toArray<HTMLElement>('[data-motion-section]').forEach((section) => {
        if (section.id === 'contact') return;
        const title = section.querySelector<HTMLElement>('[data-motion-title]');
        const titleText = title?.querySelector('span');
        const titleIndex = title?.querySelector('i');
        const header = section.querySelector<HTMLElement>('.section-head');
        if (!title || !titleText || !titleIndex || !header) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: title,
            start: 'top 86%',
            once: true,
          },
        })
          .from(titleText, {
            xPercent: -7,
            yPercent: 145,
            scaleX: 0.46,
            skewX: -5,
            clipPath: 'inset(100% 0 0 0)',
            transformOrigin: 'left center',
            duration: 1.85,
            ease: 'expo.out',
          })
          .from(titleIndex, { x: 90, opacity: 0, duration: 1.05, ease: 'power4.out' }, '-=1.18')
          .from(header.children, {
            y: 92,
            opacity: 0,
            clipPath: 'inset(0 0 24% 0)',
            stagger: 0.16,
            duration: 1.25,
            ease: 'power4.out',
            clearProps: 'opacity,transform,clipPath',
          }, '-=0.82');
      });

      const animateCardGroup = (group: Element) => {
        const cards = Array.from(group.children);
        if (!cards.length) return;
        gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 86%',
            once: true,
          },
        }).from(cards, {
          y: isDesktop ? 118 : 72,
          scale: 0.96,
          opacity: 0,
          rotationX: 3,
          transformPerspective: 1400,
          stagger: 0.17,
          duration: 1.35,
          ease: 'power4.out',
          clearProps: 'opacity,transform',
        });
      };

      root.querySelectorAll('.profile-grid, .metrics, .strengths-grid').forEach(animateCardGroup);

      root.querySelectorAll<HTMLElement>('.work-group').forEach((group) => {
        const header = group.querySelector<HTMLElement>('.work-group-head');
        const grid = group.querySelector<HTMLElement>('.commercial-grid, .render-grid, .video-grid');
        if (!header || !grid) return;
        const cards = Array.from(grid.children);
        const frames = cards
          .map((card) => card.querySelector<HTMLElement>('.image-project-visual, .video-cover'))
          .filter((frame): frame is HTMLElement => Boolean(frame));

        gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: 'top 84%',
            once: true,
          },
        })
          .from(header.children, {
            y: 72,
            opacity: 0,
            clipPath: 'inset(0 0 28% 0)',
            stagger: 0.13,
            duration: 1.15,
            ease: 'power4.out',
            clearProps: 'opacity,transform,clipPath',
          })
          .from(cards, {
            y: isDesktop ? 124 : 76,
            scale: 0.96,
            opacity: 0,
            rotationX: 3,
            transformPerspective: 1400,
            stagger: 0.17,
            duration: 1.4,
            ease: 'power4.out',
            clearProps: 'opacity,transform',
          }, '-=0.5')
          .from(frames, {
            clipPath: 'inset(0 0 100% 0)',
            stagger: 0.14,
            duration: 1.45,
            ease: 'expo.out',
            clearProps: 'clipPath',
          }, '-=1.18');
      });

      root.querySelectorAll<HTMLElement>('.profile-portrait').forEach((frame) => {
        gsap.from(frame, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.55,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: frame,
            start: 'top 88%',
            once: true,
          },
        });
      });

      root.querySelectorAll<HTMLElement>(
        '.profile-lead, .profile-detail, .profile-contact, .timeline article, .image-project-copy, .video-copy, .toolchain',
      ).forEach((block, index) => {
        gsap.from(block, {
          y: 54,
          opacity: 0,
          clipPath: 'inset(0 0 24% 0)',
          duration: 1.15,
          delay: (index % 3) * 0.05,
          ease: 'power4.out',
          clearProps: 'opacity,transform,clipPath',
          scrollTrigger: {
            trigger: block,
            start: 'top 91%',
            once: true,
          },
        });
      });

      if (window.matchMedia('(min-width: 900px)').matches) {
        root.querySelectorAll<HTMLElement>('.profile-portrait img, .image-project-visual img, .video-cover img').forEach((image) => {
          const parallaxOffset = prefersReducedMotion ? 2.5 : 5;
          const parallaxScale = prefersReducedMotion ? 1.045 : 1.085;
          gsap.fromTo(image,
            { yPercent: -parallaxOffset, scale: parallaxScale },
            {
              yPercent: parallaxOffset,
              scale: parallaxScale,
              ease: 'none',
              scrollTrigger: {
                trigger: image.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.6,
              },
            });
        });
      }

      const contact = root.querySelector<HTMLElement>('#contact');
      if (contact) {
        const contactTitle = contact.querySelector<HTMLElement>('.contact-title h2');
        gsap.timeline({
          scrollTrigger: {
            trigger: contact,
            start: 'top 72%',
            once: true,
          },
        })
          .from(contact.querySelector('.contact-rings'), {
            scale: 0.72,
            rotation: -14,
            opacity: 0,
            duration: 1.8,
            ease: 'expo.out',
          })
          .from(contact.querySelectorAll('.contact-inner > header span'), {
            y: 32,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power4.out',
          }, '-=1.25')
          .from(contact.querySelector('.contact-title p'), {
            y: 62,
            opacity: 0,
            duration: 0.95,
            ease: 'power4.out',
          }, '-=0.55')
          .from(contactTitle, {
            xPercent: -7,
            yPercent: 125,
            scaleX: 0.5,
            skewX: -4,
            clipPath: 'inset(100% 0 0 0)',
            transformOrigin: 'left center',
            duration: 1.75,
            ease: 'expo.out',
          }, '-=0.5');
      }

      gsap.from('.toolchain span', {
        y: 42,
        opacity: 0,
        stagger: 0.08,
        duration: 0.85,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.toolchain',
          start: 'top 88%',
          once: true,
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });

    return () => {
      window.removeEventListener('load', refresh);
      document.documentElement.classList.remove('motion-lock');
      context.revert();
    };
  }, []);

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;

    let ticking = false;
    let navigationFrame = 0;
    const updateNavigation = () => {
      const triggerPoint = Math.max(hero.offsetHeight - 96, 0);
      setNavPinned(window.scrollY >= triggerPoint);
      ticking = false;
      navigationFrame = 0;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      navigationFrame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (navigationFrame) window.cancelAnimationFrame(navigationFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const renderProject = (project: ImageProject) => (
    <article
      className={`image-project image-project-${project.size}`}
      data-reveal
      key={project.number}
    >
      <figure className="image-project-visual">
        <img src={project.image} alt={project.alt} loading="lazy" />
        <figcaption>
          <span>{project.number}</span>
          <span>{project.english}</span>
        </figcaption>
      </figure>
      <div className="image-project-copy">
        <div>
          <h4>{project.title}</h4>
          <p>{project.description}</p>
        </div>
        <ul aria-label={`${project.title}项目标签`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );

  return (
    <main ref={pageRef}>
      <div className="opening-screen" aria-hidden="true">
        <div className="opening-panels">
          <span className="opening-panel" />
          <span className="opening-panel" />
          <span className="opening-panel" />
        </div>
        <div className="opening-center">
          <p className="opening-kicker">WANG YANING · CREATIVE PORTFOLIO</p>
          <strong className="opening-word"><span>WYN®</span></strong>
          <div className="opening-rule" />
          <div className="opening-meta">
            <span>VISUAL DESIGN</span>
            <span>AI / CGI</span>
            <span>HANGZHOU · 2026</span>
          </div>
        </div>
        <div className="opening-footer">
          <span>LOADING VISUAL SYSTEMS</span>
          <span>00 — 100</span>
        </div>
      </div>

      <nav className={`site-nav${navPinned ? ' is-pinned' : ''}`} aria-label="主导航">
        <a className="wordmark" href="#top" aria-label="王亚宁作品集首页">
          W<span>Y</span>N<sup>26</sup>
        </a>
        <div className="nav-links">
          <a className={activeSection === 'top' ? 'active' : ''} href="#top">首页</a>
          <a className={activeSection === 'profile' ? 'active' : ''} href="#profile">经历</a>
          <a className={activeSection === 'work' ? 'active' : ''} href="#work">项目</a>
          <a className={activeSection === 'capabilities' ? 'active' : ''} href="#capabilities">能力</a>
        </div>
        <a className="nav-contact" href="#contact">联系合作 <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true">
          <video
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-smartphone-poster.webp"
            disablePictureInPicture
          >
            <source src="/media/hero-smartphone-lite.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grid shell">
          <div className="hero-meta" data-reveal>
            <span>WANG YANING</span>
            <span>VISUAL / AI / BRAND DESIGNER</span>
            <span>HANGZHOU · CN</span>
          </div>
          <div className="hero-title" data-reveal>
            <p>让产品价值成为</p>
            <h1>
              <span>VISUAL</span>
              <span>SYSTEMS<i>®</i></span>
            </h1>
          </div>
          <div className="hero-bottom" data-reveal>
            <p>
              专注三维产品视觉、动态影像与 AI 辅助创作，<br />
              从卖点理解到最终成片，建立清晰、克制且可复用的视觉表达。
            </p>
            <div className="hero-actions">
              <a href="#work">浏览精选项目 <span>↓</span></a>
              <a href="#contact">发起合作 <span>↗</span></a>
            </div>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">PORTFOLIO / 2026</div>
      </section>

      <section className="profile section" id="profile" data-motion-section>
        <div className="shell">
          <div className="section-motion-title" data-motion-title aria-hidden="true">
            <span>PROFILE</span><i>01</i>
          </div>
          <header className="section-head" data-reveal>
            <p><span>01</span> PROFILE / 个人经历</p>
            <h2>复杂的产品逻辑，<br />值得更直观的视觉语言。</h2>
          </header>

          <div className="profile-grid">
            <figure className="profile-portrait" data-reveal>
              <img src="/media/avatar-cat.jpg" alt="王亚宁指定使用的头像" />
              <figcaption>
                <span>WANG YANING</span>
                <span>VISUAL DESIGNER</span>
              </figcaption>
            </figure>

            <div className="profile-content" data-reveal>
              <p className="profile-lead">
                你好，我是王亚宁，一名聚焦产品与商业表达的三维视觉设计师，拥有工业产品、消费电子与车载数码产品的商业动画及静帧经验。
              </p>
              <p className="profile-detail">
                我的工作从需求理解开始，延伸到场景搭建、材质灯光、结构动画、渲染与后期交付，并持续将 AI 融入创意研究。我在意画面完成度，也在意视觉是否让产品被快速理解、准确感知，并能在独立站、电商、短视频与 B 端渠道持续复用。
              </p>

              <div className="profile-contact" aria-label="联系方式">
                <a href="mailto:2500791511@qq.com"><span>EMAIL</span>2500791511@qq.com <i>↗</i></a>
                <a href="tel:+8618238420625"><span>PHONE</span>+86 182 3842 0625 <i>↗</i></a>
              </div>

              <div className="timeline">
                <article>
                  <time>2026.04 — NOW</time>
                  <div>
                    <h3>智契同舟数字传媒有限公司</h3>
                    <p>三维视觉设计师 · 商业静帧 / 产品动画 / 电商视觉</p>
                  </div>
                </article>
                <article>
                  <time>2025.07 — 2026.02</time>
                  <div>
                    <h3>深圳市宇辰创意有限公司</h3>
                    <p>三维动画设计师 · 消费电子 / 车载数码 / 产品商业动画</p>
                  </div>
                </article>
                <article>
                  <time>2021.09 — 2025.07</time>
                  <div>
                    <h3>郑州工商学院</h3>
                    <p>电子信息工程 · 本科</p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div className="metrics" data-reveal aria-label="项目数据">
            {profileMetrics.map((metric, index) => (
              <BorderGlow
                className="metric-glow-card"
                edgeSensitivity={28}
                glowColor="83 100 62"
                backgroundColor="#101410"
                borderRadius={24}
                glowRadius={28}
                glowIntensity={0.42}
                coneSpread={24}
                animated={false}
                fillOpacity={0.08}
                colors={['#d7ff66', '#c9ff3f', '#5f9d1a']}
                key={metric.label}
              >
                <article>
                  <strong>{metric.value}</strong>
                  <div className="metric-visual" aria-hidden="true">
                    <i />
                    <em>FIELD / 0{index + 1}</em>
                  </div>
                  <span>{metric.label}</span>
                  <small>{metric.detail}</small>
                </article>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section className="work section" id="work" data-motion-section>
        <div className="shell">
          <div className="section-motion-title" data-motion-title aria-hidden="true">
            <span>SELECTED WORK</span><i>02</i>
          </div>
          <header className="section-head section-head-row" data-reveal>
            <p><span>02</span> SELECTED WORK / 精选项目</p>
            <h2>静态建立质感，<br />动态解释价值。</h2>
            <p>从商业产品到概念实验，关注结构、材质、光影与信息如何共同工作。</p>
          </header>

          <div className="work-group">
            <header className="work-group-head" data-reveal>
              <p>IMAGE PROJECTS / A</p>
              <h3>商业视觉</h3>
              <span>COMMERCIAL VISUALS</span>
            </header>
            <div className="commercial-grid">
              {commercialProjects.map(renderProject)}
            </div>
          </div>

          <div className="work-group render-group">
            <header className="work-group-head" data-reveal>
              <p>IMAGE PROJECTS / B</p>
              <h3>三维渲染</h3>
              <span>3D RENDERING</span>
            </header>
            <div className="render-grid">
              {renderProjects.map(renderProject)}
            </div>
          </div>

          <div className="work-group video-group">
            <header className="work-group-head" data-reveal>
              <p>MOTION PROJECTS / 06</p>
              <h3>视频项目</h3>
              <span>MOTION DESIGN & CGI</span>
            </header>
            <div className="video-grid">
              {videoProjects.map((project) => (
                <article
                  className="video-project"
                  data-reveal
                  key={project.number}
                >
                  <BorderGlow
                    className="video-glow-card"
                    edgeSensitivity={34}
                    glowColor="83 100 62"
                    backgroundColor="#0a0d0b"
                    borderRadius={0}
                    glowRadius={22}
                    glowIntensity={0.38}
                    coneSpread={18}
                    animated={false}
                    fillOpacity={0.06}
                    colors={['#d7ff66', '#c9ff3f', '#5f9d1a']}
                  >
                    <a className="video-cover" href={`/work/${project.slug}`} aria-label={`查看${project.title}项目详情`}>
                      <img src={project.poster} alt={`${project.title}视频封面`} loading="lazy" />
                      <span className="play-icon">VIEW <i>↗</i></span>
                      <span className="video-number">{project.number} / 06</span>
                    </a>
                  </BorderGlow>
                  <div className="video-copy">
                    <p>{project.english}</p>
                    <h4>{project.title}</h4>
                    <span>{project.description}</span>
                    <small>{project.credit}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="capabilities section" id="capabilities" data-motion-section>
        <div className="shell">
          <div className="section-motion-title" data-motion-title aria-hidden="true">
            <span>CAPABILITIES</span><i>03</i>
          </div>
          <header className="section-head section-head-row" data-reveal>
            <p><span>03</span> CAPABILITIES / 个人优势</p>
            <h2 className="capabilities-heading">
              <span>从概念到成片，</span>
              <span>保持同一套视觉判断。</span>
            </h2>
            <p>技术是基础，核心是让每一次创意选择都有目的。</p>
          </header>

          <div className="strengths-grid">
            {strengths.map((strength) => (
              <BorderGlow
                className="strength-glow-card"
                edgeSensitivity={28}
                glowColor="83 100 62"
                backgroundColor="#101410"
                borderRadius={24}
                glowRadius={28}
                glowIntensity={0.42}
                coneSpread={24}
                animated={false}
                fillOpacity={0.08}
                colors={['#d7ff66', '#c9ff3f', '#5f9d1a']}
                key={strength.number}
              >
                <article className="strength-card" data-reveal>
                  <div className="strength-top"><span>{strength.number}</span><span>＋</span></div>
                  <div className="strength-copy">
                    <p>{strength.english}</p>
                    <h3>{strength.title}</h3>
                    <div className="strength-line" />
                    <p className="strength-description">{strength.description}</p>
                    <ul>{strength.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  </div>
                </article>
              </BorderGlow>
            ))}
          </div>

          <div className="toolchain" data-reveal aria-label="工作工具">
            <span>CORE TOOLCHAIN</span>
            <div>
              <b>CINEMA 4D</b><i>✦</i><b>OCTANE</b><i>✦</i><b>AFTER EFFECTS</b><i>✦</i>
              <b>PREMIERE</b><i>✦</i><b>PHOTOSHOP</b><i>✦</i><b>AI WORKFLOW</b>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-screen" id="contact" data-motion-section>
        <div className="contact-rings" aria-hidden="true" />
        <div className="shell contact-inner">
          <header data-reveal>
            <span>04 / CONTACT</span>
            <span>AVAILABLE FOR SELECTED PROJECTS</span>
          </header>
          <div className="contact-title" data-reveal>
            <p>有合适的项目？</p>
            <h2>LET&apos;S MAKE<br /><i>IT VISIBLE.</i></h2>
          </div>
          <div className="contact-dock" data-reveal>
            <div className="contact-actions">
              <a href="mailto:2500791511@qq.com">
                <span>EMAIL</span><strong>2500791511@qq.com</strong><i>↗</i>
              </a>
              <a href="tel:+8618238420625">
                <span>PHONE</span><strong>+86 182 3842 0625</strong><i>↗</i>
              </a>
            </div>
            <footer>
              <span>WANG YANING © 2026</span>
              <a className="back-to-top" href="#top"><b>BACK TO TOP</b><i>↑</i></a>
              <span>HANGZHOU · CHINA</span>
            </footer>
          </div>
        </div>
      </section>

    </main>
  );
}
