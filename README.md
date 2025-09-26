# FileMD5Guard - 文件重复检测工具

一个基于 React + TypeScript + Vite 构建的智能文件重复检测应用，使用 MD5 哈希算法快速识别重复文件，提供直观的可视化界面和完整的历史记录管理功能。

## 功能特性

- 🔍 **智能文件检测**: 使用 MD5 哈希算法快速识别重复文件
- 📊 **直观可视化界面**: 现代化的 React 界面，提供清晰的文件列表和检测结果
- 📝 **完整历史记录**: 记录所有检测历史，方便回溯和管理
- ⚡ **高性能处理**: 基于 Vite 构建，提供快速的开发和构建体验
- 💾 **本地存储**: 支持检测结果的本地持久化存储

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: CSS3 + 现代布局
- **哈希算法**: MD5
- **存储**: localStorage

## 快速开始

```bash
# 克隆项目
git clone https://github.com/zbsguilai/FileMD5Guard.git

# 进入项目目录
cd FileMD5Guard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
FileMD5Guard/
├── src/
│   ├── components/          # React 组件
│   │   ├── AppHeader.tsx   # 应用头部
│   │   ├── FileUpload.tsx  # 文件上传组件
│   │   ├── FileList.tsx    # 文件列表组件
│   │   └── HistoryPanel.tsx # 历史记录面板
│   ├── hooks/              # 自定义 Hooks
│   │   └── useFileDetection.ts # 文件检测逻辑
│   ├── utils/              # 工具函数
│   │   ├── md5Utils.ts     # MD5 计算工具
│   │   └── storage.ts      # 存储工具
│   ├── types/              # TypeScript 类型定义
│   │   └── file.ts         # 文件相关类型
│   └── App.tsx             # 主应用组件
├── public/                 # 静态资源
└── dist/                   # 构建输出目录
```

## 许可证

本项目采用 [Apache-2.0](LICENSE) 许可证。
