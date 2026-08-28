# 王亚宁个人网站

视觉 / AI / 品牌设计师作品集，基于 Next.js、vinext 与 Cloudflare Workers 构建。

## 本地开发

```bash
pnpm install
pnpm dev
```

## Cloudflare Workers 自动部署

在 Cloudflare 中创建 **Worker** 并连接本仓库，不要创建 Pages 静态项目。

- Production branch：`main`
- Build command：`pnpm run build`
- Deploy command：`pnpm exec wrangler deploy`
- Root directory：留空

`vinext build` 会生成 `dist/server/wrangler.json`，Wrangler 会通过构建阶段生成的
`.wrangler/deploy/config.json` 自动使用该配置发布 Worker 与静态资源。

项目详情视频默认通过现有 CDN 媒体接口播放。后续迁移到新的 R2/CDN 时，可在
Cloudflare 构建变量中设置：

```text
NEXT_PUBLIC_VIDEO_BASE_URL=https://your-media-domain.example.com
```

变量指向的路径应支持 `/<project-slug>` 形式的视频请求和 HTTP Range 分段加载。
