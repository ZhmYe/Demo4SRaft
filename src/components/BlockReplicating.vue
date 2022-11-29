<template>
    <div id="blockreplicating" style="width:100%; margin: 0 auto;">
        <br><br><br>
        <div class="card" style="border:0;width:100%">
            <!-- <div class="card-header">Overview</div> -->
            <div class="card-body" style="display:flex;width: 100%">
              <div style="width:4%"></div>
              <div style="width:45%;margin-right:2%;border:1px solid #dee2e6;border-radius: 1em;">
                <div style="font-size:large;margin-left:2%;height:50px;line-height:50px;font-weight:600;font-size: x-large;">Real-time dynamic process</div>
                <div id="legend" style="display: flex;width:100%;margin-left:2%;">
                  <div class="peerSign" style="display:flex;align-items: center;margin-right: 1%;height: 20px;line-height: 20px;">
                    <div class="round-sign round border" style="background-color: blue;"></div>
                      <div class="peerId" style="margin-left: 1%;">Initiator</div>
                  </div>
                  <div class="peerSign" style="display:flex;align-items: center;margin-right: 1%;height: 20px;line-height: 20px;">
                    <div class="round-sign round border" style="background-color: #00CED1;"></div>
                      <div class="peerId" style="margin-left: 1%;">Peer</div>
                  </div>
                  <div class="peerSign" style="display:flex;align-items: center;margin-right: 1%;height: 20px;line-height: 20px;">
                    <div class="round-sign round border" style="background-color: purple;"></div>
                      <div class="peerId" style="margin-left: 1%;">Leader</div>
                  </div>
                  </div>
                  
                <div ref='process' id='visual_process' class='zrender' style="width:100%;height:350px;"></div>
                <div style="border-top:1px solid #dee2e6;">
                  <div style="font-size:large;margin-left:2%;height:50px;line-height:50px;font-weight:600;font-size: x-large;">Real-time Overload Ratio</div>
                  <div class="charts">
                  <div id="area" style="width:100%; height:350px"></div>
                  <!-- <div id="oa-performance" style="width:100%; height:600px;"></div> -->
                </div>
                </div>
              </div>
              <div id="monitor" style="width: 49%">
                <div id="peer-monitor" style="width: 100%;height: 420px;border: 1px solid #dee2e6;border-radius: 1em;margin-bottom: 10px;">
                  <div style="font-size:large;margin-left:2%;height:50px;line-height:50px;font-weight:600;font-size: x-large;">Peer Monitor</div>
                  <div class="row" style="width: 95%;margin: 0 auto;">
                      <div class="peer col-md-4" v-for="config in this.peerConfig.slice(0, this.peerConfig.length - 1)" :key="config.id">
                        <div class="peerSign" style="display:flex;width:100%;align-items: center;">
                          <div class="round-sign round border" :style="getColor(config)"></div>
                          <div class="peerId" style="margin-left: 2%;">peer{{config.id}}</div>
                        </div>
                        <button type="button" class="btn btn-sm" data-toggle="modal" data-target="#myModal" style="position:absolute;right: 5%;align-self: center;background-color: whitesmoke;color:gray" v-on:click="changeSelect($event, config.id)">Details</button>
                        <div class="peerInfo" style="display: flex;">
                            <div class="bandwidth" style="display:flex;align-items: center;margin: 5px;"><i class="fa fa-feed"></i>B:{{config.B}}</div>
                            <div class="wordload" style="display:flex;align-items: center;"><i class="fa fa-pied-piper-alt"></i>W:{{config.W}}</div>
                          </div>
                        <div class="progress" style="width: 70%;margin-left: 1%;margin-bottom: 5px">
                        <div class="progress-bar" :style="getBarStyle(config)">{{Math.ceil(config.W / config.B * 100) + '%'}}</div>
                      </div>
                      </div>
                  </div>
                </div>
                <div class="border" style="width:100%;border:1px solid #dee2e6;border-radius: 1em;height: 400px" id="block-monitor">
                  <div style="font-size:large;margin-left:2%;height:50px;line-height:50px;font-weight:600;font-size: x-large;">Block Monitor</div>
                  <div class="row" style="width:95%;margin:0 auto;border-bottom: 1px solid #dee2e6;">
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Block</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Initiator</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Status</div>
                  </div>
                  <div class="row" style="width:95%;margin:0 auto;border-bottom: 1px solid #dee2e6;" v-for="(block,index) in this.blocks.slice((this.blocks.length >= 5) ? this.blocks.length - 5 : 0, this.blocks.length)" :key="index">
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: #00BBFF">Block_{{block.index}}</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;">
                      <div class="peerSign" style="display:flex;align-items: center;justify-content: center;">
                          <div class="round-sign round border" :style="getColor(peerConfig[block.id])"></div>
                          <div class="peerId" style="margin-left: 2%;">peer{{block.id}}</div>
                      </div>
                    </div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;">
                      <div :class="getBlockBadge(block.state)" style="width:50%;">{{block.state}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
            <!-- <div class="card-footer">底部</div> -->
        </div>
        <div class="modal fade " id="myModal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
        
              <!-- 模态框头部 -->
              <div class="modal-header">
                <div class="modal-title">
                  <div id="peer-info">
                    <div class="peerSign" style="display:flex;align-items: center;">
                          <div class="round-sign round border" :style="getColor(peerConfig[this.select])"></div>
                          <div class="peerId" style="margin-left: 1%;font-size: x-large;font-weight: 600;">peer{{this.select}}</div>
                      </div>
                  </div>
                </div>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
        
              <!-- 模态框主体 -->
              <div class="modal-body">
                <div style="margin-left: 2%;margin-top: 10px">
                  <!-- <div style="font-weight:600;font-size: x-large;">Real-time Information</div> -->
                    <div class="peerInfo row" style="margin:0 auto">
                        <div class="col-md-1"></div>
                        <div class="bandwidth col-md-4" style="display:flex;align-items: center;font-size: large;font-weight: 600;border: 1px solid #dee2e6;border-radius: 1em;height:100px;justify-content: center;">
                          <i class="fa fa-feed"></i>Bandwidth:{{peerConfig[this.select].B}}
                        </div>
                        <div class="col-md-2"></div>
                        <div class="wordload col-md-4" style="display:flex;align-items: center;font-size: large;font-weight: 600;border: 1px solid #dee2e6;border-radius: 1em;height:100px;justify-content: center;">
                          <i class="fa fa-pied-piper-alt"></i>Workload:{{peerConfig[this.select].W}}
                        </div>
                    </div>
                    <!-- <div class="progress" style="width: 70%;margin: 0 auto">
                      <div class="progress-bar" :style="getBarStyle(peerConfig[0])">{{Math.ceil(peerConfig[0].W / peerConfig[0].B * 100) + '%'}}</div>
                    </div> -->
                </div>
                <div style="font-weight:600;font-size: x-large;">Forwarding Route</div>
                <div class="charts">
                  <div id="no-tree" style="width: 100%;height: 350px;border: 1px solid #dee2e6;line-height: 350px;font-size: x-large;font-weight: 600;text-align: center;" v-show="this.peerConfig[this.select].state != 'initiator'">
                      Not a initiator now!!
                  </div>
                  <div id="tree" style="width:100%; height:350px;border: 1px solid #dee2e6" v-show="this.peerConfig[this.select].state == 'initiator'"></div>
                  <!-- <div id="oa-performance" style="width:100%; height:600px;"></div> -->
                </div>
                <div style="font-weight:600;font-size: x-large;">Recent Replicated Blocks</div>
                <div id="block-details" style="border: 1px solid #dee2e6;width: 100%;height: 320px;">
                  <div class="row" style="width:95%;margin:0 auto;border-bottom: 1px solid #dee2e6;">
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Block</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Initiator</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: gray">Status</div>
                  </div>
                  <div class="row" style="border-bottom: 1px solid #dee2e6;width:95%;margin:0 auto;" v-for="(block,index) in this.select_block.slice((this.select_block.length >= 5) ? this.select_block.length - 5 : 0, this.select_block.length)" :key="index">
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;color: #00BBFF">Block_{{block.index}}</div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;">
                      <div class="peerSign" style="display:flex;align-items: center;justify-content: center;">
                          <div class="round-sign round border" :style="getColor(peerConfig[0])"></div>
                          <div class="peerId" style="margin-left: 2%;">peer{{block.id}}</div>
                      </div>
                    </div>
                    <div class="col-md-4" style="text-align:center;height: 50px;line-height: 50px;">
                      <div :class="getBlockBadge(block.state)" style="width:50%;">{{block.state}}</div>
                    </div>
                  </div>
                </div>
              </div>
        
              <!-- 模态框底部 -->
              <!-- <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
              </div> -->
        
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script>

  export default {
    name: 'BlockReplicating',
    data () {
      return {
        select: 0,
        circle_list: [],
        blocks: [],
        commit_start: -1,
        commit_end: -1,
        select_block: [],
        state2color: {"initiator": "blue", "leader": "purple", "original": "#00CED1", "overload": "red"},
        message2color: {"replicate": "pink", "replicateConfirm": "yellow", "consensus": "skyblue", "consensusConfirm": "brown", "block": "gray"} ,
        peerConfig: [
          {
            id: 0,
            state: 'initiator',
            position: {x: 300, y:50},
            phase: 'allocate',
            brt: {},
            W: 2,
            B: 5,
          },
          {
            id: 1,
            state: "original",
            position: {x: 300, y: 250},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 10
          },
          {
            id: 2,
            state: "original",
            position: {x: 600, y: 50},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 8
          },
          {
            id: 3,
            state: "initiator",
            position: {x: 600, y: 250},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 6
          },
          {
            id: 4,
            state: "original",
            position: {x: 400, y: 100},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 4
          },
          {
            id: 5,
            state: "initiator",
            position: {x: 400, y: 200},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 10
          },
          {
            id: 6,
            state: "original",
            position: {x: 500, y: 100},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 6
          },
          {
            id: 7,
            state: "original",
            position: {x: 500, y: 200},
            W: 2,
            phase: 'allocate',
            brt: {},
            B: 7
          },
          {
            id: 8,
            state: "leader",
            position: {x: 200, y: 150},
            W: 2,
            phase: 'allocate',
            B: 10
          }
        ],
      }
    },
    created () {
    },
    mounted () {
      this.CanvasInit()
      this.CanvasCircleColorBind()
      for (var i = 0; i < this.peerConfig.length - 1; i++) {
        this.PeerImpl(this.peerConfig[i])
      }
      this.LeaderImpl()
      setInterval( () => {
        this.getArea("area")
      }, 200)
      setInterval(() => {
        this.SelectBlock()
      }, 1000)
    },
    methods: {
    CanvasInit: function () {
      let dom = this.$refs.process
      this.canvas = this.zrender.init(dom)
      this.group = new this.zrender.Group()
      for (var i = 0; i < this.peerConfig.length; i++) {
        this.drawPeer(this.peerConfig[i])
      }
      this.canvas.add(this.group)
    },
    SelectBlock: function() {
      this.select_block = []
      for (var i = 0;i < this.blocks.length;i ++) {
        if (this.blocks[i].id == this.select) this.select_block.push(this.blocks[i])
      }
    },
    changeSelect: function(event, id) {
      this.select = id
      // console.log(this.select)
      this.SelectBlock()
      if (this.peerConfig[this.select].state == "initiator")
      setTimeout(() => {
          this.getTree(this.peerConfig[this.select].brt, "tree")
      }, 500)
      else this.clearTree("tree")
    },
    getDataChildren: function(brt) {
      if (brt.child == undefined || brt.child.length == 0) {
        return {"name": "peer" + brt.id, "children": []}
      }
      let result_children = []
      for (var i = 0;i < brt.child.length; i++) {
        result_children.push(this.getDataChildren(brt.child[i]))
      }
      return {"name": "peer" + brt.id, "children": result_children}
    },
    CanvasCircleColorBind: function(){
      setInterval(() => {
        for (var i = 0; i < this.peerConfig.length; i++) {
          let state = "original"
          let config = this.peerConfig[i]
          if (config.state == "initiator") state = "initiator"
          else if (config.state == 'leader') state = "leader"
          else {
            let check = (config.W >= config.B)
            if (check) state = 'overload'
          }
          this.circle_list[i].style.fill = this.state2color[state]
        }
    }, 200)
    },
    getColor: function(config) {
      let state = "original"
      if (config.state == "initiator") state = "initiator"
      else if (config.state == 'leader') state = "leader"
      else {
        let check = (config.W >= config.B)
        if (check) state = 'overload'
      }
      return "background-color:" + this.state2color[state]
    },
    getBarStyle: function(config) {
      let state = "original"
      if (config.state == 'leader') state = "leader"
      else {
        let check = (config.W >= config.B)
        if (check) state = 'overload'
      }
      return "width: " + Math.ceil(config.W / config.B * 100  ) + '%;background-color:' + this.state2color[state]

    },
    getBlockBadge: function(state) {
      if (state == "not consensus") return "badge badge-danger"
      if (state == "consensus") return "badge badge-warning"
      if (state == "commit") return "badge badge-success"
    },
    BlockOrdreing: function() {
      let block_length = this.blocks.length
      setTimeout(() => {
        // this.changePhase(pattern, "consensus")
        for (var i = 0; i < this.peerConfig.length - 1; i ++) {
          this.Sendmessage(this.peerConfig.length - 1, i, "consensus")
        }
      }, 2200)
      setTimeout(() => {
        // this.changePhase(pattern, "consensusConfirm")
        for (var i = 0; i < this.peerConfig.length; i ++) {
          this.Sendmessage(i, this.peerConfig.length - 1, "consensusConfirm")
        }
        setTimeout(() => {
          if (this.commit_end == -1) {
            for (var i = 0;i < block_length; i++) this.blocks[i].state = "consensus"
            this.commit_start = 0
            this.commit_end = block_length
          }
          else {
            for (var j = this.commit_start; j < this.commit_end; j++) this.blocks[j].state = "commit"
            for (var k = this.commit_end; k < block_length; k++) this.blocks[k].state = "consensus"
            this.commit_start = this.commit_end
            this.commit_end = block_length
          }
        }, 2000);
      }, 4400)
    },
    getHeight: function(height, node) {
      if (node.child == undefined || node.child.length == 0) return height
      let result = this.getHeight(height + 1, node.child[0])
      if (node.child.length == 2) {
        let new_result = this.getHeight(height + 1,node.child[1])
        if (new_result > result)
          return new_result
      }
      return result
    },
    getMax: function(array) {
      let max = 0
      let index = -1
      for (var i = 0; i < array.length; i++) {
        if (array[i] > max) {
          max = array[i]
          index = i
        }
      }
      return index
    },
    getBRT: function(config) {
      // console.log(config.id)
      let brt = { id: config.id, child: [] }
      // console.log(config)
      if (config.W <= config.B) {
        for (var i = 0; i < this.peerConfig.length - 1; i++) {
          if (this.peerConfig[i].id == config.id) continue
          let new_child = { id: this.peerConfig[i].id, child: []}
          brt.child.push(new_child)
        }
      }
      else {
        let need = config.W - config.B
        let total_need = need
        let total_provide = []
        for (var j = 0; j < this.peerConfig.length - 1; j++) {
          if (this.peerConfig[j].id == config.id) {
            total_provide[j] = 0
            continue
          }
          if (this.peerConfig[j].B >= this.peerConfig[j].W) { 
            if (this.peerConfig[j].state == 'original')
              total_provide[j] = this.peerConfig[j].B - this.peerConfig[j].W
            else {
              total_provide[j] = 0
            }
          }
          else {
            total_provide[j] = 0
            if (this.peerConfig[j].state == 'initiator' && this.peerConfig[j].phase == 'allocate')
              total_need += (this.peerConfig[j].W - this.peerConfig[j].B)
          }
        }
        // console.log(total_provide)
        let percent = need / total_need
        for (var k = 0;k < total_provide.length; k++) {
          total_provide[k] = Math.floor(percent * total_provide[k])
        }
        // console.log(total_provide)
        let child_dic = []
        while (need > 0) {
          // console.log(need)
          if (brt.child.length >= config.B) break  // 转发节点个数不可以超过带宽
          let index = this.getMax(total_provide)
          if (index == -1) break
          var provide = total_provide[index]
          brt.child.push({ id: index, child:[]})
          if (need  <= provide) {
            child_dic[index] = need
            config.W -= need
            this.peerConfig[index].W += need
            need = 0
          }
          else {
            child_dic[index] = provide
            config.W -= provide
            this.peerConfig[index].W += provide
            need -= provide
            total_provide[index] = 0
          }
        }
        // console.log(child_dic)
        let child_index = 0
        // console.log(brt)
        // 考虑多层（？）
        let p = 0
        while (p < this.peerConfig.length - 1) {
          if (child_dic[this.peerConfig[p].id] != undefined || this.peerConfig[p].id == config.id) {p++;continue}
          let child = brt.child[child_index]
          // console.log(child)
          if (child.child.length < child_dic[child.id]) {
            child.child.push({id: this.peerConfig[p].id, child:[]})
            // if (total_provide[this.peerConfig[p].id] != 0) {
            //   let child_id = p
            //   let child_child = child.child[child.child.length - 1]
            //   while (child_child.length < total_provide[this.peerConfig[child_id].id]) {

            //   }
            // }
          }
          if (child.child.length >= child_dic[child.id]) child_index++
          p++
          if (child_index >= brt.child.length) break
        }
        if (p != this.peerConfig.length - 1) {
          while (p < this.peerConfig.length - 1) {
            if (child_dic[this.peerConfig[p].id] != undefined || this.peerConfig[p].id == config.id) {p++;continue}
            brt.child.push({id: this.peerConfig[p].id, child: []})
            p++
          }
        }
        config.phase = 'finish'
      }
      // console.log(brt)
      return brt
    },
    LeaderImpl: function() {
      setInterval(() => {
        this.BlockOrdreing()
        // console.log(this.blocks)
      }, 8000)
    },
    PeerImpl: function(config) {
      if (config.state == 'original') {
        var random4state = Math.random()
        if (random4state * this.peerConfig.length < 1) config.state = "initiator"
      }
      if (config.state == 'initiator') {
        config.W += (this.peerConfig.length - 2)
        config.brt = this.getBRT(config)
        // console.log(this.getDataChildren(config.brt))
        let treeHeight = this.getHeight(0, config.brt)
        this.Blockreplicate(config.brt, "treebased")
        setTimeout(() => {
          // this.Sendmessage(0, 6, "onetoall")
          this.Sendmessage(config.id, this.peerConfig.length - 1, "block")
          config.state = "original"
          config.phase = 'allocate'
          config.W -= config.brt.child.length
          setTimeout(() => {
            this.blocks.push({index: this.blocks.length, id: config.id, state: "not consensus"})
          }, 2000);
          // this.BlockOrdreing()
        }, 2100 * treeHeight * 2 + 100)
      }
      setInterval(() => {
        if (config.state == 'original') {
        var random4state = Math.random()
        if (random4state < 0.2) config.state = "initiator"
      }
      if (config.state == 'initiator') {
        config.W += (this.peerConfig.length - 2)
        config.brt = this.getBRT(config)
        // console.log(config.brt)
        let treeHeight = this.getHeight(0, config.brt)
        this.Blockreplicate(config.brt)
        setTimeout(() => {
          // this.Sendmessage(0, 6, "onetoall")
          this.Sendmessage(config.id, this.peerConfig.length - 1, "block")
          config.state = "original"
          config.phase = 'allocate'
          config.W -= config.brt.child.length
          setTimeout(() => {
            this.blocks.push({index: this.blocks.length, id: config.id, state: "not consensus"})
          }, 2000);
        }, 2100 * treeHeight * 2 + 100)
      }
      }, 15000);
    },
    drawPeer: function (config) {
      let option = {
        shape: {
          cx: config.position.x,
          cy: config.position.y,
          r: 10
        },
        style: {
          fill: this.state2color[config.state]
        },
        zlevel: -1
      }
      let circle = new this.zrender.Circle(option)
      this.circle_list[config.id] = circle
      this.group.add(circle)
    },
    Blockreplicate:  function(brt) {
      let initiator = brt.id
      // console.log(brt)
      // console.log(initiator)
      let child = brt.child
      // console.log(child)
      if (child == undefined || child.length == 0) return
      for (var i = 0; i < child.length; i++) {
        // this.changePhase("replicate")
        let child_i = child[i]
        // console.log(child_i)
        this.Sendmessage(initiator, child_i.id, "replicate")
        setTimeout(() => {
          // console.log(child_i)
          this.Blockreplicate(child_i)
          let node_height = this.getHeight(0, child_i)
          setTimeout(() => {
            // this.changePhase("replicateConfirm")
            this.peerConfig[child_i.id].W -= child_i.child.length
            this.Sendmessage(child_i.id, initiator, "replicateConfirm")
          }, 2100 * 2 * node_height)
        }, 2100);
      }
    },
    Sendmessage: function(sender, receiver, message) {
      // console.log(sender, receiver)
      let option = {
        shape: {
          cx: this.peerConfig[sender].position.x,
          cy: this.peerConfig[sender].position.y,
          r: 5
        },
        style: {
          fill: this.message2color[message]
        },
        zlevel: -1
      }
      let circle = new this.zrender.Circle(option)
      circle.animateTo(
                      {
                        x: this.peerConfig[receiver].position.x - this.peerConfig[sender].position.x, 
                        y: this.peerConfig[receiver].position.y - this.peerConfig[sender].position.y
                      }, 
                      {duration:2000})
      this.group.add(circle)
      setTimeout(()=>{
        this.group.remove(circle)
      }, 2100)
    },
    getArea: function(id) {
      document.getElementById(id).style.display = 'block'
      var chart_ec9f83b68dcc48b4988b073c1c9eb71c = this.$echarts.init(
            document.getElementById(id), 'white', {renderer: 'canvas'});
        var option = {
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "color": [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#f05b72",
        "#ef5b9c",
        "#f47920",
        "#905a3d",
        "#fab27b",
        "#2a5caa",
        "#444693",
        "#726930",
        "#b2d235",
        "#6d8346",
        "#ac6767",
        "#1d953f",
        "#6950a1",
        "#918597"
    ],
    "series": [
        {
            "type": "line",
            "name": "workload rate",
            "connectNulls": false,
            "symbolSize": 4,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": false,
            "data": [
                [
                    "peer0",
                    Math.ceil(this.peerConfig[0].W / this.peerConfig[0].B * 100)
                ],
                [
                    "peer1",
                    Math.ceil(this.peerConfig[1].W / this.peerConfig[1].B * 100)
                ],
                [
                    "peer2",
                    Math.ceil(this.peerConfig[2].W / this.peerConfig[2].B * 100)
                ],
                [
                    "peer3",
                    Math.ceil(this.peerConfig[3].W / this.peerConfig[3].B * 100)
                ],
                [
                    "peer4",
                    Math.ceil(this.peerConfig[4].W / this.peerConfig[4].B * 100)
                ],
                [
                    "peer5",
                    Math.ceil(this.peerConfig[5].W / this.peerConfig[5].B * 100)
                ],
                [
                    "peer6",
                    Math.ceil(this.peerConfig[6].W / this.peerConfig[6].B * 100)
                ],
                                [
                    "peer7",
                    Math.ceil(this.peerConfig[7].W / this.peerConfig[7].B * 100)
                ]
            ],
            "hoverAnimation": true,
            "label": {
                "show": true,
                "position": "top",
                "margin": 8
            },
            "lineStyle": {
                "show": true,
                "width": 1,
                "opacity": 1,
                "curveness": 0,
                "type": "solid"
            },
            "areaStyle": {
                "opacity": 0.5
            },
            "zlevel": 0,
            "z": 0
        }
    ],
    "legend": [
        {
            "data": [
                "overload rate",
            ],
            "selected": {
                "overload rate": true,
            },
            "show": true,
            "left": "right",
            "padding": 5,
            "itemGap": 10,
            "itemWidth": 25,
            "itemHeight": 14
        }
    ],
    "tooltip": {
        "show": true,
        "trigger": "item",
        "triggerOn": "mousemove|click",
        "axisPointer": {
            "type": "line"
        },
        "showContent": true,
        "alwaysShowContent": false,
        "showDelay": 0,
        "hideDelay": 100,
        "textStyle": {
            "fontSize": 14
        },
        "borderWidth": 0,
        "padding": 5
    },
    "xAxis": [
        {
            "show": true,
            "scale": false,
            "nameLocation": "end",
            "nameGap": 15,
            "gridIndex": 0,
            "inverse": false,
            "offset": 0,
            "splitNumber": 5,
            "minInterval": 0,
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "show": true,
                    "width": 1,
                    "opacity": 1,
                    "curveness": 0,
                    "type": "solid"
                }
            },
            "data": [
                "peer0",
                "peer1",
                "peer2",
                "peer3",
                "peer4",
                "peer5",
                "peer6",
                "peer7"
            ]
        }
    ],
    "yAxis": [
        {
            "show": true,
            "scale": false,
            "nameLocation": "end",
            "nameGap": 15,
            "gridIndex": 0,
            "inverse": false,
            "offset": 0,
            "splitNumber": 5,
            "minInterval": 0,
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "show": true,
                    "width": 1,
                    "opacity": 1,
                    "curveness": 0,
                    "type": "solid"
                }
            }
        }
    ],
};
        // chart_ec9f83b68dcc48b4988b073c1c9eb71c.clear()
        chart_ec9f83b68dcc48b4988b073c1c9eb71c.setOption(option);
    },
    getTree: function(brt, id) {
      let data = this.getDataChildren(brt, id)
      // console.log(data)
      var chart_bf912e60a7ec47b6b1ff17ab01e76071 = this.$echarts.init(
            document.getElementById(id), 'white', {renderer: 'canvas'});
        var option_bf912e60a7ec47b6b1ff17ab01e76071 = {
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "color": [
        "#c23531",
        "#2f4554",
        "#61a0a8",
        "#d48265",
        "#749f83",
        "#ca8622",
        "#bda29a",
        "#6e7074",
        "#546570",
        "#c4ccd3",
        "#f05b72",
        "#ef5b9c",
        "#f47920",
        "#905a3d",
        "#fab27b",
        "#2a5caa",
        "#444693",
        "#726930",
        "#b2d235",
        "#6d8346",
        "#ac6767",
        "#1d953f",
        "#6950a1",
        "#918597"
    ],
    "series": [
        {
            "type": "tree",
            "data": [
              data
            ],
            "symbol": "emptyCircle",
            "symbolSize": 7,
            "edgeShape": "curve",
            "edgeForkPosition": "50%",
            "roam": false,
            "expandAndCollapse": true,
            "layout": "orthogonal",
            "orient": "LR",
            "label": {
                "show": true,
                "position": "top",
                "margin": 8
            },
            "leaves": {
                "label": {
                    "show": true,
                    "position": "top",
                    "margin": 8
                }
            }
        }
    ],
    "legend": [
        {
            "data": [],
            "selected": {},
            "show": true,
            "padding": 5,
            "itemGap": 10,
            "itemWidth": 25,
            "itemHeight": 14
        }
    ],
    "tooltip": {
        "show": true,
        "trigger": "item",
        "triggerOn": "mousemove|click",
        "axisPointer": {
            "type": "line"
        },
        "showContent": true,
        "alwaysShowContent": false,
        "showDelay": 0,
        "hideDelay": 100,
        "textStyle": {
            "fontSize": 14
        },
        "borderWidth": 0,
        "padding": 5
    },
};
        chart_bf912e60a7ec47b6b1ff17ab01e76071.clear()
        chart_bf912e60a7ec47b6b1ff17ab01e76071.setOption(option_bf912e60a7ec47b6b1ff17ab01e76071);
    },
    clearTree: function(id) {
      var chart_bf912e60a7ec47b6b1ff17ab01e76071 = this.$echarts.init(
            document.getElementById(id), 'white', {renderer: 'canvas'});
      chart_bf912e60a7ec47b6b1ff17ab01e76071.clear()
    } 
    }
  }
  </script>
  <style>
    .peer {
      border: 1px solid #dee2e6;
      border-top-left-radius:1em;
      border-top-right-radius:1em;
      border-bottom-left-radius:1em;
      border-bottom-right-radius:1em;
      text-align: center;
      /* margin-top: 1%; */
      position: relative;
      height: 100px;
      margin-top: 10px;
    }
    .round-sign {
      width: 12px;
      height:12px;
      /* background-color:red; */
      border-radius:50%;
    }
    .phase_circle {
      width: 23%;
      height: 50px;
      border: 1px solid #dee2e6;
      border-radius: 1rem;
      /* align-items: center;*/
      line-height: 50px;
      font-size: smaller;
      text-align: center;
    }
    .phase_line {
      width: 2%;
      /* border-top: 1px solid #dee2e6; */
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  </style>