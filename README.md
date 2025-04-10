# MCP Market [![Vite](https://img.shields.io/badge/vite-4.0-blue.svg)]() [![Vue3](https://img.shields.io/badge/vue-3.3-green.svg)]()

> MCP协议服务器市场应用

## 🚀 功能特性
- MCP服务器浏览与检索
- 服务器详情展示
- 新服务器提交功能
- API调试工具
- 服务器调试工具
- 权限管理功能
- 服务器事件推送(SSE)
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

## 📂 项目结构详解

```
src/
├── api/            # API接口层
│   ├── mcp.ts      # MCP核心接口
│   ├── request.ts  # 基于axios的请求封装
│   └── mcp/        # MCP功能模块API
│       ├── categoryList.ts  # 分类接口
│       ├── client.ts        # 客户端接口
│       ├── debug.ts         # 调试接口
│       ├── detail.ts        # 详情接口
│       ├── install.ts       # 安装接口
│       ├── installed.ts     # 已安装服务接口
│       ├── installedByClient.ts # 客户端安装接口
│       ├── list.ts          # 列表接口
│       ├── status.ts        # 状态接口
│       └── updatePermission.ts # 权限更新
├── assets/         # 静态资源
│   ├── global.css  # 全局样式
│   ├── vue.svg     # Vue logo
│   └── logos/      # 项目logo资源
├── components/     # 公共组件
│   ├── MarketHeader.vue  # 顶部导航栏
│   ├── MCPDetail.vue     # 服务器详情组件
│   └── MCPMarket.vue     # 服务器市场主组件
├── mock/           # Mock数据
│   └── index.ts    # Mock服务入口
├── router/         # 路由配置
│   └── index.ts    # 路由定义
├── store/          # 状态管理
│   └── index.ts    # Pinia store
├── styles/         # 样式文件
├── types/          # 类型定义
│   └── mcp.ts      # MCP相关类型
└── views/          # 页面组件
    ├── APIPage.vue   # API文档页
    ├── DebugPage.vue # 调试工具页
    ├── PermissionPage.vue # 权限管理页
    └── SubmitPage.vue # 服务器提交页

public/            # 公共资源
├── vite.svg       # Vite logo
└── index.html     # 应用入口HTML
```

## 📡 API接口文档

### 服务器相关
- `getMCPList(params)`: 获取MCP服务器列表
  - 参数: `{ category?: string, search?: string, page?: number, size?: number }`
  - 返回: `Promise<MCPItem[]>

### 事件推送
- `/mcpserver/webEvent`: 服务器事件推送接口(SSE)
  - 事件类型: 
    - `info`: 普通信息通知
    - `warn`: 警告信息
    - `error`: 错误信息
  - 数据格式: `{ type: string, title: string, message: string }`

- `getMCPDetail(id)`: 获取MCP服务器详情
  - 参数: `id: number`
  - 返回: `Promise<MCPDetail>`

- `submitMCP(data)`: 提交新的MCP服务器
  - 参数: `data: FormData`
  - 返回: `Promise<void>`

- `getCategories()`: 获取MCP分类列表
  - 返回: `Promise<string[]>`

### 工具相关
- `getMCPTools(id)`: 获取MCP服务器工具列表
  - 参数: `id: string`
  - 返回: `Promise<any[]>`

- `debugTool(data)`: 调试工具
  - 参数: `{ tool: string, params: Record<string, string> }`
  - 返回: `Promise<DebugResult>`

### 已安装服务器
- `getInstalledMCPList()`: 获取已安装的MCP服务器列表
  - 返回: `Promise<MCPItem[]>`

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
