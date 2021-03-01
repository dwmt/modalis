<script lang="ts">
// @ts-nocheck
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'BaseModal',
	props: {
		modalID: {
			type: String,
			required: true
		}
	},
	computed: {
		data (): any {
			return this.$modalis.getModalData(this.modalID) || {}
		}
	},
	methods: {
		async showModal (name, data, options): Promise<any> {
			return await this.$modalis.showModal(name, data, Object.assign(options, {parent: this.modalID}))
		},
		async showError (name, data, options): Promise<any> {
			return await this.$modalis.showError(name, data, Object.assign(options, {parent: this.modalID}))
		},
		async showConfirmation (name, data, options): Promise<any> {
			return await this.$modalis.showConfirmation(name, data, Object.assign(options, {parent: this.modalID}))
		},
		close (): void {
			this.$modalis.closeModal(this.modalID)
		},
		return (returnValue): void {
			this.$modalis.returnModal(this.modalID, returnValue)
		},
		throw (returnValue): void {
			this.$modalis.throwModal(this.modalID, returnValue)
		}
	},
	errorCaptured (err) {
		console.log('[Modalis] Error captured during modal rendering...', err)
		console.log('[Modalis] Cleaning up the mess...')
		this.close()
		this.$modalis.showError('modalRenderingError', {error: err}, {})
	}
})
</script>
