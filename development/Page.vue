<template>
	<div>
		<button @click="showExample">Show example modal</button>
	</div>
</template>

<script setup lang="ts">
import { useExampleModal, ErrorOne, ErrorTwo } from './useExampleModal'
const { showModal: showExampleModal } = useExampleModal()
const showExample = async () => {
	try {
		const asd = await showExampleModal({ body: 'asd', title: 'kek' })
		console.log(asd.num)
	} catch (error: unknown) {
		if (error instanceof ErrorOne) {
			console.log('ErrorOne occured')
		} else if (error instanceof ErrorTwo) {
			console.log('ErrorTwo occured')
		} else {
			console.log('An unexpected error occured')
		}
	}
}
</script>
