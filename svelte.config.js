import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' 
		  ? '"production"'
		  : '"development"'
	  },
	  babel: false,
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		files: {
			serviceWorker: 'src/my-sw.ts', // or `src/my-sw.ts`
		  }
	}
};

export default config;
