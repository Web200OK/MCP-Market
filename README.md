# MCP Market [![Vite](https://img.shields.io/badge/vite-4.0-blue.svg)]() [![Vue3](https://img.shields.io/badge/vue-3.3-green.svg)]()

> MCP协议服务器市场应用

## 🚀 功能特性
- MCP服务器浏览与检索
- 服务器详情展示
- 新服务器提交功能
- API调试工具
- 响应式设计

## 🛠 技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 4
- **UI组件库**: Element Plus
- **语言**: TypeScript
- **状态管理**: Pinia
- **路由**: Vue Router

## 🏁 快速开始

### 环境要求
- Node.js 16+
- npm 8+

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## 📂 项目结构
```
src/
├── api/            # API接口封装
├── assets/         # 静态资源
├── components/     # 公共组件
│   ├── MarketHeader.vue
│   ├── MCPDetail.vue
│   └── MCPMarket.vue
├── mock/           # Mock数据
├── router/         # 路由配置
├── store/          # 状态管理
└── views/          # 页面组件
    ├── APIPage.vue
    ├── DebugPage.vue
    └── SubmitPage.vue
```

## 🤝 贡献指南
1. Fork项目
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 创建Pull Request

## 🔗 相关链接
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [MCP 协议](https://mcp.so)
