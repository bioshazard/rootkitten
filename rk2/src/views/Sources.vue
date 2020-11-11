<template>
  <div class="sources">
    <h1>Sources</h1>
    <div class="">
      Bookmarklet: <a :href="'javascript:' + bookmarklet">RK</a>
    </div>
    <div class="">
      <form @submit.prevent="addSource">
        <ul>
					<li>
						Reference: <input type="text" v-model="newSource.reference">
					</li>
          <li>
            Title: <input type="text" v-model="newSource.title">
          </li>
					<li>
						Tags: <input ref="tags" type="text" placeholder="Tags" name="" v-model="newSource.tags" />
					</li>
          <li>
            <input type="submit" name="" value="Submit">
          </li>
        </ul>
      </form>
    </div>
    <div class="">
      <h3>Source List</h3>
      <div class="src-card" v-for="src in srcs" v-bind:key="src.id">

				<a :href="src.reference">{{src.title}}</a> -

				<span class="tag" v-for="tag in src.tags" :key="tag">
					<router-link :to="'/sources'">#{{tag}}</router-link>
				</span>

				<router-link class="timestamp" :to="'/sources/edit/'+src.id">
					{{zkgun.prettySlashDate(src.created["#"])}}
				</router-link>

      </div>
    </div>
		<div class="">
			<h3>Source Edit</h3>
			<router-view/>
		</div>
  </div>
</template>

<style scoped>
.timestamp {
	float: right
}
.tag {
	padding-right: 10px;
}
.src-card {
	border-bottom: 1px solid lightgrey;
	padding: 3px;
}
/* textarea {
	width: 100%;
	height: 100px;
}
.src-card {
	border: 1px solid black;
	margin-bottom: 10px;
}
.src-card > div {
	padding: 5px;
}
.src-card-title {
	background: #eee;
	border-bottom: 1px solid black;
}
.src-card-body span {
	float: right
}
.src-card-tags {
} */
</style>

<script>
/*

# Sources Component

* Add Sources (title, reference)
* List Sources

*/
  export default {
    created() {
			console.clear()
      console.log('Component has been created!');
      this.loadSrcs()

			console.log(this.$uuid.v4())
    },
		mounted() {
			// Pre-populate if incoming share
			this.handleShare()
		},
    data () {
      return {
        srcs: { },
        newSource: {
					reference: "",
          title: "",
					tags: ""
        },
      }
    },
		computed: {
			bookmarklet: function () {
				// var rkDomain = 'http://localhost:8080/sources'
				// var rkDomain = 'https://rk.bioshazard.com/'
				var fullDomain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
				var sourcesPath = fullDomain + '/sources';
				var bookmarkletJs = "(function() { window.open('" + sourcesPath + "' + '?title=' + document.title + '&text=' + document.URL, '_blank') })();"
				return encodeURIComponent(bookmarkletJs.replace(/\s/g,''));
			}
		},
		methods: {

			handleShare: function() {
				if (this.$route.query.text === undefined) {
					return false
				} else {
					if (this.$route.query.text.startsWith('http')) {
						this.newSource["reference"] = this.$route.query.text
						this.newSource["title"] = this.$route.query.title
						this.$refs.tags.focus()
					} else {
						this.newSource["title"] = this.$route.query.text
					}
				}
				if (this.$route.query.url !== undefined) {
					this.newSource["reference"] = this.$route.query.url
				}
			},
			loadSrcs: function() {
				console.log("Loading srcs...")

				this.srcs = { }
				this.$gun.get('sources').map().on(this.loadSrcUI.bind(this))
			},
			loadSrcUI: function(val, id) {
				//val.pop("_")
				// val["_"] = null
				delete val["_"]

				val.id = id
				this.srcs[id] = val
				// this.srcs[id].tags = ["none"]

				// Resolve Tags
				if(typeof val.tags === "object") {
					console.log("VALUE", val)
					console.log("VALUE TAGS", val.tags["#"])
					this.$gun.get(val.tags["#"]).once(function(v){
						console.log("ONCE", v)
						delete v["_"]
						// console.log("ONCE MAP", v['tags/asdf'])
						var tags = []
						this.srcs[id].tags = tags
						for (const [key] of Object.entries(v)) {
							// console.log(`${key}: ${value}`);
							tags.push(key.split('/')[1])
						}
						console.log(tags)
						// this.srcs[id].tags = tags

						// Not sure why this doesn't update realiably... without the force
						this.$set(this.srcs[id], 'tags', tags)
						this.$forceUpdate()

					}.bind(this))
				} else {
					this.srcs[id].tags = ["UNDEFINED"]
				}
			},
			addSource: function () {
				console.log("# Add Source fn")

				// Create Source Node
				var newSourceNode = this.$gun.get(this.$uuid.v4()).put(this.newSource)

				// Index to current timestamp
        var newSourceTimestamp = this.zkgun.timeTree()
        newSourceTimestamp.set(newSourceNode) // Must set this first so the timestamp record exists
        newSourceNode.get('created').put(newSourceTimestamp)

				// Tags
				var tagsNode = this.$gun.get('tags')
				var tags = [ ]
				if (this.newSource.tags == "") {
					tags = ['untagged']
				} else {
					tags = Array.from(new Set(this.newSource.tags.split(",").map(str => str.trim())))
				}
				console.log("Using Tags:",tags)
				tags.map(function(tag) {
					console.log("Adding tag:",tag)
					tagsNode.get(tag).set(newSourceNode)
					newSourceNode.get('tags').set(tagsNode.get(tag))
				})

				this.$gun.get('sources').set(newSourceNode)

				this.newSource = { title: "", reference: "", tags: "" }
			}
		}
  }
</script>
