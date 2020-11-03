<template>
	<div class="">
		<h2>
			View /
			<router-link :to="'/zk/view/' + displayCard.id">
				<!-- Must use $route value to update triggers -->
				<!-- {{$route.params.id}} -->
				{{displayCard.id}}
			</router-link>
		</h2>
		<p>{{displayCard.content}}</p>
		<router-link :to="'/zk/new/' + displayCard.id">
			Reply
		</router-link>

		<!-- <div class="zk-root-card zk-card" v-for="record in $parent.replyCards" v-bind:key="record.id">
			<div class="zk-card-title">
				{{record.id}}
				<span style="float: right">
				<a href="#" @click.prevent="setParent(record.id)">Reply</a> | <a href="#" @click.prevent="loadReplyCards(record.id)">View Replies</a>
				</span>
			</div>
			<div class="zk-card-content">
				{{record.content}}
			</div>
			<div class="zk-card-tags">
			Tags: TBD...
			</div>
		</div> -->
	</div>
</template>

<script>
	export default {
		created() {
			// console.clear()
			this.loadView(this.$route.params.id)
		},
		// beforeUpdate() {
		// 	// this.$store.commit('increment')
		// 	// console.log(this.$parent.newCardData.parent)
		// 	// this.loadView(this.$route.params.id)
		// },
		data () {
			return {
				displayCard: { }
			}
		},
		// beforeRouteEnter(to, from, next) {
		// 	this.loadView(this.$route.params.id)
		// 	next()
		// },
		// https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
		// beforeRouteUpdate(to, from, next) {
		// 	console.log(to)
		// 	console.log(from)
		// 	console.log("LOAD EVERY TIME")
		// 	this.loadView(this.$route.params.id)
		// 	next()
		// },
		// watch: {
		// 	$route(to, from) {
		//
		// 	}
		// }
		methods: {
			loadView: function (id) {
				// console.log(id);
				this.$gun.get(id).once(function(v, k) {
					console.log(k, v)
					this.displayCard = {
						id: k,
						content: v.content,
						parent: v.parent
					}
				}.bind(this))
			}
		},
		props: {
			msg: String
		}
	}

</script>
