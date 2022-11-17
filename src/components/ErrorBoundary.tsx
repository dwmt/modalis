import { defineComponent, onErrorCaptured, ref, h, useSlots } from 'vue'

export const ErrorBoundary = defineComponent({
	name: 'ErrorBoundary',
	setup() {
		const slots = useSlots()
		const error = ref<boolean>(false)
		onErrorCaptured((err) => {
			error.value = true
			console.log(
				'[Modalis] Error captured during modal rendering...',
				err,
			)
		})
		return () =>
			error.value ? <p>Something went wrong</p> : slots.default?.()
	},
})
