import { createApp } from 'vue'
import {createModalis, ModalType} from '../src/Modalis'
import App from './App.vue'
import ExampleModalComponent from './ExampleModalComponent.vue'
import ExampleReturnModalComponent from './ExampleReturnModalComponent.vue'

const modalis = createModalis()

modalis.registerModal({
	name: 'exampleModal',
	type: ModalType.Modal,
	singleton: false,
	component: ExampleModalComponent
})

modalis.registerModal({
	name: 'returnModal',
	type: ModalType.Modal,
	singleton: true,
	component: ExampleReturnModalComponent
})

createApp(App).use(modalis).mount('#app')
