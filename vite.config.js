import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            'assets': path.resolve(__dirname, './src/assets'),
            'Array': path.resolve(__dirname, './src/Array'),
            'Utils': path.resolve(__dirname, './src/Utils'),
            'pages': path.resolve(__dirname, './src/pages'),
            'APIs': path.resolve(__dirname, './src/APIs'),
            'styles': path.resolve(__dirname, './src/styles'),
            'components': path.resolve(__dirname, './src/components'),
            'contexts': path.resolve(__dirname, './src/contexts'),
            'src': path.resolve(__dirname, './src'),
            'layouts': path.resolve(__dirname, './src/layouts'),
            'theme': path.resolve(__dirname, './src/theme'),
            'service': path.resolve(__dirname, './src/service'),
            'config': path.resolve(__dirname, './src/config'),
            'hooks': path.resolve(__dirname, './src/hooks'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
})