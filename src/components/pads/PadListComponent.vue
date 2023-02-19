<template>
  <div class="collection" >
    <a
        v-if="pads.length === 0"
        class="collection-item"
        @contextmenu="onContextMenu($event)"
    >
      <span>Please create pad</span>
    </a>
    <router-link
        v-for="pad in pads" :key="pad.id"
        :to="pad.edit? `` : `/pad/${pad.id}`"
        :ref="`pad_${pad.id}`"
        class="collection-item"
        @contextmenu="onContextMenu($event)"
    >
      <span v-if="!pad.edit">{{pad.name}}</span>
      <label v-if="pad.edit">
        <input
            :value="pad.name"
            :ref="`pad_input_${pad.id}`"
            @keydown.enter="updatePad($event)"
            @focusout="updatePad($event)"
        />
      </label>
    </router-link>
  </div>

  <context-menu
      v-model:show="show"
      :options="optionsComponent"
  >
    <context-menu-item>
      <div class="menu_item" @click="createPad">
        <i class="material-icons">add</i> <span>New Pad</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="UpPad">
        <i class="material-icons">arrow_upward</i> <span>Up Pad</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="DownPad">
        <i class="material-icons">arrow_downward</i> <span>Down Pad</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="renamePad">
        <i class="material-icons">mode_edit</i> <span>Rename Pad</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="deletePad">
        <i class="material-icons">delete</i> <span>Delete Pad</span>
      </div>
    </context-menu-item>
  </context-menu>
</template>

<script>
import axios from "axios";

export default {
  name: "PadListComponent",
  data(){
    return{
      spaceId: '',
      pads: [],
      activeId: '',
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
  watch:{
    '$route.params': {
      immediate: true,
      handler() {
        this.spaceId = this.$route.params.spaceId;
        this.getPads();
      },
    },
  },
  async mounted(){
    await this.getPads();

  },
  methods: {
    async UpPad(){
      const index =  this.pads.findIndex(value => value.id === this.activeId);
      const prevIndex = index - 1;
      if(index === 0) return;

      const temp = (await axios.patch(`/pad/${this.activeId}`, {
        sortBeforeId: this.pads[prevIndex].id
      }))
      if(temp.status === 200)
        this.pads = temp.data
    },
    async DownPad(){
      const index =  this.pads.findIndex(value => value.id === this.activeId);
      const prevIndex = index + 1;
      if(index === this.pads.length-1) return;

      const temp = (await axios.patch(`/pad/${this.activeId}`, {
        sortAfterId: this.pads[prevIndex].id
      }))
      if(temp.status === 200)
        this.pads = temp.data
    },
    goToThing(e){
      e.stop();
      e.preventDefault();

      return false;
    },
    async getPads(){
      this.pads = (await axios.get(`/pad/${this.spaceId}`)).data;
    },
    async onContextMenu(e) {
      e.preventDefault();
      //Set the mouse position
      if(this.activeId !== ''){
        const index = this.pads.findIndex(value => value.id === this.activeId);
        this.pads[index].edit = false;
        this.activeId = e.target.href.split('/').at(-1);
      }else {
        this.activeId = e.target.href.split('/').at(-1);
      }
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      //Show menu
      this.show = true;
    },
    async createPad() {
      const temp = (await axios.post(`/pad/${this.spaceId}`, {
        name: "new Pad"
      })).data
      this.pads.push(temp)
    },
    async deletePad(){
      const index = this.pads.findIndex(value => value.id === this.activeId);
      await axios.delete(`/pad/${this.activeId}`, );
      this.pads.splice(index, 1);
      this.activeId = '';
    },
    async renamePad(){
      const index = this.pads.findIndex(value => value.id === this.activeId);
      this.pads[index].edit = true;
    },
    async updatePad(e){
      const index = this.pads.findIndex(value => value.id === this.activeId);
      await axios.put(`/pad/${this.activeId}`, {
        name: e.target.value
      });
      this.pads[index].name = e.target.value;
      this.pads[index].edit = false;
      this.activeId = '';
    }
  },
}
</script>

<style scoped>

</style>