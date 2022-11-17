import { createModal } from '../createModal'
import { useModal } from '../useModal'
import ExampleModalComponent, {
	type ModalData,
	type ReturnType,
} from './ExampleModalComponent.vue'

export class ErrorOne extends Error {}
export class ErrorTwo extends Error {}

const exampleModal = createModal<ModalData, ReturnType>({
	component: ExampleModalComponent,
})

export const useExampleModal = () => useModal(exampleModal)
