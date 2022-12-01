# Modalis

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/71d84733b1b948c380e87d02f49f684f)](https://www.codacy.com/gh/dwmt/modalis/dashboard?utm_source=github.com&utm_medium=referral&utm_content=dwmt/modalis&utm_campaign=Badge_Grade)

We should have a nice description, but we are lazy.. 🤷‍♂️

## Table of contents

-   [Installation](#installation)
-   [Preparation](#preparation)
    -   [The Provider component way (Recommended)](#the-provider-component-way--recommended-)
    -   [The Vue plugin way](#the-vue-plugin-way)
-   [Modals](#modals)

## Installation

Npm:

```sh
npm i @dwmt/modalis
```

Yarn:

```sh
yarn add @dwmt/modalis
```

Pnpm:

```sh
pnpm i @dwmt/modalis
```

## Preparation

We will need to create a `ModalisContext` because each open modal will be registered in that context. We have two possible options for you:

1. The Provider component way (Recommended)
2. The Vue plugin way

### The Provider component way (Recommended)

First, you have to wrap your application with the `ModalisProvider` component, which will give you the possibility to use Modalis within your components. `ModalisProvider` does two things:

1. It creates a context, so you can access that context anywhere in your application
2. It renders the open modals and teleports them into the body

To achieve that, you only need to import `ModalisProvider` and wrap your app with it.

App.vue:

```vue
<template>
	<ModalisProvider>
		<router-view></router-view>
	</ModalisProvider>
</template>
<script lang="ts" setup>
import { ModalisProvider } from '@dwmt/modalis'
</script>
```

With that, every single component inside `ModalisProvider` can open up a modal.

| ⚠️ Only `ModalisProvider`'s children can access modalis. If you try to open a modal in a component, which is not the descendant of `ModalisProvider`, your code will fail! |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### The Vue plugin way

The old way to register Modalis is to install it with Vue's plugin system.

```typescript
import { createApp } from 'vue'
import { createContext } from '@dwmt/modalis'
import App from './App.vue'

const modalisContext = createContext()

createApp(App).use(modalisContext).mount('#app')
```

With that approach, your entire application can access the Modalis context.

You also need to render the modals, so you will need the `ModalView` too.

```vue
<template>
	<div>
		<router-view></router-view>
		<ModalisView />
	</div>
</template>
<script lang="ts" setup>
import { ModalisView } from '@dwmt/modalis'
</script>
```

## Modals

Cool! 🎉 You are all set. Now you can create and show modals. But... how?

Let us show you!

### Creating a modal configuration

The first step on the path of the modals is the `createModal` function. With that function, you can create a configuration object, which will represent how your newly created modal will behave.

The `createModal` function has two generic types:

1. DataType
2. ReturnType

By default both the `DataType` and `ReturnType` are `void`. That means, you can call your modal without parameters, and it won't return any value.

The signature of the function looks like this:

```typescript
createModal<DataType = void, ReturnType = void>(config: { component: Component }): Modal<DataType, ReturnType>
```

### Modal component

In the old version of Modalis, we had a completely different strategy to pass data to modals and manage their state. In `v2` Modal components are normal components, that way testing is much easier.

A modal component should always emit `return` and `throw` events. That's how the component communicates with Modalis. The modal component can also accept props.

Let's see the possible solutions:

Vue tsx way:

```tsx
import { defineComponent } from 'vue'

export type ExampleModalProps = {
	message: string
}
export type ExampleModalReturnType = {
	result: string
}

export class ExampleModalError extends Error {}

export const ExampleModal = defineComponent({
	props: {
		message: String,
	},
	emits: {
		return: (data: ExampleModalReturnType) => true,
		throw: (error: unknown) => true,
	},
	setup(props, { emit }) {
		const returnModal = () => emit('return', { string: 'Welcome!' })
		const throwError = () =>
			emit('throw', new ExampleModalError('Some error'))
		return () => (
			<div className="modal">
				<p>{props.message}</p>
				<button onClick="returnModal">Return</button>
				<button onClick="throwError">Throw error</button>
			</div>
		)
	},
})
```

Vue SFC defineComponent way:

```vue
<template>
	<div class="modal">
		<p>{{ message }}</p>
		<button @click="returnModal">Return</button>
		<button @click="throwError">Throw error</button>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export type ExampleModalProps = {
	message: string
}
export type ExampleModalReturnType = {
	result: string
}

export class ExampleModalError extends Error {}

export default defineComponent({
	props: {
		message: String,
	},
	emits: {
		return: (data: ExampleModalReturnType) => true,
		throw: (error: unknown) => true,
	},
	setup(props, { emit }) {
		const returnModal = () => emit('return', { result: 'Welcome!' })
		const throwError = () =>
			emit('throw', new ExampleModalError('Some error'))
		return {
			returnModal,
			throwError,
		}
	},
})
</script>
```

Vue SFC script setup way:

```vue
<template>
	<div class="modal">
		<p>{{ props.message }}</p>
		<button @click="returnModal">Return</button>
		<button @click="throwError">Throw error</button>
	</div>
</template>
<script script lang="ts">
export type ExampleModalProps = {
	message: string
}
export type ExampleModalReturnType = {
	result: string
}

export class ExampleModalError extends Error {}

const props = defineProps<ExampleModalProps>()
const emit = defineEmits<{
	(e: 'return', data: ExampleModalReturnType): void
    (e: 'throw', error: unknown): void
}>()
const returnModal = () => emit('return', { result: 'Welcome!' })
const throwError = () =>
    emit('throw', new ExampleModalError('Some error'))

</script>
```

Each method has its pros and cons, but in the end, it only matters, whether you can handle `return` and `throw` emits.

### Creating the modal composable

If you have the modal component, you can create your modal configuration now. If you use the tsx way or the defineComponent way, you can include the modal configuration in the same file. If you use script setup, then it's recommended to do the composable logic in a separate file!

```typescript
// useExampleModal.ts
import ExampleModal, {
	ExampleModalProps,
	ExampleModalReturnType,
} from './ExampleModal.vue'
import { createModal, useModal } from '@dwmt/modalis'

const exampleModal = createModal<ExampleModalProps, ExampleModalReturnType>({
	component: ExampleModal,
})

export const useExampleModal = () => useModal(exampleModal)
```

With that, you already created your modal composable. Now let's use your modal!

SomePage.vue

```vue
<template>
	<Layout>
		<h1>SomePage header</h1>
		<input v-model="message" />
		<p>Result: {{ result }}</p>
		<button @click="showModal">Show my modal</button>
	</Layout>
</template>
<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useExampleModal } from './useExampleModal'

const message: Ref<string> = ref<string>('')
const result: Ref<string> = ref<string>('')

const { show: showExampleModal } = useExampleModal()

const showModal = async () => {
	result.value = await showExampleModal({ message: message.value })
}
</script>
```

Voilá! You are ready to go! Also, your now typesafe as far as typescript is typesafe!
