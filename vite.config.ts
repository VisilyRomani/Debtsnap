import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		VitePWA({
			includeAssets: ['icon.png', 'favicon.svg'],
			manifest: {
				name: 'DebtSnap',
				short_name: 'DebtSnap',
				description:
					'Streamline your finances with our debt tracking app - effortlessly manage IOUs and split expenses among friends.',
				theme_color: '#f1fffa',
				icons: [{ src: 'icon.png', sizes: '400x400', type: 'image/png' }]
			}
		}),
		sveltekit()
	]
});
