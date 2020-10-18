<template>
  <div class="zk">
    <h1>Zettelkasten</h1>
    <div class="">
      <h2>New Card</h2>
      <form @submit.prevent="addCard">
        <div class="">
          Parent: <input type="text" size="64" placeholder="Parent" v-model="newCardData.parent">
          <textarea v-model="newCardData.content" placeholder="Thoughts?" name="name"></textarea>
          <input type="submit" name="" value="Submit">
        </div>
      </form>
    </div>
    <div class="">
      <h2>Root Cards</h2>
      <div class="zk-root-card zk-card" v-for="record in rootCards" v-bind:key="record.id">
        <div class="zk-card-title">
          {{record.id}}
          <span style="float: right">
            <a href="#" @click.prevent="setParent(record.id)">Reply</a> | <a href="#" @click.prevent="loadReplyCards(record.id)">View Replies</a>

          </span>
        </div>
        <div class="zk-card-content">
          {{record.content}}
        </div>
        <!-- <div class="zk-card-tags">
          Tags: TBD...
        </div> -->
      </div>
      <div class="">
        <h2>Explorer</h2>
        <div class="zk-root-card zk-card" v-for="record in replyCards" v-bind:key="record.id">
          <div class="zk-card-title">
            {{record.id}}
            <span style="float: right">
              <a href="#" @click.prevent="setParent(record.id)">Reply</a> | <a href="#" @click.prevent="loadReplyCards(record.id)">View Replies</a>
            </span>
          </div>
          <div class="zk-card-content">
            {{record.content}}
          </div>
          <!-- <div class="zk-card-tags">
            Tags: TBD...
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  textarea {
    width: 100%;
    height: 100px;
  }
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
    /* background: #eee;
    border-top: 1px solid black; */
  }
</style>

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
    },
    data () {
      return {
        rootCards: { },
        replyCards: { },
        newCardData: {
            content: null,
            parent: null
        },
      }
    },
    methods: {
      timeTree: function(timestamp = null) {
        var d
        // If no timestamp is provided, assume "now"
        if(timestamp === null) {
          d = new Date()
        } else {
          d = new Date(timestamp)
        }
        // use .back(X) to dial back date scope
        return this.$gun
          .get(d.getFullYear())
          .get(d.getMonth())
          .get(d.getDay())
          .get(d.getHours())
          .get(d.getMinutes())
          .get(d.getSeconds())
      },
      // Enable listeners on root cards index, update list
      loadRootCards: function() {
        console.log("# Load Root Cards")
        this.rootCards = { }
        this.$gun.get('zk').get('root').map().on(this.updateRootCardsUI.bind(this))
      },
      // Function to update list from load
      updateRootCardsUI: function(val, id) {
        val['id'] = id
        //val.pop("_")
        val["_"] = null
        // this.rootCards.push(val)
        this.rootCards[id] = val
      },
      setParent: function(parentId) {
        console.log(parentId)
        this.newCardData.parent = parentId
      },
      // Add Card to the ZK, include parent if set
      addCard: function () {
        console.log("# Add Card")
        console.log(this.newCardData)

        if(this.newCardData.content === null) {
          console.log("Content cant be null. Not saving...")
          return
        }

        // Create Card Entry
        var newCardNode = this.$gun.get(this.$uuid.v4()).put(this.newCardData)

        // Index to current timestamp
        var newCardTimestamp = this.timeTree()
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

        // Reset Form Data
        this.newCardData = { content: "", parent: ""}
      },
      // Reply explorer
      loadReplyCards: function(parentId) {
        console.log("# Load Reply Cards under",parentId)
        this.replyCards = { }

        // TODO: Why doesn't this work in Vue, but it works in console with var g = Gun()??
        // this.$gun.get(parentId).get('replies').map().once((v,k) => console.log(k,v.content))
        // this.$gun.get('5ffd5c16-f769-44f1-a7ab-772140e9f273').get('replies').map().once((v,k) => console.log(k,v))

        // This works around the above weirdness... I swear .get(x).get(y) was exactly like x/y...
        // this.$gun.get('5ffd5c16-f769-44f1-a7ab-772140e9f273/replies').map().once((v,k) => console.log(k,v))
        // this.$gun.get(parentId + '/replies').map().once(this.updateReplyCardsUI.bind(this))
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


    }
  }
</script>
