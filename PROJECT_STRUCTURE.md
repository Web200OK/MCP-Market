# MCP Market 项目结构文档

## 1. 核心功能模块

### MCP市场首页 (`/mcp-market`)
- 顶部导航栏
- 搜索功能
- 分类筛选
- MCP服务卡片展示

### MCP详情页 (`/mcp-details/:id`)
- 基本信息展示
- 详细描述

## 2. 代码结构

```
src/
├── api/
│   └── mcp.ts          # MCP相关API接口
├── components/
│   ├── MCPMarket.vue   # 市场主界面组件
│   └── MCPDetail.vue   # 详情页组件
├── router/
│   └── index.ts        # 路由配置
├── store/
│   └── index.ts        # 状态管理
└── main.ts             # 应用入口
```

## 3. 技术栈

- Vue 3 + TypeScript
- Vite构建工具
- Element Plus UI组件库
- Axios HTTP客户端

## 4. 配置文件

- `vite.config.ts` - 构建配置
- `tsconfig.json` - TypeScript配置
- `package.json` - 项目依赖
