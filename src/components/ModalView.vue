<template>
<div class="modalis" :class="{'foreground': activeModal && activeModal.place === name, 'screen': height !== 'full', 'full': height === 'full'}">
	<component :is="activeModal.component" v-if="activeModal && activeModal.place === name" :modalID="activeModal.key" />
</div>
</template>
<script>
import Vue from 'vue'
export default {
	name: 'ModalView',
	props: {
		placeName: {
			type: String,
			required: false
		},
		height: {
			type: String,
			required: false,
			default: 'screen'
		}
	},
	data () {
		return {
			name: ''
		}
	},
	computed: {
		activeModal () {
			return this.$modalis.activeModal
		},
		modalis () {
			return this.$modalis
		}
	},
	beforeMount () {
		if (this.placeName === 'default') {
			throw new Error('[Modalis] Place name \'default\' is reserved!')
		}
		this.name = this.placeName || 'default'
		this.$modalis.registerPlace(this.placeName || 'default')
	}
}
</script>

<style lang="stylus" scoped>
.modalis
	position absolute
	width 100vw
	top 0
	left 0
	z-index 500
	pointer-events none
	&.foreground
		pointer-events auto
	&.screen
		height 100vh
	&.full
		height 100%
</style>
