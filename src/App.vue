<template>
  <div id="app" style="width:100%">
    <div class="mynav fixed-top">
    <ul>
      <!-- <img src="/static/images/ECNU.ico" class="rounded-circle logo-photo" alt="" style="height:100%"> -->
      <h4>&nbsp;&nbsp;Demo:SRaft</h4>
      <!-- <li><a class="active"><i class="fa fa fa-bar-chart"></i>Evaluation</a></li>
      <li><a class="active"><i class="fa fa fa-bookmark"></i>Overview</a></li>
      <li><router-link class="active" to="/"><i class="fa fa-map-marker"></i>Home</router-link></li> -->
    </ul>
    </div>
    <BlockReplicating></BlockReplicating>
    <!-- <div class="sidebar position-fixed" id="sidebar">
      <br>
      <br><br>
      <h4><strong><span>Overview</span></strong></h4>
      <div class="line-split mx-auto"></div>
      <ul>
        <li>
          <a><i class="fa fa-pencil"></i><span>Introduction</span></a>
        </li>
        <li>
          <router-link to="/BlockReplicating"><i class="fa fa-address-card-o"></i><span>BlockReplicating</span></router-link>
        </li>
        <li>
          <a><i class="fa fa-object-group"></i><span>BlockOrdering</span></a>
        </li>
      </ul>
      <br>
      <h4><strong><span>Evaluation</span></strong></h4>
      <div class="line-split mx-auto"></div>
      <ul>
        <li>
           <a><i class="fa fa-edit"></i><span>Introduction</span></a>
        </li>
        <li>
          <a><i class="fa fa-rss-square"></i><span>Network Traffic</span></a>
        </li>
        <li>
          <a><i class="fa fa-line-chart"></i><span>Performance</span></a>
        </li>
      </ul>
      <br><br>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import BlockReplicating from './components/BlockReplicating.vue';
export default {
  name: 'App',
  components: {
    BlockReplicating
  },  
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
    // this.$refs.fade_click.click()
  },
  methods: {}
}
</script>
