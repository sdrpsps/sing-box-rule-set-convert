# Sing-box Rule Set Converter

本项目用于将 Clash YAML 规则转换为 Sing-box 的 JSON 格式。提供了一个用户界面，允许用户输入多个 YAML 链接，并生成相应的 JSON 输出。

## 功能

- 支持多个 YAML 链接输入
- 从 URL 获取 YAML 内容
- 将 Clash 格式的规则转换为 Sing-box 格式
- 为每个输入生成独立的 JSON 输出
- 提供下载选项，以 JSON 文件形式保存转换结果
- 使用选项卡界面显示多个转换结果

## 使用方法

1. 访问应用程序的 Web 界面
2. 在输入框中输入 YAML 文件的 URL
3. 如需添加多个链接，点击 "Add Link" 按钮
4. 输入所有需要转换的 YAML 链接后，点击 "Convert to JSON" 按钮
5. 转换完成后，可以在界面上查看转换结果
6. 使用 "Download" 按钮下载各个转换后的 JSON 文件

## 技术栈

- Next.js
- React
- TypeScript
- shadcn/ui 组件库
- Vercel 部署

## 开发

本项目使用 Next.js 框架开发。要在本地运行项目，请按照以下步骤操作：

1. 克隆仓库
2. 安装依赖：`pnpm install`
3. 运行开发服务器：`pnpm run dev`
4. 在浏览器中访问 `http://localhost:3300`

## 部署

本项目可以轻松部署到 Vercel 平台。只需将仓库连接到 Vercel 项目，它就会自动处理部署过程。

## 注意事项

- 确保提供的 YAML 链接是可公开访问的
- 转换过程可能需要一些时间，特别是当处理大型 YAML 文件时
- 如果遇到任何问题，请检查浏览器控制台以获取更多信息

## 贡献

欢迎提交 Pull Requests 来改进这个项目。如果你发现了 bug 或有新功能建议，请创建一个 issue。

## 致谢

- 本项目的 Web 界面由 [v0](https://v0.dev/) 生成