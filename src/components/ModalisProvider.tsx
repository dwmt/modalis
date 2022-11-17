import { defineComponent, provide, useSlots, Fragment, Teleport } from 'vue'

import { createContext, modalisContextKey } from '../context'
import { ErrorBoundary } from './ErrorBoundary'
export const ModalisProvider = defineComponent({
	setup() {
		const context = createContext()
		const slots = useSlots()
		provide(modalisContextKey, context)
		return () => (
			<Fragment>
				{slots.default?.()}
				{context.modals.value.map((modal) => {
					const Component = modal.component
					return (
						<Teleport key={modal.key} to="body">
							<ErrorBoundary>
								<Component
									{...modal.data}
									onReturn={modal.return}
									onThrow={modal.throw}
								/>
							</ErrorBoundary>
						</Teleport>
					)
				})}
			</Fragment>
		)
	},
})
