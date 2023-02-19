<template>
  <div class="run_main">

    <div class="card-panel progress_main_block" ref="progress_main_block">
      <div class="progress_count">
        <span>{{this.passed_count}}/{{this.all}} passed </span>
      </div>

      <div class="progress" ref="progress_bar">
        <svg>
          <line x1="0" y1="0" :x2="passed" y2="0" class="progress_pass"  :stroke-dasharray="progress_width"/>
          <line  :x1="passed" y1="0" :x2="passed+failed" y2="0" class="progress_fail"   :stroke-dasharray="progress_width"  />
        </svg>
      </div>
    </div>

    <div>
      <label>
          <textarea
              type='text'
              class="materialize-textarea"
              v-model='run.name'
              @focusout="saveRun($event)"
              @keydown.enter="saveRun($event)"
          />
      </label>
    </div>
    <div class="run collection" v-if="items.length > 0">
      <div v-for="item in items" :key="item.id">
        <div class="run-main_item collection-item" :id="item.id">
          <div>{{item.text}}</div>
          <div>
            <select class="browser-default custom_select" @change="onChange($event)" :id="item.id" v-model="item.state">
              <option value="" v-if="!item.state"></option>
              <option value="pass" :selected="item.state==='pass'">pass</option>
              <option value="fail" :selected="item.state==='fail'">fail</option>
            </select>
          </div>
          <div class="secondary-content pass" v-if="item.state==='pass'"></div>
          <div class="secondary-content fail" v-else-if="item.state === 'fail'"></div>
        </div>
        <div class="run-sub" v-if="item.subItem">
          <div class="run-sub_item collection-item" v-for='elem in item.subItem' :key='elem.id' >
              <div>{{elem.text}}</div>
              <div>
                <select class="browser-default custom_select" @change="onChange($event)" :id="elem.id" v-model="elem.state">
                  <option value="" v-if="!elem.state"></option>
                  <option value="pass" :selected="elem.state==='pass'">pass</option>
                  <option value="fail" :selected="elem.state==='fail'">fail</option>
                </select>
              </div>
            <div class="secondary-content pass" v-if="elem.state==='pass'"></div>
            <div class="secondary-content fail" v-else-if="elem.state === 'fail'"></div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import axios from 'axios'
export default {
name: "RunComponent",
  data() {
    return {
      runId: this.$route.params.runId,
      newItem: '',
      items: [],
      run: {},
      passed: 0,
      failed_width: 0,
      passed_width: 0,
      failed: 0,
      all: 0,
      progress_width: 0,
      passed_count: 0,
      failed_count: 0,
    }
  },
  async mounted() {
    window.addEventListener("scroll", this.onScroll, true)
    await this.getItems();
    this.run = (await axios.get(`/runs/${this.runId}`)).data;
    this.progress_width = this.$refs.progress_bar.clientWidth
  },
  methods: {
    onScroll() {
      if(window.scrollY > 130){
        this.$refs.progress_main_block.classList.add('fixed')
      }
      else if(window.scrollY < 140){
        this.$refs.progress_main_block.classList.remove('fixed')
      }
    },
    async getItems() {
      this.items = (await axios.get(`/runs/items/${this.runId}`)).data
    this.updateRunsProgress()
    },
    async onChange(e){
      await axios.patch(`/runitems/${e.target.id}?state=${e.target.value}`)
      this.updateRunsProgress()
    },
    async saveRun(e){
      await axios.patch(`/runs/${this.runId}?name=${this.run.name}`)
      e.preventDefault();
    },
    updateRunsProgress(){
      this.progress_width = this.$refs.progress_bar.clientWidth
      this.all = this.items.length

      this.passed_count = this.items.filter(value => value.state === 'pass') ? this.items.filter(value => value.state === 'pass').length : 0
      this.failed_count = this.items.filter(value => value.state === 'fail') ? this.items.filter(value => value.state === 'fail').length : 0
      for(const item of this.items){
        this.all += item.subItem.length
          this.passed_count += item.subItem.filter(value => value.state === 'pass') ? item.subItem.filter(value => value.state === 'pass').length : 0
          this.failed_count += item.subItem.filter(value => value.state === 'fail') ? item.subItem.filter(value => value.state === 'fail').length : 0

      }
      this.passed = this.progress_width * (this.passed_count  / this.all);
      this.failed = this.progress_width * (this.failed_count  / this.all);
    }
  }
}
</script>

<style scoped>
.sub {
  margin: 0;
}
.run-main_item:nth-child(1){
  border-top: 1px solid #d0e0de;
}
.run-main_item div:nth-child(1){
  width: 60vw;
}
.run-main_item {
  display: flex;
}
.run-sub_item div:nth-child(1){
  width: 60vw;
  padding-left: 2vw;
}
.run-sub_item {
  display: flex;
}
.run-sub_item:nth-child(1) {
  /*background-color: #d0e0de;*/
}
.run-sub_item:nth-child(2n+1) {
  background-color: rgba(242,242,242,0.5);
}
.run-sub_item:nth-child(2n+1) {
  /*background-color: #d0e0de;*/
}
.custom_select {
  background-color: rgba(255,255,255,0.9);
  width: 100%;
   padding: 0px;
  border: 1px solid #f2f2f2;
  border-radius: 2px;
  height: 1.5rem;
}
.secondary-content{
  margin-left: 5vw;
  width: 12px;
  height: 12px;
  border-radius: 100%;
}
.secondary-content.fail{
  background-color: #ef5350;
}
.secondary-content.pass{
  background-color: #1de9b6;
}

.progress{
  /*width: 100px;*/
  height: 7px;
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
.progress_main{
  stroke-width: 16;
  stroke: rgb(255, 255, 255);
}
.progress_main_block.fixed{
  position: fixed;
  z-index: 999;
  width: 74%;
  margin-top: 0;
}
</style>