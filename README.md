# Rainio Tab

一个美观、功能丰富的浏览器新标签页扩展，为您的浏览器体验增添个性化色彩。

## ✨ 功能特性

- **实时时间显示**：大字体数字时钟，支持响应式布局
- **智能搜索框**：快速访问搜索引擎
- **每日名言**：从多个API获取随机名言，增添文学气息
- **应用快捷方式**：可自定义的Dock栏，方便快速访问常用网站
- **动态背景**：支持视频背景，营造沉浸式体验
- **个性化设置**：可根据个人喜好调整界面元素

## 🛠️ 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS v4
- **状态管理**：React Hooks
- **数据库**：RxDB
- **动画效果**：GSAP, Motion
- **UI组件**：shadcn/ui, diceui, reactbits
- **图标库**：Lucide React, React Icons

## 📦 安装方式

### 从源码构建

0. **添加视频背景**
   - 将 `bg.mp4` 视频文件放入项目public目录作为视频背景

1. **克隆仓库**
   ```bash
   git clone
   cd rainio-tab
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **加载扩展**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions`
   - 开启「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择 `dist` 目录

## 🚀 开发指南

### 启动开发服务器

```bash
npm run dev
```

### 代码规范

```bash
npm run lint
```

### 预览构建结果

```bash
npm run preview
```

## 🎨 项目结构

```
rainio-tab/
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # UI组件
│   │   └── ui/         # 界面组件
│   ├── config/         # 配置文件
│   ├── db/             # 数据库操作
│   ├── hooks/          # 自定义Hooks
│   ├── lib/            # 工具函数
│   ├── schemas/        # 数据模式
│   ├── types/          # TypeScript类型定义
│   ├── App.tsx         # 应用主组件
│   └── main.tsx        # 应用入口
├── public/             # 公共资源
│   ├── icons/          # 扩展图标
│   ├── bg.mp4          # 背景视频
│   └── manifest.json   # 扩展配置
├── dist/               # 构建输出
└── package.json        # 项目配置
```

## 📱 界面预览

### 主界面
- 大型数字时钟显示
- 居中的搜索框
- 右侧名言展示
- 底部应用Dock栏
- 动态视频背景

### 功能亮点
- **响应式设计**：适配不同屏幕尺寸
- **多API名言**：从多个来源获取随机名言
- **可定制Dock**：添加/移除常用应用快捷方式
- **背景视频**：支持自定义视频背景

## 🔧 配置选项

### 外观设置
- 背景类型（视频/图片）
- 文字对齐方式
- 字体大小调整

### 功能设置
- 搜索引擎选择
- 名言API配置
- Dock栏应用管理

## 📚 资源来源

- **APP图标**：[jie jing ku](https://jiejingku.net/icon/)
- **像素字体**：[Ark Pixel Font](https://github.com/TakWolf/ark-pixel-font)
- **壁纸**：[bizhihui](https://www.bizhihui.com/p/22152.html)
- **动态壁纸**：[motionbgs](https://motionbgs.com/mario-pixel-room)
- **像素风图标**：[pixelarticons](https://pixelarticons.com/)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🌟 鸣谢

- 感谢所有开源库的贡献者
- 感谢提供免费API的服务提供商
- 感谢设计师们的创意灵感

---