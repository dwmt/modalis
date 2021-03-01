import { InjectionKey } from 'vue'
import { ModalStore, ModalComposite } from './Store'

export const hasSymbol =
  typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const PolySymbol = (name: string) =>
  hasSymbol
    ? Symbol(name)
    : ('_m_') + name

export const modalisStoreKey = /*#__PURE__*/ PolySymbol('ms') as InjectionKey<ModalStore>
export const modalKey = /*#__PURE__*/ PolySymbol('ms') as InjectionKey<ModalComposite>
