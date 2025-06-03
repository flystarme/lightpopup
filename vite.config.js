import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'dist', // 默认即可
        assetsDir: 'lightpopup', // 把 js 和 css 都打进 lightpopup 文件夹
        rollupOptions: {
        input: 'index.html',
        output: {
            entryFileNames: 'lightpopup/lightpopup.min.js',
            assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                    return 'lightpopup/lightpopup.min.css';
                }
                return 'lightpopup/[name].[ext]';
            },
        }
        },
        emptyOutDir: true,
        minify: 'terser', // 可选，更强压缩
    },
    server:{
        host: '0.0.0.0',
        port: 5000
    }
})
