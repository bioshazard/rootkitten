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
      <ul>
        <li v-for="values in srcs.slice().reverse()" v-bind:key="values.id">
          {{values.title}} - {{values.reference}} - {{values.id}}
        </li>
      </ul>
    </div>
  </div>
</template>

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
        srcs: [ ],
        newSource: {
            title: "",
            reference: ""
        },
        addSrc: function(val, id) {
          console.log(id, val)

          val['id'] = id

          //val.pop("_")
          val["_"] = null

          this.srcs.push(val)
        },
        loadSrcs: function() {
          console.log("Loading srcs...")
          this.srcs = []
          this.$gun.get('sources').map().on(this.addSrc.bind(this))
        },
        addSource: function () {
          console.log("# Add Source fn")

          // console.log(this.$gun)
          var newSource = this.$gun.get('source/' + Date.now())
          newSource.put(this.newSource)
          this.$gun.get('sources').set(newSource)
          this.$gun.get('sources').map().once(v => console.log(v.reference))


          this.newSource = { title: "", reference: "" }
        }
      }
    }
  }
</script>
