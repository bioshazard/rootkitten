<style media="screen">
	.newCard textarea {
		width: 100%;
		height: 150px;
		margin-bottom: 10px;
		padding: 5px;
	}
	.newCard .submit {
		width: 100%;
		height: 60px;
	}
	.newCard .title {
		width: 100%;
		margin-bottom: 10px;
		font-size: 58px;
		padding: 5px;
	}
</style>

<template>
	<div class="">
		<h2><input type="text" size="42" placeholder="Parent" v-model="newCardData.parent"> / New Card</h2>
		<div class="newCard">
			<form @submit.prevent="addCard">
				<input ref="title" type="text" class="title" placeholder="Title" v-model="newCardData.title">
				<textarea v-model="newCardData.content" placeholder="Thoughts?" name="name"></textarea>
				<input class="submit" type="submit" name="" value="Submit">
			</form>
		</div>
	</div>
</template>

<script>
	export default {
		created() {
			if (this.$route.params.id === undefined) {
				this.newCardData.parent = null;
			} else {
				this.newCardData.parent = this.$route.params.id;
			}
		},
		mounted() {
			this.$refs.title.focus()
		},
		data() {
			return {
				newCardData: {
					title: null,
					content: null,
					parent: null
				}
			}
		},
		methods: {
			// addCard: function() {
			// 	console.log(this.newCardData)
			// 	console.log(this.zkgun.timeTree(this.$gun))
			// }
			// Add Card to the ZK, include parent if set
      addCard: function () {
        console.log("# Add Card")
        console.log(this.newCardData)

        if(this.newCardData.content === null) {
          console.log("Content cant be null. Not saving...")
          return
        }

        // Create Card Entry
				var newUUID = this.$uuid.v4()
        var newCardNode = this.$gun.get(newUUID).put(this.newCardData)

        // Index to current timestamp
        var newCardTimestamp = this.zkgun.timeTree()
        newCardTimestamp.set(newCardNode)
        newCardNode.get('created').put(newCardTimestamp)

        // Add to root (else as reply if parent is set)
        if (this.newCardData.parent === null) {
          this.$gun.get('zk').get('root').set(newCardNode)
        } else {
          var parentNode = this.$gun.get(this.newCardData.parent)
          parentNode.get('replies').set(newCardNode)
          newCardNode.get('parent').put(parentNode)
        }

				var encodeDest = this.zkgun.urlUuidTitle({id:newUUID,title:this.newCardData.title})

        // Reset Form Data
        this.newCardData = { content: null, parent: null, title: null }

				// Send to viewer
				this.$router.push('/zk/view/' + encodeDest)
      },
		}
	}
</script>
