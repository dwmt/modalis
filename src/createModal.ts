import { markRaw, type DefineComponent } from 'vue'

export type Modal<DataType = any, ReturnType = void> = {
	component: DefineComponent<any, any, any, any, any, any, any, any, any>
}

export function createModal<DataType = void, ReturnType = void>({
	component,
}: {
	component: DefineComponent<any, any, any, any, any, any, any, any, any>
}): Modal<DataType, ReturnType> {
	return {
		component: markRaw(component),
	}
}
