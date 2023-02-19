<template>

  <ul id="slide-out" :class="!showSideBar?'sidenav active':'sidenav active'">
<!--    <a href="#" @click="showSideBar=!showSideBar"><i class="material-icons">menu</i></a>-->
    <li>
      <div class="user-view">
<!--        <div class="background">-->
<!--          <img >-->
<!--        </div>-->
        <a href="/settings/profile"><img class="circle" :src="`${userAvatar}`"></a>
        <a><span class="black-text name">{{this.user.username ? this.user.username : 'username'}}</span></a>
        <a><span class="black-text email">{{this.user.mail}}</span></a>
      </div>
    </li>
    <li><div class="divider"></div></li>
    <li><a class="subheader">Spaces</a></li>
    <li
        v-for="space in spaces" :key="space.id"
        :to="space.edit? `` : `/space/${space.id}`"
        @contextmenu="onContextMenu($event)"
        class="collection-item"
        :class="spaceId === space.id ? 'active' :''"
        @click="clickSpace($event)">
        <a class="waves-effect" :href="`/space/${space.id}`">
          {{space.name}}
        </a>
    </li>
    <li v-if="spaces.length === 0"
        @contextmenu="onContextMenu($event)"
        class="collection-item">
      <a class="waves-effect" >
        Please create space
      </a>
    </li>
  </ul>



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
      <div class="menu_item" @click="getSettings">
        <i class="material-icons">settings</i> <span>Settings</span>
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
      showSideBar: false,
      user: {
        id: '',
        name: 'John Dou',
        mail: '',
        avatar_id: ''
      },
      userAvatar: '',
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
        zIndex: 9999,
        minWidth: 230,
        x: 500,
        y: 200
      },
      activeId: '',
      spaceId: '',
    }
  },
  // watch:{
  //   '$route.params': {
  //     immediate: true,
  //     handler() {
  //       this.spaceId = this.$route.params.spaceId;
  //     },
  //   },
  // },
  async mounted(){
    this.spaces =  (await axios.get('/space')).data;
    this.user = (await axios.get('/user')).data
    if(this.user.avatar_id){
      this.userAvatar = process.env.VUE_APP_URL_BACKEND + '/' +(await axios.get(`/file/${this.user.avatar_id}`)).data.filepath
    }
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
    async getSettings(){
      // const index = this.spaces.findIndex(value => value.id === this.activeId);
      // this.$router.push(`/settings/space/${this.activeId}`)
      location.href = `/settings/space/${this.activeId}`
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
        try {
          this.activeId = e.target.href.split('/').at(-1);
        } catch {
          this.activeId = ''
        }
      }else {
        try {
          this.activeId = e.target.href.split('/').at(-1);
        } catch {
          this.activeId = ''
        }

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
.sidenav.active{
  transform: translateX(0%)
}

</style>

