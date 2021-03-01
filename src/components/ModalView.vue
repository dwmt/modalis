<template lang="pug">
div.modalis(:class="{'foreground': activeModal && activeModal.place === name, 'screen': height !== 'full', 'full': height === 'full'}")
	component(
		:is="activeModal.component"
		v-if="activeModal && activeModal.place === name"
		:modalID="activeModal.key"
	)
</template>
<script lang="ts">
import { defineComponent, computed, onBeforeMount, ref } from 'vue'
import { useModalis } from '../Modalis'
export default defineComponent({
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
	setup (props) {
		const $modalis = useModalis()
		const activeModal = computed(() => $modalis.activeModal)
		const name = ref('')
		onBeforeMount(() => {
			if (props.placeName === 'default') {
				throw new Error('[Modalis] Place name \'default\' is reserved!')
			}
			name.value = props.placeName || 'default'
			$modalis.registerPlace(props.placeName || 'default')
		})
		return {
			activeModal,
			name
		}
	}
})
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
