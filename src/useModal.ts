import { useContext } from './context'
import { Modal } from './createModal'

export function useModal<DataType = any, ReturnType = void>(
	modal: Modal<DataType, ReturnType>,
) {
	const { push } = useContext()
	const showModal = (data: DataType): Promise<ReturnType> => {
		return push(modal.component, data)
	}
	return {
		showModal,
	}
}
