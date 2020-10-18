<template>
  <div class="Sandbox">
    <h1>Sandbox</h1>

    <div class="">
      <button @click="dbReset">Reset Database</button>
      <h2>Top ZKs</h2>
      <ul>
        <li v-for="topZk in topZks" v-bind:key="topZk.id">
          <ul>
            <li>{{topZk.id}}</li>
            <li>{{topZk.content}}</li>
            <li v-if="topZk.children !== undefined">
              <button @click="showSubs(topZk.id)" type="button" name="button">Children</button>
            </li>
          </ul>
        </li>
      </ul>
      <h2>Sub ZK</h2>
      <ul>
        <li v-for="subZk in subZks" v-bind:key="subZk.id">
          <ul>
            <li>{{subZk.id}}</li>
            <li>{{subZk.content}}</li>
            <li>
              <button @click="showSubs(subZk.id)" type="button" name="button">Children</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      console.log('Component has been created!');
      this.dbReset()
      // this.initZk()
      //this.loadZks()
    },
    data () {
      return {
          topZks: [ ],
          subZks: [ ]
      }
    },
    methods: {
      timeTree: function(timestamp = null) {
        var d
        if(timestamp === null) {
          d = new Date()
        } else {
          d = new Date(timestamp)
        }
        return this.$gun
          .get(d.getFullYear())
          .get(d.getMonth())
          .get(d.getDay())
          .get(d.getHours())
          .get(d.getMinutes())
          .get(d.getSeconds())
      },
      dbReset: function() {

        console.clear()
        console.log("Reset Done")

        // Create ZK example 1
        var zk1 = this.$gun.get(this.$uuid.v4()).put({
          content: "root1"
        })
        // Index to second
        var zk1Time = this.timeTree()
        zk1Time.set(zk1)
        zk1.get('created').put(zk1Time)

        // Create ZK example 2
        var zk2 = this.$gun.get(this.$uuid.v4()).put({
          created: Date.now(),
          content: "root2"
        })
        // Index to second
        var zk2Time = this.timeTree()
        zk2Time.set(zk2)
        zk2.get('created').put(zk2Time)

        // Create ZK example 1a
        var zk1a = this.$gun.get(this.$uuid.v4()).put({
          created: Date.now(),
          content: "root1a"
        })

        // Create ZK example 1a
        var zk1a1 = this.$gun.get(this.$uuid.v4()).put({
          created: Date.now(),
          content: "root1a1"
        })

        var zk3 = this.$gun.put({
          created: Date.now(),
          content: "root3"
        })

        // Add ZK1A to ZK1
        zk1.get('children').set(zk1a)
        zk1a.get('parent').put(zk1)

        // Add ZK1A1 to ZK1A
        zk1a.get('children').set(zk1a1)
        zk1a1.get('parent').put(zk1a)

        // // Add to root index
        this.$gun.get('zks').get('root').set(zk1)
        this.$gun.get('zks').get('root').set(zk2)
        this.$gun.get('zks').get('root').set(zk3)

        // this.$gun.get('zks').get('index').map().once(function(val,id){
        //   console.log(id, val.content)
        //   // if(val.children !== null) {
        //   //   console.log("children")
        //   // }
        //   // this.$gun.get(id).get('children').map().once(v => console.log(v))
        // })
        //
        // zk1.get('children').map().once(v => console.log(v.content))


        //
        // // Print Cards in Console
        // console.log("# Local Validate")
        // this.$gun.get('zks').get('index').map().once((v,k) => console.log(k,"=>",v.content))
        // zk1a.once((v,k) => console.log(k,v.content))

        // Print cards
        // console.log("# Print Top Level")
        this.$gun.get('zks').get('index').map().once(this.listTopZK.bind(this))
      },
      listTopZK: function(val, id) {
        console.log("ID:",id)
        console.log("Val:",val.content)
        var nextZk = {
          id: id,
          content: val.content
        }
        if(val.children !== undefined) {
          nextZk['children'] = val.children
        }
        this.topZks.push(nextZk)
      },
      showSubs: function(parentId) {
        console.log("# Show Subs: ",parentId)
        this.topZks = []
        this.$gun.get(parentId).get('children').map().once(this.listSubZk.bind(this))

      },
      listSubZk: function(val, id) {
        console.log(id, val)
        this.topZks.push({
          id: id,
          content: val.content,
          parent: val.parent
        })
      }
    }
  }
</script>
