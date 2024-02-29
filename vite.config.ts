import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "./", //相对路径
	plugins: [react()],
	server: {
		host: "0.0.0.0",
		port: 8080,
		proxy: {
			"/smsProject": {
				// target: "http://39.98.85.26:28081/mobileActive",
				target: "http://192.168.2.14:28086/",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/smsProject/, ""), // 不可以省略rewrite
			},
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				// 支持内联 JavaScript
				javascriptEnabled: true,
			},
		},
	},
});
