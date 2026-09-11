import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 75 },
            webp: { quality: 80 },
            avif: { quality: 70 },
        }),
    ],
    resolve: {
        alias: {
            'assets': path.resolve(__dirname, './src/assets'),
            'Array': path.resolve(__dirname, './src/Array'),
            'Utils': path.resolve(__dirname, './src/utils'),
            'utils': path.resolve(__dirname, './src/utils'),
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
            'views': path.resolve(__dirname, './src/views'),
        },
    },
    build: {
        target: "esnext",
        minify: "esbuild",
        cssCodeSplit: true,
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("firebase") || id.includes("@firebase")) {
                            return "vendor-firebase";
                        }
                        if (id.includes("framer-motion")) {
                            return "vendor-motion";
                        }
                        if (id.includes("jspdf") || id.includes("html2canvas")) {
                            return "vendor-export";
                        }
                        if (id.includes("konva") && !id.includes("react-konva")) {
                            return "vendor-konva";
                        }
                        // Unifica o ecossistema React, Emotion e MUI para evitar dependências circulares entre chunks
                        if (
                            id.includes("react") ||
                            id.includes("scheduler") ||
                            id.includes("@remix-run") ||
                            id.includes("@emotion") ||
                            id.includes("@mui")
                        ) {
                            return "vendor-framework";
                        }
                        return "vendor-libs";
                    }
                    if (id.includes("src/Array/") || id.includes("src\\Array\\")) {
                        return "db-compendios";
                    }
                }
            }
        }
    },
    server: {
        port: 3000,
        open: true,
    },
    envPrefix: ['VITE_', 'REACT_APP_'],
})