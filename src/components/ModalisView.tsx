import { defineComponent } from 'vue'

import { ModalRenderer } from './ModalRenderer'
import { useContext } from '../context'

export const ModalisView = defineComponent({
	setup() {
		const context = useContext()
		return () => <ModalRenderer context={context} />
	},
})
