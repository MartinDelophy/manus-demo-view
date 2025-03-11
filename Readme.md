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
3. 安装服务端所需的依赖包：
```shell
pip install -r requirements.txt
```
4. 运行服务端脚本：
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

## 后续计划
由于目前项目效果还存在不足，计划在周末对项目进行优化，包括但不限于修复已知问题、提升性能、优化用户体验等方面的工作。后续会根据优化的进展及时更新相关说明。 


