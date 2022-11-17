import { nanoid } from 'nanoid'
import {
	type Ref,
	ref,
	inject,
	type InjectionKey,
	computed,
	type DefineComponent,
	type App,
} from 'vue'

import { PolySymbol } from './symbols'

export type ModalInstance<DataType = any> = {
	id: number
	key: string
	data: DataType
	component: DefineComponent<any, any, any, any, any, any, any, any, any>
	return: Function
	throw: Function
}

export type ModalisContext = {
	instances: Ref<Map<string, ModalInstance>>
	modals: Ref<Array<ModalInstance>>
	push<DataType, ReturnType>(
		component: DefineComponent<any, any, any, any, any, any, any, any, any>,
		data: DataType,
	): Promise<ReturnType>
	install(app: App):void
}

export const modalisContextKey = /*#__PURE__*/ PolySymbol(
	'modalis-context',
) as InjectionKey<ModalisContext>

export function useContext(): ModalisContext {
	return inject(modalisContextKey)!
}

export function createContext(): ModalisContext {
	const instances = ref<Map<string, ModalInstance>>(new Map())
	const modals = computed(() => {
		return [...instances.value.values()].sort((a, b) =>
			a.id < b.id ? -1 : 1,
		)
	})
	const lastId = computed(() => {
		if (!instances.value.size) return 0
		return Math.max.apply(
			Math,
			modals.value.map((instance) => instance.id),
		)
	})
	const push = function <DataType = any, ReturnType = any>(
		component: DefineComponent,
		data: DataType,
	): Promise<ReturnType> {
		return new Promise((resolve, reject) => {
			const key = nanoid()
			const id = lastId.value + 1
			const returnCallback = (data: ReturnType) => {
				resolve(data)
				instances.value.delete(key)
			}
			const throwCallback = (error: unknown) => {
				reject(error)
				instances.value.delete(key)
			}
			const instance: ModalInstance = {
				id,
				key,
				component,
				data,
				return: returnCallback,
				throw: throwCallback,
			}
			instances.value.set(key, instance)
		})
	}
	const install = (app: App) => {
		app.provide(modalisContextKey, context)
	}
	const context = {
		instances,
		modals,
		push,
		install
	}
	return context
}
