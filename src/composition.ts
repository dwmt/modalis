import { inject, onErrorCaptured, useAttrs } from 'vue'
import { modalisStoreKey } from './symbols'
import { ModalComposite, IModalStore } from './Store'


export function useModalis(): IModalStore {
  return inject(modalisStoreKey)!
}

export function useModal<T = any>(): ModalComposite<T> {
	const props = useAttrs()
	const modalID = props.modalID as string
	let $modalis = inject(modalisStoreKey)!

	if(!props || !props.modalID || !$modalis.modalExists(modalID)) {
		throw new Error('Modal not exists!')
	}

	onErrorCaptured((err) => {
		console.log('[Modalis] Error captured during modal rendering...', err)
		console.log('[Modalis] Cleaning up the mess...')
		$modalis.closeModal(modalID)
		$modalis.showError('modalRenderingError', {error: err}, {}).catch(console.error)
	})

	const modalComposite: ModalComposite<T> = {
		data: $modalis.getModalData<T>(modalID),
		async showModal(name: string, data: any, options: any): Promise<any> {
			return await $modalis.showModal(name, data, Object.assign({}, options, { parent: modalID }))
		},
		async showError (name, data, options): Promise<any> {
			return await $modalis.showError(name, data, Object.assign(options, {parent: modalID}))
		},
		async showConfirmation (name, data, options): Promise<any> {
			return await $modalis.showConfirmation(name, data, Object.assign(options, {parent: modalID}))
		},
		close(): void {
			$modalis.closeModal(modalID)
		},
		return (returnValue): void {
			$modalis.returnModal(modalID, returnValue)
		},
		throw (returnValue): void {
			$modalis.throwModal(modalID, returnValue)
		}
	}

	return modalComposite
}
