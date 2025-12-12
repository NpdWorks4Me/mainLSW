import path from 'node:path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'icons/*.png'],
			manifest: {
				name: 'Little Space World',
				short_name: 'LSWorld',
				description: 'A Safe Place for LittleSpace',
				theme_color: '#0d1a3e',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
				],
			},
		}),
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/phaser')) {
						return 'phaser';
					}
					if (id.includes('node_modules/react') || 
						id.includes('node_modules/react-dom') || 
						id.includes('node_modules/framer-motion') ||
						id.includes('node_modules/@supabase')) {
						return 'vendor';
					}
				}
			}
		}
	}
});
