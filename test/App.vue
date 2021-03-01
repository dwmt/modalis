<template lang="pug">
div
	div
		button(@click="$modalis.showModal('exampleModal', {title: 'Example title', body: 'Example body text'})") Show example modal
		button(@click="returnModal") Sho0w return modal
	modal-view
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
	methods: {
		async returnModal () {
			let val = await this.$modalis.showModal('returnModal', {title: 'Example title'})
			console.log(val)
		},
	}
})
</script>
