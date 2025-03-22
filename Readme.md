# 模仿Manus的项目Demo说明

## 项目概述
这是一个模仿Manus的项目demo，涵盖了client端和server端。当前项目的效果尚不完善，后续还需进行优化与调整。计划在周末抽出时间对其进行进一步的优化。

## 前端服务启动步骤
1. 进入 `client` 目录：
```shell
cd client
```
2. 安装 `pnpm`（如果尚未安装）：
```shell
npm install pnpm
```
3. 使用 `pnpm` 安装项目依赖：
```shell
pnpm install
```
4. 启动前端开发服务：
```shell
npm run dev
```

## 服务端启动步骤
1. **注意事项**：在启动服务端之前，需要先在 `server` 目录下创建一个 `tmp` 文件夹。
2. 进入 `server` 目录：
```shell
cd server
```
3. 创建 tmp 文件夹
```shell
mkdir tmp
```
4. 创建 .env 文件：
```shell
echo "OPENAI_API_KEY='你的OpenAI API Key'" > .env
```
5. 安装服务端所需的依赖包：
```shell
pip install -r requirements.txt
```
6. 配置环境文件 env.yml
复制或修改 `example.yml` 的内容到 `env.yml` 中
1. 运行服务端脚本：
```shell
python server.py
```

## 模型部署步骤
1. 使用 `ollama` 拉取你想要的模型：
```shell
ollama pull 你想要的模型
```
2. 启动 `ollama` 服务：
```shell
ollama serve
```

## Function call 说明
目前 Function_call 主要存在于 `plugins` 目录下
目录结构
    - XX 调用名称
    - index.py 函数出入参数
    - readme.md 函数出入参数说明

## 说明
目前跑的效果取决于模型的能力，可以通过修改 `server/prompts` 里面的提示词来让模型变得听话

## 后续计划
由于目前项目效果还存在不足，计划在周末对项目进行优化，包括但不限于修复已知问题、提升性能、优化用户体验等方面的工作。后续会根据优化的进展及时更新相关说明。 


