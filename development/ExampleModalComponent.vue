<template>
	<div class="example-modal">
		<div class="modal-container">
			<div>{{ props }}</div>
			<div class="modal-title">{{ props.title }}</div>
			<div class="modal-body">{{ props.body }}</div>
			<div class="modal-footer">
				<button @click="close">Close</button>
				<button @click="errorOne">Error 1</button>
				<button @click="errorTwo">Error 2</button>
				<button @click="error">Error unexpected</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ErrorOne, ErrorTwo } from './useExampleModal'
export type ModalData = {
	title: string
	body: string
}

export type ReturnType = {
	num: number
}
const props = defineProps<ModalData>()
const emit = defineEmits<{
	(e: 'return', data: ReturnType): void
	(e: 'throw', error: unknown): void
}>()
const close = () => {
	emit('return', { num: 12 })
}
const error = () => {
	emit('throw', new Error('Random error'))
}
const errorOne = () => {
	emit('throw', new ErrorOne('Random error'))
}
const errorTwo = () => {
	emit('throw', new ErrorTwo('Random error'))
}
</script>

<style lang="stylus">
.example-modal
	position absolute
	top 0
	left 0
	width 100vw
	height 100vh
	display flex
	justify-content center
	align-items center
	.modal-container
		display flex
		flex-direction column
		width 20rem
		background-color white
		border-radius 15px
		-webkit-box-shadow 4px 3px 15px -4px rgba(0,0,0,0.75)
		-moz-box-shadow 4px 3px 15px -4px rgba(0,0,0,0.75)
		box-shadow 4px 3px 15px -4px rgba(0,0,0,0.75)
		.modal-title
			display block
			text-align center
			padding 1rem 3rem
		.modal-body
			display block
			text-align left
			padding 1rem 3rem
		.modal-footer
			display block
			text-align center
			padding 1rem 3rem
			button
				padding 1rem
				border 1px solid black
</style>
