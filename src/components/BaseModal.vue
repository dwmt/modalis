<script>
import BaseModalProps from './BaseModal.props'
export default {
	name: 'BaseModal',
	props: BaseModalProps,
	computed: {
		data () {
			return this.$modalis.getModalData(this.modalID) || {}
		}
	},
	methods: {
		async showModal (name, data, options) {
			return await this.$modalis.showModal(name, data, Object.assign(options, {parent: this.modalID}))
		},
		async showError (name, data, options) {
			return await this.$modalis.showError(name, data, Object.assign(options, {parent: this.modalID}))
		},
		async showConfirmation (name, data, options) {
			return await this.$modalis.showConfirmation(name, data, Object.assign(options, {parent: this.modalID}))
		},
		async close () {
			await this.$modalis.closeModal(this.modalID)
		},
		async return (returnValue) {
			await this.$modalis.returnModal(this.modalID, returnValue)
		},
		async throw (returnValue) {
			await this.$modalis.throwModal(this.modalID, returnValue)
		}
	},
	errorCaptured (err) {
		console.log('[Modalis] Error captured during modal rendering...', err)
		console.log('[Modalis] Cleaning up the mess...')
		this.close()
		this.$modalis.showError('modalRenderingError', {error: err}, {})
	}
}
</script>
