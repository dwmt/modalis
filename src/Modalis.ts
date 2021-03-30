export type {IModalStore} from './Store'
export {Store, createModalis, ModalType} from './Store'

export {ModalCompositionMixin} from './CompositionMixin'
export {useModal, useModalis} from './composition'

import BaseModalComponent from './components/BaseModal.vue'
export const BaseModal = BaseModalComponent