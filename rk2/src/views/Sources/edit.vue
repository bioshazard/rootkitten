<template lang="html">
	<div class="">
		edit
	</div>
</template>

<script>
export default {
	created() {
		console.log("show edit")
		this.loadSourceEdit(this.$route.params.id)
	},
	methods: {
		loadSourceEdit: function(id) {
			console.log(id)
			this.$gun.get(id).once(function(v,k){
				console.log("EDIT > ONCE",k, v)
			})
		}
	}
}
</script>

<style lang="css" scoped>
</style>
