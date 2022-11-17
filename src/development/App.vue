<template lang="pug">
div
	h1 Hello
	ModalisProvider
		div asd
		Page
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { ModalisProvider } from '..'
import Page from './Page.vue'
export default defineComponent({
	components: { ModalisProvider, Page },
})
</script>
