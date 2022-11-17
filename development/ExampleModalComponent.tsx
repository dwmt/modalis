import { defineComponent, defineProps, defineEmits } from 'vue'
import { createModal, useModal } from '../src'
import styles from './ExampleModalComponent.module.scss'
export type ModalData = {
	title: string
	body: string
}

export type ReturnType = {
	num: number
}

export class ErrorOne extends Error {}
export class ErrorTwo extends Error {}

export const ExampleModal = defineComponent({
	props: {
		title: String,
		body: String,
	},
	emits: {
		return(data: ReturnType) {
			return true
		},
		throw(error: unknown) {
			return true
		},
	},
	setup(props, { emit }) {
		const close = () => {
			emit('return', { num: 12 })
		}
		const error = () => {
			emit('throw', new Error('Random error'))
		}
		const errorOne = () => {
			emit('throw', new ErrorOne('Random error'))
		}
		const errorTwo = () => {
			emit('throw', new ErrorTwo('Random error'))
		}
		return () => (
			<div className={styles['example-modal']}>
				<div className={styles['modal-container']}>
					<div className={styles['modal-title']}>{props.title}</div>
					<div className={styles['modal-body']}>{props.body}</div>
					<div className={styles['modal-footer']}>
						<button onClick={close}>Close</button>
						<button onClick={errorOne}>Error 1</button>
						<button onClick={errorTwo}>Error 2</button>
						<button onClick={error}>Error unexpected</button>
					</div>
				</div>
			</div>
		)
	},
})

const exampleModal = createModal<ModalData, ReturnType>({
	component: ExampleModal,
})

export const useExampleModal = () => useModal(exampleModal)
