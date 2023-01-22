<template>
  <div class="collection" >

    <router-link
        v-for="space in spaces" :key="space.id"
        :to="space.edit? `` : `/pad/${space.id}`"
        @contextmenu="onContextMenu($event)"
        class="collection-item"
        @click="clickSpace($event)"
        >
      <span class="space_item__name" v-if="!space.edit" >{{space.name}}</span>
      <label v-if="space.edit">
        <input
          :value="space.name"
          @keydown.enter="saveSpace($event)"
          @focusout="saveSpace($event)"
      />
      </label>
    </router-link>
  </div>
  <context-menu
      v-model:show="show"
      :options="optionsComponent"
  >
    <context-menu-item>
      <div class="menu_item" @click="createSpace">
        <i class="material-icons">add</i> <span >New Space</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="renameSpace">
        <i class="material-icons">mode_edit</i> <span>Rename Space</span>
      </div>
    </context-menu-item>

    <context-menu-item>
      <div class="menu_item" @click="deleteSpace">
        <i class="material-icons">delete</i> <span>Delete Space</span>
      </div>
    </context-menu-item>

  </context-menu>
</template>

<script>
import axios from "axios";

export default {
  name: "SpaceComponent",
  data(){
    return{
      spaces: [{
        id: '',
        name: '',
        sort: 0,
        edit: false
      }],
      show: false,
      optionsComponent: {
        iconFontClass: 'iconfont',
        customClass: "class-a",
        zIndex: 3,
        minWidth: 230,
        x: 500,
        y: 200
      },
      activeId: '',
    }
  },

  async mounted(){
    this.spaces =  (await axios.get('/space')).data;
  },
  methods: {
    async createSpace(){
      const temp = (await axios.post('/space', {
        name: 'new space'
      } )).data;
      this.spaces.push(temp);
      this.activeId = '';
    },
    async clickSpace(e){
      if(e.target.tagName !== 'INPUT' && this.activeId !== '') {
        const index = this.spaces.findIndex(value => value.id === this.activeId);
        this.spaces[index].edit = false;
        this.activeId = '';
      }
    },
    async saveSpace(e){
      const index = this.spaces.findIndex(value => value.id === this.activeId);

      await axios.put(`/space/${this.activeId}`, {
        name: e.target.value
      });

      this.spaces[index].name = e.target.value;
      this.spaces[index].edit = false;
      this.activeId = '';
    },
    async deleteSpace(){
      const index = this.spaces.findIndex(value => value.id === this.activeId);
      await axios.delete(`/space/${this.activeId}`, );
      this.spaces.splice(index, 1);
      this.activeId = '';
    },

    async renameSpace(){
      const index = this.spaces.findIndex(value => value.id === this.activeId);
      this.spaces[index].edit = true;
    },

    async onContextMenu(e) {
      let index = -1;
      e.preventDefault();
      if(this.activeId !== '') {
        index = this.spaces.findIndex(value => value.id === this.activeId);
        this.spaces[index].edit = false;
        this.activeId = '';
      }else {
        this.activeId = e.target.href.split('/').at(-1);
      }
      //Set the mouse position
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      //Show menu
      this.show = true;
    },

  },

}
</script>

<style scoped>


</style>

