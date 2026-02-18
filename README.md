# Pic Compressor

一个基于 Next.js 的图片压缩工具，支持 PNG / JPG / GIF / WebP，多文件上传、服务端压缩、自动下载，适合前端资源优化和日常图片处理。

## 功能特性

- 支持格式：`PNG`、`JPEG/JPG`、`GIF`、`WebP`
- 批量上传与压缩（多文件返回 ZIP）
- 单文件压缩后直接下载
- 输出格式可选：`png` / `jpeg` / `webp` / `original`
- 可配置：
  - 最大边长（`maxSide`）
  - 质量（`quality`）
  - PNG 压缩级别（`pngLevel`）
  - 调色板减色（`reduceColors`）与色深（`colorDepth`）
- 压缩前预估节省率（页面实时估算）
- 中英文界面切换（本地持久化）
- 上传去重（同名+同大小+同修改时间）

## 技术栈

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- sharp（图片处理）
- JSZip（批量打包）
- react-dropzone（拖拽上传）
- file-saver（前端下载）

## 目录结构

```txt
app/
  api/compress/route.ts      # 压缩 API
  layout.tsx
  page.tsx                   # 主页面
components/
  DropZone.tsx
  FileList.tsx
  Settings.tsx
  ResultCard.tsx
styles/
  globals.css
types/
  index.ts
utils/
  fileHelpers.ts
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

默认访问：`http://localhost:3000`

### 3. 生产构建

```bash
npm run build
npm run start
```

## API 说明

### `POST /api/compress`

请求：`multipart/form-data`

- `images`: `File`（可多个）
- `options`: JSON 字符串

`options` 结构：

```ts
{
  maxSide: number;
  outputFormat: "png" | "jpeg" | "webp" | "original";
  quality: number;
  pngLevel: number;
  reduceColors: boolean;
  colorDepth: "8" | "24" | "32";
}
```

响应：

- 单文件：返回图片二进制（`Content-Type: image/*`）
- 多文件：返回 ZIP（`Content-Type: application/zip`）

## 配置注意事项

- 项目使用了 App Router API 路由：`app/api/compress/route.ts`
- `next.config.ts` 不应使用 `output: "export"`，否则 `/api/*` 路由不可用

## 常见问题

### 1. 请求 `/api/compress` 返回 404

请确认：

- 文件存在：`app/api/compress/route.ts`
- 没有开启静态导出（`output: "export"`）
- 修改配置后已重启开发服务器

### 2. 中文文件名下载报错

项目已通过 `Content-Disposition` 的 `filename*` 处理 UTF-8 文件名；如果你做过二次改动，确保相关逻辑仍在 `app/api/compress/route.ts`。

## License

MIT