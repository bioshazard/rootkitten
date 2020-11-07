<template>
  <div class="zk">
		<h1>Zettelkasten</h1>
		<div class="pure-g zk-root">
			<div class="pure-u-1-5">
				<div class="zkRootCards">
					<h2><router-link to="/zk/new">Root Cards</router-link></h2>
					<div v-for="record in rootCards" :key="record.id">
						<router-link :to="'/zk/view/' + zkgun.urlUuidTitle(record)">
							{{record.title}}
						</router-link>

						<!-- <a href="/zk/" @click="explore(record.id)">
							{{record.content}}
						</a> -->
					</div>
				</div>
			</div>
			<div class="pure-u-4-5">
				<router-view :key="$route.fullPath"/>
			</div>
		</div>
  </div>
</template>

<script>
/*

# ZK Component

Zettelkasten means "Card Box"

// http://elasticlunr.com/

## Functionality

* Subject Index
* Basically Twitter, but...
  * Titled posts

## Structure

get(zk).
  get(timetree).get(y).get(m).get(d).get(h).get(m).get(s).set(uuid...)
  get(tags).set(capitalism,borders,healthcare,peopleware,...)
  get(root).
    get(uuid1).put({
      content: "lorem ipsum",
      children.set(
        get(uuid1a).put({
          content: "lorem ipsum",
          parent: <zks-root.index.uuid1>
          created: <timetree.ymdhms>
          children.set(...)
        })
      )
    }),
    get(uuid2).put(...)

* Add Sources (title, reference)
* List Sources

*/
  export default {
    created() {
      console.clear()
      console.log('Component has been created!');
      this.loadRootCards()

			// console.log(this.$parent)
    },
    data () {
      return {
        rootCards: { },
        replyCards: { },
        newCardData: {
            content: null,
            parent: null
        },
				currentParentExplore: 0,
				exploreCard: {
					title: "test",
					content: "asdf"
				}
      }
    },
		computed: {
			// count () {
			//   return this.$store.state.count
			// }
			gunTest () {
				return 'asdf';
			// this.$store.getters.gunTest
			}
		},
    methods: {
      // Enable listeners on root cards index, update list
      loadRootCards: function() {
        console.log("# Load Root Cards")
        this.rootCards = { }
				// this.$gun.get('zk').get('root').on(this.updateRootCardsUI2.bind(this))
        this.$gun.get('zk').get('root').map().on(this.updateRootCardsUI.bind(this))
      },
      updateRootCardsUI: function(val, id) {
        val['id'] = id
        //val.pop("_")
        val["_"] = null

				// https://vuejs.org/v2/api/#Vue-set
				// Array reactivity requires updates through Vue.set
				this.$set(this.rootCards, id, val)

				console.log("ROOT UPDATED")
      },
      setParent: function(parentId) {
        console.log(parentId)

        this.newCardData.parent = parentId
      },
      // Reply explorer
      loadReplyCards: function(parentId) {
        console.log("# Load Reply Cards under",parentId)

        // TODO: Why doesn't this work in Vue, but it works in console with var g = Gun()??
        // this.$gun.get(parentId).get('replies').map().once((v,k) => console.log(k,v.content))
        // this.$gun.get('5ffd5c16-f769-44f1-a7ab-772140e9f273').get('replies').map().once((v,k) => console.log(k,v))

        // This works around the above weirdness... I swear .get(x).get(y) was exactly like x/y...
        // this.$gun.get('5ffd5c16-f769-44f1-a7ab-772140e9f273/replies').map().once((v,k) => console.log(k,v))
        // this.$gun.get(parentId + '/replies').map().once(this.updateReplyCardsUI.bind(this))

        // TODO: Because I can not use .once, I must unset the .on in loadReplyCards
        // this.$gun.get(this.newCardData.parent + '/replies').map().off(this.updateReplyCardsUI.bind(this))

				// this.$gun.get(this.currentParentExplore + '/replies').map().off()
				// this.currentParentExplore = parentId
				this.replyCards = {}
        this.$gun.get(parentId + '/replies').map().on(this.updateReplyCardsUI.bind(this))
      },
      updateReplyCardsUI: function(val, id) {
        console.log("# Add Reply")
        console.log(id)
        console.log(val)

        val['id'] = id
        //val.pop("_")
        val["_"] = null
        // this.rootCards.push(val)
        this.replyCards[id] = val

        console.log(this.replyCards)
      },
			explore: function(id) {
				this.exploreCard = { }
				this.$gun.get(id).once(function(v,k){
					// console.log(this.newCardData.content)
					console.log(k, v.content)

					// Load up explorer cards
					this.exploreCard = v
				}.bind(this))
			}
    }
  }
</script>

<style scoped>
	.zkRootCards {
		border-right: 1px solid black;
		background: #eee;
	}
  textarea {
    width: 100%;
    height: 100px;
  }
	.zk-root > div > div {
		padding: 10px;
	}
	/*
  .zk-card {
    border: 1px solid black;
    margin-bottom: 10px;
  }
  .zk-card > div {
    padding: 5px;
  }
  .zk-card-title {
    background: #eee;
    border-bottom: 1px solid black;
  }
  .zk-card-tags {
  } */
</style>
