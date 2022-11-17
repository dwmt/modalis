import { defineComponent } from 'vue'
import { useExampleModal, ErrorOne, ErrorTwo } from './ExampleModalComponent'

export const Page = defineComponent({
	setup() {
		const { showModal: showExampleModal } = useExampleModal()
		const showExample = async () => {
			try {
				const asd = await showExampleModal({
					body: 'asd',
					title: 'kek',
				})
				console.log(asd.num)
			} catch (error: unknown) {
				if (error instanceof ErrorOne) {
					console.log('ErrorOne occured')
				} else if (error instanceof ErrorTwo) {
					console.log('ErrorTwo occured')
				} else {
					console.log('An unexpected error occured')
				}
			}
		}
		return () => (
			<div>
				<button onClick={showExample}>Show example modal</button>
			</div>
		)
	},
})
