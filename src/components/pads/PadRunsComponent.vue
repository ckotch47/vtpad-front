<template>
  <div v-for="pad in space.pad" :key="pad.id" >
    <div class="" v-if="pad.run.length > 0">
      <h5>{{pad.padName}}</h5>
      <div class="collection" >
        <div class="collection-item" v-for="run in pad.run" :key="run.id" >
          <div class="progress" ref="progress_bar">
            <svg>
              <line v-if="run.itemsCount.all"
                  x1="0"
                  y1="0"
                  :x2="(progress_width * (run.itemsCount.pass / run.itemsCount.all))"
                  y2="0" class="progress_pass"  :stroke-dasharray="progress_width"/>
              <line v-if="run.itemsCount.all"
                  :x1="(progress_width * (run.itemsCount.pass / run.itemsCount.all))"
                  y1="0"
                  :x2="(progress_width * (run.itemsCount.pass / run.itemsCount.all)) + (progress_width * (run.itemsCount.fail / run.itemsCount.all))"
                  y2="0" class="progress_fail"   :stroke-dasharray="progress_width"  />
            </svg>
          </div>

          {{run.name}}
          <div class="secondary-content">
              {{run.itemsCount.pass}}/{{run.itemsCount.all}} passed
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "PadRunsComponent",
  data(){
    return{
      spaceId: '',
      space: {
        spaceId: '',
        spaceName: '',
        pad: [{
          padId: '',
          padName: '',
          run: [{
            name: '',
            id: '',
            date: '',
            itemsCount: {
              all: 0,
              fail: 0,
              pass: 0
            }
          }]
        }]
      },
      progress_width: 0
    }
  },
  watch:{
    '$route.params': {
      immediate: true,
      handler() {
        this.spaceId = this.$route.params.spaceId;
      },
    },
  },
  async mounted() {
    await this.getAllRuns();
    this.progress_width = this.$refs.progress_bar[0].clientWidth
  },
  methods: {
    async getAllRuns(){
      const temp = (await axios.get(`/space/${this.spaceId}/all_runs`)).data;
      this.space = temp
    }
  }
}
</script>

<style scoped>
.progress{
  /*width: 100px;*/
  height: 4px;
  /*box-shadow: 0 0 10px 0px;*/
  background-color: #e0f2f1 ;
}
.progress svg{
  width: 100%;
}
.progress_pass{
  stroke-width: 15;
  stroke: #1de9b6  ;
}
.progress_fail{
  stroke-width: 15;
  stroke: #ef5350 ;
}
</style>