import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		VitePWA({
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			includeAssets: ['icon.png', 'favicon.svg'],
			manifest: {
				name: 'DebtSnap',
				short_name: 'DebtSnap',
				description:
					'Streamline your finances with our debt tracking app - effortlessly manage IOUs and split expenses among friends.',
				theme_color: '#f1fffa',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		}),
		sveltekit()
	]
});
