import path from 'node:path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
	// Use relative base so built asset links are relative paths (important for shared hosting)
	base: './',
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
					{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
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
		sourcemap: 'inline',
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
			output: {
				manualChunks(id) {
						// Keep react & react-dom in their own chunk to avoid inflating the main index chunk.
						// Match several common path shapes (pnpm style paths, cjs builds, etc).
						if (
							id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') ||
							id.includes('/node_modules/.pnpm/react') || id.includes('/node_modules/.pnpm/react-dom') ||
							id.endsWith('/node_modules/react/index.js') || id.endsWith('/node_modules/react-dom/index.js')
						) return 'react';

						// Remix / router internals can be included from different packages (remix-run/router,
						// react-router, etc) so match any of these to keep routing code out of index
						if (
							id.includes('/node_modules/remix-run') || id.includes('/node_modules/@remix') ||
							id.includes('/node_modules/react-router') || id.includes('/node_modules/react-router-dom')
						) return 'router';
					// Put Phaser in its own large chunk
					if (id.includes('node_modules/phaser')) return 'phaser';

					// Supabase client can also be large; put it in its own chunk
					if (id.includes('node_modules/@supabase') || id.includes('node_modules/supabase')) return 'supabase';

					// Isolate large UI/animation libraries to reduce vendor chunk size
					if (id.includes('node_modules/framer-motion')) return 'framer-motion';
					if (id.includes('node_modules/react-router-dom')) return 'router';
					if (id.includes('node_modules/lucide-react')) return 'icons';

					// Page-specific or heavy component chunks
					if (id.includes('/src/pages/HomePage')) return 'home';
					if (id.includes('/src/components/GalacticHeroSection')) return 'home-hero';
					if (id.includes('/src/components/StarryBackground')) return 'starfield';
					if (id.includes('/src/pages/StorePage')) return 'store';

					// Isolate profile & product-detail pages if they grow large
					if (id.includes('/src/pages/ProfilePage')) return 'profile';
					if (id.includes('/src/pages/ProductDetailPage')) return 'product-detail';

					// Common vendor chunk for the rest of node_modules
					if (id.includes('node_modules')) return 'vendor';
				}
			}
		}
	}
});
