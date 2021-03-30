import { inject, onErrorCaptured } from 'vue'
import { modalisStoreKey } from './symbols'
import { ModalComposite, IModalStore } from './Store'


export function useModalis(): IModalStore {
  return inject(modalisStoreKey)!
}

export function useModal(props: any): ModalComposite {
	let $modalis = inject(modalisStoreKey)!

	if(!props || !props.modalID || !$modalis.modalExists(props.modalID)) {
		throw new Error('Modal not exists!')
	}

	onErrorCaptured((err) => {
		console.log('[Modalis] Error captured during modal rendering...', err)
		console.log('[Modalis] Cleaning up the mess...')
		$modalis.closeModal(props.modalID)
		$modalis.showError('modalRenderingError', {error: err}, {})
	})

	const modalComposite: ModalComposite = {
		data: $modalis.getModalData(props.modalID),
		async showModal(name: string, data: any, options: any): Promise<any> {
			return await $modalis.showModal(name, data, Object.assign({}, options, { parent: props.modalID }))
		},
		async showError (name, data, options): Promise<any> {
			return await $modalis.showError(name, data, Object.assign(options, {parent: props.modalID}))
		},
		async showConfirmation (name, data, options): Promise<any> {
			return await $modalis.showConfirmation(name, data, Object.assign(options, {parent: props.modalID}))
		},
		close(): void {
			$modalis.closeModal(props.modalID)
		},
		return (returnValue): void {
			$modalis.returnModal(props.modalID, returnValue)
		},
		throw (returnValue): void {
			$modalis.throwModal(props.modalID, returnValue)
		}
	}

	return modalComposite
}
