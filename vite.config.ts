import * as path from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import viteDtsPlugin from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		viteDtsPlugin({
			tsConfigFilePath: 'tsconfig.build.json',
			insertTypesEntry: true,
		}),
		checker({
			typescript: {
				tsconfigPath: 'tsconfig.build.json',
			},
		}),
		vueJsx({}),
	],
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'Modalis',
			fileName: 'modalis',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
