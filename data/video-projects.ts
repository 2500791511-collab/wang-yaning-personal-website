export type VideoProject = {
  number: string;
  slug: string;
  title: string;
  english: string;
  poster: string;
  description: string;
  credit: string;
  year: string;
  services: string[];
};

export const videoProjects: VideoProject[] = [
  {
    number: '01',
    slug: 'chair-structure',
    title: '人体工学椅结构卖点动画',
    english: 'STRUCTURE FILM / COMMERCIAL',
    poster: '/media/video/chair-structure-v2.webp',
    description: '以透明、拆解和机械运动演示，把复杂结构转化成可理解的产品卖点。',
    credit: 'Motion Design · CGI · AE',
    year: '2025',
    services: ['结构拆解', '产品动画', '材质灯光', '后期合成'],
  },
  {
    number: '02',
    slug: 'chair-function',
    title: '人体工学椅功能动画',
    english: 'FUNCTION FILM / COMMERCIAL',
    poster: '/media/video/chair-function-v2.webp',
    description: '用运动轨迹与局部特写解释头枕、扶手、腰托等核心功能。',
    credit: 'Animation · Lookdev · Render · Post',
    year: '2025',
    services: ['功能演示', '镜头设计', 'Lookdev', '剪辑包装'],
  },
  {
    number: '03',
    slug: 'team-product-cg',
    title: '产品商业 CG 视觉',
    english: 'PRODUCT CGI / TEAM PROJECT',
    poster: '/media/video/team-cg-v2.webp',
    description: '围绕产品结构、材质与场景氛围完成团队商业视觉协作。',
    credit: 'CGI · Lighting · Rendering',
    year: '2025',
    services: ['团队协作', '产品视觉', '灯光设计', '渲染输出'],
  },
  {
    number: '04',
    slug: 'personal-cg-studies',
    title: '产品 CG 视觉练习合集',
    english: 'CG STUDIES / PERSONAL WORK',
    poster: '/media/video/personal-cg-v2.webp',
    description: '跨越产品、抽象材质与风格化场景的个人三维动态实验。',
    credit: 'Personal Direction · Full Pipeline',
    year: '2024 — 2026',
    services: ['个人创作', '三维实验', '材质研究', '全流程制作'],
  },
  {
    number: '05',
    slug: 'carplay-adapter-01',
    title: '车载无线 CarPlay 适配器 01',
    english: 'CARPLAY ADAPTER / COMMERCIAL 01',
    poster: '/media/video/carplay-1-v2.webp',
    description: '围绕接口形态、芯片性能与无线连接效率，建立克制、精密的车载科技产品叙事。',
    credit: 'Product Animation · C4D · Octane · AE',
    year: '2025',
    services: ['商业动画', '产品建模', 'Octane 渲染', 'AE 后期'],
  },
  {
    number: '06',
    slug: 'carplay-adapter-02',
    title: '车载无线 CarPlay 适配器 02',
    english: 'CARPLAY ADAPTER / COMMERCIAL 02',
    poster: '/media/video/carplay-2-v2.webp',
    description: '通过信号传输、双频连接与车机交互场景，将功能卖点转化为节奏明确的商业动画。',
    credit: 'CGI · Motion Design · Edit · Post',
    year: '2025',
    services: ['卖点可视化', '动态设计', '场景搭建', '剪辑调色'],
  },
];

export function getVideoProject(slug: string) {
  return videoProjects.find((project) => project.slug === slug);
}
