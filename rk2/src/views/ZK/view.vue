<style>
	.zkParent {
		border: 1px solid black;
		/* padding: 5px; */
		margin-bottom: 10px;

	}
	.zkParent h2 {
		margin-top: 0;
		background: #eee;
		padding: 5px;
	}

	.zkParent h4 {
		margin-top: 0;
		background: #eee;
		padding: 5px;
	}

	.zkDate {
		float: right;
	}

	.zkParent p {
		padding: 5px;
	}
	.zkReplyLink {
		width: fit-content;
		padding: 15px;
		/* border: 1px solid black; */
		background: #1E90FF;
		font-weight: bold;
		margin-bottom: 10px;
	}
	.zkReplyLink a {
		text-decoration: none;
		color: white;
	}
</style>

<template>
	<div class="">
		<div class="zkParent">
			<h4>
				<router-link v-if="!parentCard.empty" :to="'/zk/view/' + zkgun.urlUuidTitle(parentCard)">{{parentCard.title}}</router-link>
				<span v-else>Root</span> > <router-link :to="'/zk/view/' + zkgun.urlUuidTitle(displayCard)">{{displayCard.title}}</router-link>

				<span class="zkDate">
					{{zkgun.prettySlashDate(displayCard.created["#"])}}
				</span>
			</h4>

			<vue-markdown>{{displayCard.content}}</vue-markdown>
		</div>

		<div class="zkReplyLink">
			<router-link  :to="'/zk/new/' + displayCard.id">Reply</router-link>
		</div>

		<div class="zkParent" v-for="(reply,index) in replies" :key="index">
			<h4>
				<router-link :to="'/zk/view/' + zkgun.urlUuidTitle(reply)">
					{{reply.title}}
				</router-link>

				<span class="zkDate">
					{{zkgun.prettySlashDate(displayCard.created["#"])}}
				</span>

			</h4>
			<vue-markdown>{{reply.content}}</vue-markdown>
		</div>

<!--




		<h3>Replies</h3>
		<div class="" v-for="(reply,index) in replies" :key="index">
			<h4>
				<router-link :to="'/zk/view/' + zkgun.urlUuidTitle(reply)">
					{{reply.title}}
				</router-link>
			</h4>
			<p>{{reply.title}}</p>
		</div> -->

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
				parentCard: { empty: true },
				displayCard: { },
				replies: [ ]
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
						title: v.title,
						content: v.content,
						created: v.created,
						parent: v.parent
					}
				}.bind(this))

				this.$gun.get(id+'/replies').map().once(function(v,k){
					v.id = k
					this.replies.push(v)
				}.bind(this))

				this.$gun.get(id).get('parent').once(function(v){
					this.parentCard = {
						id: v.id,
						created: v.created,
						title: v.title
					}
				}.bind(this))
			}
		},
		props: {
			msg: String
		}
	}

</script>
