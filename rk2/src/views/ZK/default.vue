<template>
	<div class="">
		<h2>Explorer</h2>
		<div class="">
			Prop: {{msg}}
		</div>
		<div class="">
			<!-- {{$parent.exploreCard}} -->
			Content: {{$parent.exploreCard.content}}
		</div>
		<div class="">
			Global Store: {{this.$store.state.count}}
		</div>





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
			// this.$store.commit('increment')
			// console.clear()
			// console.log('Component has been created!');
			// console.log(this.$parent.newCardData.parent)
		},
		data () {
			return {
				// rootCards: { },
				// replyCards: { },
				// newCardData: {
				// 		content: null,
				// 		parent: null
				// },
				// currentParentExplore: 0
			}
		},
		methods: { },
		props: {
			msg: String
		}
	}

</script>
