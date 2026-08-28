'use client';

import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ProjectDetailMotionProps = {
  projectKey: string;
};

export default function ProjectDetailMotion({ projectKey }: ProjectDetailMotionProps) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.project-detail');
    if (!root) return;

    const page = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const opening = root.querySelector<HTMLElement>('.project-opening');
    const counter = root.querySelector<HTMLElement>('.project-opening-counter');
    const counterState = { value: 0 };
    let openingDone = false;

    page.classList.add('project-motion-lock');
    root.dataset.motion = 'loading';

    const context = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
      const ease = 'expo.out';
      const detailNav = root.querySelector<HTMLElement>('.project-detail-nav');
      const detailHead = root.querySelector<HTMLElement>('.project-detail-head');

      if (detailNav && detailHead) {
        ScrollTrigger.create({
          trigger: detailHead,
          start: 'bottom top+=96',
          end: 'max',
          toggleClass: { targets: detailNav, className: 'is-floating' },
        });
      }

      const openingTimeline = gsap.timeline({
        defaults: { ease },
        onComplete: () => {
          openingDone = true;
          page.classList.remove('project-motion-lock');
          root.dataset.motion = 'ready';
          if (opening) opening.hidden = true;
          ScrollTrigger.refresh();
        },
      });

      gsap.set('.project-detail-nav', { y: -34, autoAlpha: 0 });
      gsap.set('.project-detail-index > span, .project-detail-head > p, .project-detail-summary > *', {
        y: 30,
        autoAlpha: 0,
      });
      gsap.set('.project-detail-head h1 span', {
        yPercent: 112,
        scaleX: 0.72,
        transformOrigin: 'left center',
      });

      if (reduceMotion) {
        openingTimeline
          .to(counterState, {
            value: 100,
            duration: 0.25,
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(counterState.value)).padStart(3, '0');
            },
          })
          .to('.project-opening', { autoAlpha: 0, duration: 0.25 })
          .to('.project-detail-nav', { y: 0, autoAlpha: 1, duration: 0.45 }, '<')
          .to('.project-detail-index > span, .project-detail-head > p, .project-detail-summary > *', {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.04,
          }, '<')
          .to('.project-detail-head h1 span', { yPercent: 0, scaleX: 1, duration: 0.6 }, '<');
      } else {
        openingTimeline
          .fromTo('.project-opening-kicker',
            { yPercent: 120, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.9 },
          )
          .fromTo('.project-opening-title span, .project-opening-title strong',
            { yPercent: 125, scaleX: 0.55, transformOrigin: 'left center' },
            { yPercent: 0, scaleX: 1, duration: 1.45, stagger: 0.1 },
            '-=0.45',
          )
          .fromTo('.project-opening-rule',
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.25 },
            '-=1.05',
          )
          .fromTo('.project-opening-meta span',
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 },
            '-=0.7',
          )
          .to(counterState, {
            value: 100,
            duration: 2.15,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(counterState.value)).padStart(3, '0');
            },
          }, 0)
          .to('.project-opening-title', {
            scaleX: 0.72,
            xPercent: 7,
            duration: 0.7,
            transformOrigin: 'left center',
            ease: 'power3.inOut',
          }, '+=0.2')
          .to('.project-opening-panel', {
            yPercent: -105,
            duration: 1.35,
            stagger: 0.075,
            ease: 'expo.inOut',
          }, '-=0.28')
          .to('.project-opening-inner, .project-opening-progress', {
            y: -60,
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power3.in',
          }, '<')
          .to('.project-detail-nav', { y: 0, autoAlpha: 1, duration: 1.05 }, '-=0.68')
          .to('.project-detail-index > span', {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.08,
          }, '-=0.78')
          .to('.project-detail-head > p', { y: 0, autoAlpha: 1, duration: 0.8 }, '-=0.66')
          .to('.project-detail-head h1 span', {
            yPercent: 0,
            scaleX: 1,
            duration: 1.45,
          }, '-=0.72')
          .to('.project-detail-summary > *', {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.1,
          }, '-=0.86');
      }

      const chapterPairs = [
        ['.project-film-chapter', '.project-player'],
        ['.project-notes-chapter', '.project-detail-info'],
        ['.project-index-chapter', '.project-index-content'],
      ];

      chapterPairs.forEach(([chapterSelector, contentSelector]) => {
        const chapter = root.querySelector<HTMLElement>(chapterSelector);
        const content = root.querySelector<HTMLElement>(contentSelector);
        if (!chapter || !content) return;

        const chapterTitle = chapter.querySelector('span');
        const chapterIndex = chapter.querySelector('i');
        const contentItems = contentSelector === '.project-index-content'
          ? content.querySelectorAll('.project-index-content > header, .project-index-glow')
          : contentSelector === '.project-detail-info'
            ? content.querySelectorAll(':scope > div')
            : content.querySelectorAll('.project-player-frame, .project-player-meta');

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: 'top 87%',
            once: true,
          },
        });

        timeline
          .fromTo(chapterTitle,
            { yPercent: 120, xPercent: -7, scaleX: 0.5, autoAlpha: 0, transformOrigin: 'left center' },
            { yPercent: 0, xPercent: 0, scaleX: 1, autoAlpha: 1, duration: reduceMotion ? 0.55 : 2.15, ease },
          )
          .fromTo(chapterIndex,
            { x: 70, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: reduceMotion ? 0.4 : 1.15, ease },
            '<0.3',
          )
          .fromTo(contentItems,
            { y: reduceMotion ? 18 : 76, clipPath: 'inset(0 0 14% 0)', autoAlpha: 0 },
            {
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
              autoAlpha: 1,
              duration: reduceMotion ? 0.55 : 1.4,
              stagger: reduceMotion ? 0.05 : 0.16,
              ease,
              clearProps: 'transform,clipPath,opacity,visibility',
            },
            '-=0.38',
          );
      });

      if (!reduceMotion) {
        gsap.fromTo('.project-player video',
          { yPercent: -2.2, scale: 1.035 },
          {
            yPercent: 2.2,
            scale: 1.035,
            ease: 'none',
            scrollTrigger: {
              trigger: '.project-player-frame',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      }
    }, root);

    return () => {
      context.revert();
      page.classList.remove('project-motion-lock');
      root.removeAttribute('data-motion');
      if (!openingDone && opening) opening.hidden = true;
    };
  }, [projectKey]);

  return null;
}
