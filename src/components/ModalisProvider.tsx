import { defineComponent, provide, useSlots, Fragment } from 'vue'

import { createContext, modalisContextKey } from '../context'
import { ModalRenderer } from './ModalRenderer'

export const ModalisProvider = defineComponent({
	setup() {
		const context = createContext()
		const slots = useSlots()
		provide(modalisContextKey, context)
		return () => (
			<Fragment>
				{slots.default?.()}
				<ModalRenderer context={context} />
			</Fragment>
		)
	},
})
