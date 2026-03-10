import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: '0.0.0.0',  // 允许所有 IP 访问
        port: 5173,        // 指定端口号
        // 可选：设置局域网访问
        hmr: {
            clientPort: 5173
        }
    }
})