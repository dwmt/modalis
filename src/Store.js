import BaseModalComponent from './components/BaseModal.vue'
import ModalRenderingErrorComponent from './components/ModalRenderingError.vue'
import ModalView from './components/ModalView.vue'

let Vue

function assert (condition, msg) {
	if (!condition) throw new Error(`[Modalis] ${msg}`)
}

// https://stackoverflow.com/a/2117523
function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export class Store {
	constructor (config = {}) {
		if (!Vue && typeof window !== 'undefined' && window.Vue) {
			install(window.Vue)
		}
	
		if (process.env.NODE_ENV !== 'production') {
			assert(Vue, `must call Vue.use(Modalis) before creating a store instance.`)
			assert(typeof Promise !== 'undefined', `Modalis requires a Promise polyfill in this browser.`)
			assert(this instanceof Store, `store must be called with the new operator.`)
		}

		this._modals = {}

		this._masks = {}

		this._places = []

		this.strictMode = config.strictMode || true

		const silent = Vue.config.silent
		Vue.config.silent = true
		
		this._vm = new Vue({
			data: {
				instances: {},
				activeModal: undefined
			}
		})
		
		Vue.config.silent = silent

		this.registerModal({
			name: 'modalRenderingError',
			type: 'error',
			component: ModalRenderingErrorComponent
		})

	}

	get instances () {
		return this._vm.$data.instances
	}

	get activeModal () {
		return this._vm.$data.activeModal
	}

	registerMask (maskObject) {
		assert(maskObject.name, 'You have tyo provide a name during Mask registration')
		assert(maskObject.component, 'You have to provide a VueComponent during Mask registration')
		assert(!this._masks[maskObject.name], `Mask object with name ${maskObject.name} is already exists!`)
		this._masks[maskObject.name] = maskObject.component
	}

	registerPlace (name) {
		assert(name, 'Place without a name is not registerable')
		assert(!this._places[name], `Place with name ${name} is already exists!`)
		this._places.push(name)
	}

	registerModal (modal) {
		assert(modal.name, 'Missing name')
		assert(modal.type, 'Missing type')
		assert(modal.component, 'Missing component')
		if (modal.name !== 'modalRenderingError' && this.strictMode) {
			assert(!this._modals[modal.name], `Modal with name ${modal.name} is already exists!`)
		}
		if (typeof modal.singleton === 'undefined') {
			modal.singleton = false
		}
		if(typeof modal.place === 'undefined') {
			modal.place = 'default'
		}
		this._modals[modal.name] = modal
	}

	_show(name, type, data, options) {
		assert(this._modals[name], 'Modal is not registered with name ${name}')
		if (options.place) {
			assert(this._places.includes(options.place), `Place is not registered with name ${options.place}`)
		}
		assert(!options.place && this._places.includes('default'), 'Default place is not registered. Place a modal-view somewhere in your project')
		assert(this._modals[name] && this._modals[name].type === type, `The type of the modal ${name} is not ${type}`)
		if (this._modals[name].singleton && Object.values(this._vm._data.instances).find((instance) => instance.name === name)) {
			throw new Error(`[Modalis] The modal ${name} is a singleton. You can't open more!`)
		}

		const modalOptions = this._modals[name]
		return new Promise ((resolve, reject) => {
			const uuid = generateUUID()
			let modalObject = {
				name: name,
				data: data,
				type: type,
				place: options.place || modalOptions.place,
				mask: options.mask || modalOptions.mask || undefined,
				parent: options.parent || undefined,
				active: true,
				component: modalOptions.component
			}

			this._vm._data.instances[uuid] = Object.assign({}, modalObject)

			this._hideOther(uuid)
			this._checkActiveModal()

			this._vm.$once(`return:${uuid}`, (val) => {
				if (val.type === 'error') {
					return reject(val.value)
				}
				return resolve(val.value)
			})
		})
	}

	_checkActiveModal () {
		let modal = undefined
		let keys = Object.keys(this._vm.$data.instances)
		keys.forEach((key) => {
			if(this._vm.$data.instances[key].active) {
				modal = this._vm.$data.instances[key]
				modal.key = key
			}
		})
		this._vm.$data.activeModal = modal
	}

	getModalData (ID) {
		return this._vm.$data.instances[ID].data
	}

	_hideOther (ID) {
		Object.keys(this._vm._data.instances).forEach((instanceID) => {
			if (instanceID === ID) {
				return
			}
			this._vm._data.instances[instanceID].active = false
		})
	}

	_activate (ID) {
		this._vm._data.instances[ID].active = true
	}

	async showModal (name, data = {}, options = {}) {
		return await this._show(name, 'modal', data, options)
	}

	async showError (name, data = {}, options = {}) {
		return await this._show(name, 'error', data, options)
	}

	async showConfirmation (name, data = {}, options = {}) {
		return await this._show(name, 'confirmation', data, options)
	}

	closeModal (ID) {
		this._vm.$emit(`return:${ID}`, {
			type: 'close',
			value: undefined
		})
		let parentID = (this._vm._data.instances[ID]) ? this._vm._data.instances[ID].parent : false
		delete this._vm._data.instances[ID]
		if (parentID) {
			this._activate(parentID)
		}
		this._checkActiveModal()
	}

	returnModal (ID, value) {
		this._vm.$emit(`return:${ID}`, {
			type: 'return',
			value
		})
		this.closeModal(ID)
	}
	throwModal (ID, value) {
		this._vm.$emit(`return:${ID}`, {
			type: 'error',
			value
		})
		this.closeModal(ID)
	}
}

function applyMixin (_Vue) {
	_Vue.mixin({ beforeCreate: init })
	function init () {
		const options = this.$options
		if (options.modalis) {
			this.$modalis = typeof options.modalis === 'function'
				? options.modalis()
				: options.modalis
		} else if (options.parent && options.parent.$modalis) {
			this.$modalis = options.parent.$modalis
		}
	}
}


export function install (_Vue) {
	if (Vue && _Vue === Vue) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				'[Modalis] already installed. Vue.use(Modalis) should be called only once.'
			)
		}
		return
	}
	Vue = _Vue
	Vue.component('ModalView', ModalView)
	applyMixin(Vue)
}

export const BaseModal = BaseModalComponent
