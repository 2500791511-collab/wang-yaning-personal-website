import type { Metadata } from 'next';
import SiteAmbient from '@/components/SiteAmbient';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://wang-yaning-portfolio.netlify.app'),
  title: '王亚宁 — 视觉 / AI / 品牌设计师',
  description: '王亚宁的个人作品集：三维视觉、产品动画、电商视觉、AI 设计与品牌表达。',
  keywords: ['王亚宁', '三维视觉设计', '产品动画', 'AI 设计', '品牌设计', '作品集'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '王亚宁 — 视觉作品集',
    description: '3D VISUAL · AI DESIGN · BRAND SYSTEMS',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og.png',
        alt: '王亚宁视觉作品集 — 3D Visual, AI Design, Brand Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '王亚宁 — 视觉作品集',
    description: '3D VISUAL · AI DESIGN · BRAND SYSTEMS',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{localStorage.setItem('nl-hud:public:v1','hidden')}catch{}",
          }}
        />
      </head>
      <body>
        <SiteAmbient />
        {children}
      </body>
    </html>
  );
}
