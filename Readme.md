# 这是一个模仿manus的 demo 包括 client 端和 server端，目前效果还不完善，仍然需要优化和调整, 我周末抽时间优化

前端服务启动:
    ```shell
        cd client
        npm install pnpm
        pnpm install
        npm run dev
    ```

服务端启动
    注意要先在 server 目录下建一个 `tmp` 文件夹
    ``` shell
        cd server
        pip install -r requirements.txt
        python server.py
        
    ```

模型部署
    ``` shell
        ollama pull 你想要的模型
        ollama serve
    ```
