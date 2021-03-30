import PackageJson from '../package.json'
export const version = PackageJson.version

export {Store, createModalis, ModalType, ModalStore} from './Store'

export {ModalCompositionMixin} from './CompositionMixin'
export {useModal, useModalis} from './composition'

import BaseModalComponent from './components/BaseModal.vue'
export const BaseModal = BaseModalComponent