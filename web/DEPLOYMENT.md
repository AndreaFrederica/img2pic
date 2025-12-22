# Cloudflare Workers 部署指南

## 部署步骤

### 1. 构建项目
```bash
# 构建生产版本
npm run build:cf

# 或者使用标准构建
npm run build
```

### 2. 部署到 Cloudflare

#### 生产环境部署
```bash
npm run deploy:cf
```

#### 测试环境部署
```bash
npm run deploy:cf:staging
```

### 3. 手动部署（如果脚本失败）
```bash
# 1. 构建项目
npm run build:cf

# 2. 进入 workers-site 目录
cd workers-site

# 3. 安装依赖
npm install

# 4. 部署到生产环境
npm run deploy:production

# 或部署到测试环境
npm run deploy:staging
```

## 配置说明

### wrangler.toml 配置
- **应用名称**: img2pic-web
- **入口点**: workers-site/index.js
- **兼容性**: 2024-01-01
- **Node.js 兼容**: 已启用
- **静态资源**: ./dist/spa

### 环境配置
- **生产环境**: i2p.sirrus.cc
- **测试环境**: staging.i2p.sirrus.cc

### 缓存策略
- **HTML**: 2小时
- **CSS/JS/图片/字体**: 30天
- **其他资源**: 2小时

### 安全头
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 故障排除

### 常见问题

1. **构建失败**
   - 确保 Node.js 版本 >= 20
   - 清除 node_modules 重新安装

2. **部署失败**
   - 检查 wrangler 是否已登录: `wrangler whoami`
   - 检查环境变量配置

3. **静态资源 404**
   - 确保 dist/spa 目录存在
   - 检查构建输出是否正确

4. **Worker 运行时错误**
   - 检查兼容性标志
   - 查看 Workers 日志

### 本地开发
```bash
# 启动本地开发服务器
npm run dev

# 启动 Workers 本地开发
cd workers-site
npm run dev
```

## 更新部署

1. 修改代码
2. 运行 `npm run build:cf`
3. 运行 `npm run deploy:cf`
4. 验证部署结果

## 监控

- 使用 Cloudflare Dashboard 监控 Worker 性能
- 查看分析数据了解用户使用情况
- 设置警报以便及时发现问题