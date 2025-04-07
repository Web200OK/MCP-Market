# MCP Market 项目结构文档

## 1. 项目概述
基于Vue 3 + TypeScript的MCP服务市场前端项目

## 2. 文档使用说明
- **新成员入职**：帮助快速了解项目结构
- **代码审查**：作为项目结构的参考标准
- **功能开发**：确定代码应该存放的位置
- **架构调整**：记录和规划项目结构变更
- **交接文档**：项目交接时的重要参考资料

## 2. 完整目录结构

```
d:/mcp-market/MCP-Market/
├── public/                  # 静态资源
│   └── vite.svg
├── src/                     # 源代码
│   ├── api/                 # API接口
│   │   ├── mcp/             # MCP相关API
│   │   │   ├── debug.ts     # 调试接口
│   │   │   ├── detail.ts    # 详情接口
│   │   │   ├── installed.ts # 已安装服务接口
│   │   │   ├── list.ts      # 列表接口
│   │   │   ├── status.ts    # 状态接口
│   │   │   └── tools.ts     # 工具接口
│   │   ├── mcp.ts           # MCP主接口
│   │   └── request.ts       # 请求封装
│   ├── assets/              # 静态资源
│   │   ├── global.css       # 全局样式
│   │   ├── vue.svg
│   │   └── logos/           # 品牌logo
│   ├── components/          # 公共组件
│   │   ├── MarketHeader.vue # 头部组件
│   │   ├── MCPDetail.vue    # MCP详情组件
│   │   └── MCPMarket.vue    # MCP市场组件
│   ├── mock/                # Mock数据
│   │   └── index.ts         # Mock入口
│   ├── router/              # 路由配置
│   │   └── index.ts
│   ├── store/               # 状态管理
│   │   └── index.ts
│   ├── styles/              # 样式文件
│   ├── types/               # 类型定义
│   │   └── mcp.ts           # MCP类型
│   ├── views/               # 页面视图
│   │   ├── APIPage.vue      # API页面
│   │   ├── DebugPage.vue    # 调试页面
│   │   └── SubmitPage.vue   # 提交页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── .gitignore
├── index.html               # 入口HTML
├── package.json             # 项目配置
├── package-lock.json
├── tsconfig.json            # TS配置
└── vite.config.ts           # Vite配置
```

## 3. 核心功能模块

### 3.1 MCP市场
- 组件: `MCPMarket.vue`
- 路由: `/mcp-market`
- 功能:
  - MCP服务列表展示
  - 搜索与筛选
  - 分页加载

### 3.2 MCP详情
- 组件: `MCPDetail.vue`
- 路由: `/mcp-details/:id`
- 功能:
  - MCP服务详情展示
  - 工具调用界面
  - 资源访问界面

### 3.3 MCP调试
- 组件: `DebugPage.vue`
- 路由: `/mcp-debug`
- 功能:
  - MCP服务器连接状态检测
  - 工具调试执行
  - 调试结果展示

## 4. 技术栈
- Vue 3 + Composition API
- TypeScript
- Vite
- Element Plus UI
- Axios
- Vue Router
- Pinia (状态管理)
