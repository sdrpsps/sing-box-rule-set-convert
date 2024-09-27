## 说明

- 本项目用于将 Clash yaml 分流规则文件转换为 Sing-box 的 headless json 分流规则，以便于在 Sing-box 中使用。
- 本项目使用 [js-yaml](https://github.com/nodeca/js-yaml) 库将 YAML 文件转换为 JSON 格式。
- 本项目使用 [dotenv](https://github.com/motdotla/dotenv) 库读取环境变量中的链接。

## 使用

1. 设置环境变量文件
   - 每个 yaml 文件一个环境变量，变量名为 `LINK_` 开头，值为 yaml 文件的链接。
   - 推荐使用 [blackmatrix7](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash) 的分流规则。
   - 例如：`LINK_APPLE` 对应 `https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Apple/Apple.yaml`

2. 安装 pnpm

3. 安装依赖

   ```bash
   pnpm install
   ```

4. 运行脚本

   ```bash
   pnpm run start
   ```

5. 生成的 json 文件在 output 目录下