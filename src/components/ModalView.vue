<template>
<div class="modalis" :class="{'foreground': activeModal && activeModal.place === name}">
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
	height 100vh
	top 0
	left 0
	z-index 500
	pointer-events none
	&.foreground
		pointer-events auto
</style>
