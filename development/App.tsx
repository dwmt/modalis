import { defineComponent } from 'vue'
import { ModalisProvider, ModalisView } from '../src'
import { Page } from './Page'

export const AppWithUse = defineComponent({
	setup() {
		return () => (
			<div>
				<h1>Application with ModalisView and vue plugin</h1>
				<Page />
				<ModalisView />
			</div>
		)
	},
})
export const AppWithProvider = defineComponent({
	setup() {
		return () => (
			<div>
				<h1>Application with ModalisProvider</h1>
				<ModalisProvider>
					<Page />
				</ModalisProvider>
			</div>
		)
	},
})
