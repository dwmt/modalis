<template lang="pug">
.modal-rendering-error
	.modal-mask
		.modal-card
			.card-header
				span Rendering the modal failed
			.card-body
				div An error occured during modal rendering. The modal closed automatically.
				div {{ data.error.message }}
			.card-footer
				a(@click="close") Close
</template>

<script>
import BaseModal from './BaseModal.vue'
export default {
	name: 'ModalRenderingError',
	extends: BaseModal
}
</script>

<style lang="stylus" scoped>
$padding=1.5rem
.modal-rendering-error
	height 100vh
	position fixed
	width 100vw
	z-index 100
.modal-mask
	display flex
	align-items center
	justify-content center
	background-color rgba(0,0,0,0.35)
	height 100%
	width 100%

.modal-rendering-error .modal-card
	display grid
	background white
	width 40rem
	border-radius 10px
	box-shadow 0 0 20px -10px rgba(105,36,131,0.15), 0 20px 30px -10px rgba(105,36,131,0.06)
	grid-template-rows 7rem 1fr 5rem

.card-header
	padding $padding
	border-bottom 1px solid gray
	display flex
	align-items center
	font-size 1.235rem

.card-body
	overflow-y auto
	padding $padding

.card-footer
	border-top 1px solid gray
	padding $padding
	display grid
	box-shadow 0 0 20px -10px rgba(105,36,131,0.15), 0 20px 30px -10px rgba(105,36,131,0.06)
	a
		cursor pointer
</style>
