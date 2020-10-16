<template>
  <div class="sources">
    <h1>Sources</h1>
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
  export default {
    created() {
      console.log('Component has been created!');
      this.loadSrcs()
    },
    data () {
      return {
        srcs: [ ],
        newSource: {
            title: "test",
            reference: "test"
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
