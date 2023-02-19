<template>
  <div class="runs">
    <select class="browser-default"
            v-model="selectList"
            @contextmenu="onContextMenu($event)"
    >
      <option value="1" disabled selected>Select run</option>
      <option
          v-for="run in runs"
          :value="run.id"
          :key="run.id"
      >
        {{run.name}}
      </option>
    </select>
  </div>


  <context-menu
      v-model:show="show"
      :options="optionsComponent"
  >
    <context-menu-item>
      <div class="menu_item" @click="createRun">
        <i class="material-icons">add</i> <span >New Run</span>
      </div>
    </context-menu-item>

  </context-menu>
</template>

<script>
import axios from "axios";

export default {
name: "RunSelectComponent",
  props: {
    padId: String,
  },
  data() {
    return{
      runs: [],
      selectList: '1',
      show: false,
      optionsComponent: {
        iconFontClass: 'iconfont',
        customClass: "class-a",
        zIndex: 3,
        minWidth: 230,
        x: 500,
        y: 200
      },
    }
  },
  async mounted() {
    await this.getRuns();
    this.runs = (await axios.get(`/runs/all/${this.padId}`)).data;
  },
  methods:{
    async getRuns(){
      this.runs = (await axios.get(`/runs/all/${this.padId}`)).data;
    },
    async createRun(){
      const date = new Date();
      const name = `${date.getMonth()+1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      await axios.post(`/runs/${this.padId}`, {
        name: 'new run - ' + name
      });
      await this.getRuns()
    },
    async onContextMenu(e) {

      e.preventDefault();

      //Set the mouse position
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      //Show menu
      this.show = true;
    },
  },
  watch: {
    selectList: function (val) {
      if(val === '1') return false
      this.$router.push(`/runs/${val}`)
    }
  }
}
</script>

<style scoped>

</style>