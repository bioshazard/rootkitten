<template>
  <div class="sources">
    <h1>Sources</h1>
    <div class="">
      Bookmarklet: <a href="javascript:(function()%7Bvar%20baseUrl%20%3D%20%20'https%3A%2F%2Frk.bioshazard.com%2F'%3B%0Awindow.open(baseUrl%20%2B%20'%3Ftitle%3D'%20%2B%20document.title%20%2B%20'%26text%3D'%20%2B%20document.URL%2C%20'_blank')%7D)()%3B">RK</a>
    </div>
    <div class="">
      <form @submit.prevent="addSource">
        <ul>
          <li>
            Title: <input type="text" v-model="newSource.title">
          </li>
          <li>
            Reference: <input type="text" v-model="newSource.reference">
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
				<!-- {{src}} -->
				<div class="src-card-body">
					<a :href="src.reference">{{src.title}}</a>
					<span>{{prettySlashDate(src.created["#"])}}</span>
				</div>
        <!-- {{values.title}} - {{values.reference}} - {{values.id}} -->
      </div>
    </div>
  </div>
</template>

<style>
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
      console.log('Component has been created!');
      this.loadSrcs()
    },
    data () {
      return {
        srcs: { },
        newSource: {
            title: "",
            reference: ""
        },

      }
    },
		methods: {
			prettySlashDate: function(slashDate) {
					var splitDate = slashDate.split('/')
					var d = new Date(
						splitDate[0], // Year
						splitDate[1]-1, // Month (-1 to un-offset)
						splitDate[2], // Day
						splitDate[3], // Hour
						splitDate[4], // Minute
						splitDate[5], // Second
						0, // MS (ignored)
					)
					return d;
			},
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
					.get(d.getMonth()+1)
					.get(d.getDate())
					.get(d.getHours())
					.get(d.getMinutes())
					.get(d.getSeconds())
			},
			loadSrcs: function() {
				console.log("Loading srcs...")
				this.srcs = { }
				this.$gun.get('sources').map().on(this.loadSrcUI.bind(this))
			},
			loadSrcUI: function(val, id) {
				console.log(id, val)

				//val.pop("_")
				val["_"] = null

				this.srcs[id] = val
			},
			addSource: function () {
				console.log("# Add Source fn")

				// Create Source Node
				var newSourceNode = this.$gun.get(this.$uuid.v4()).set(this.newSource)

				// Index to current timestamp
        var newSourceTimestamp = this.timeTree()
        newSourceTimestamp.set(newSourceNode) // Must set this first so the timestamp record exists
        newSourceNode.get('created').put(newSourceTimestamp)

				this.$gun.get('sources').set(newSourceNode)

				this.newSource = { title: "", reference: "" }
			}
		}
  }
</script>
