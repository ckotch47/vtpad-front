<template>
  <h4>Space settings</h4>
  <div>

    <div class="card-panel">
      <label>
        <input :value="space.name"
               :id="spaceId"
      @focusout="saveSpace($event)">
      </label>
    </div>



    <div class="">
      <h5>Users into space</h5>
    <ul class="collection">
      <li class="collection-item avatar" v-for="user in users" :key="user.userId">
        <img :src="getAvatar(user.filepath)" alt="" class="circle">
        <span class="title">{{ user.username ? user.username : user.mail }} - {{user.role.toLowerCase()}}</span>
        <p>{{ user.username ? user.mail : '' }}</p>

        <div class="secondary-content" v-if="user.role !== 'OWNER'">

          <a class="btn-link" @click="updateUserRule($event, user.userId, 'editPads')" :class="getRight(user.right, 'editPads') ? 'active':''">Edit pads</a>
          <a class="btn-link" @click="updateUserRule($event, user.userId, 'editRuns')" :class="getRight(user.right, 'editRuns') ? 'active':''">Edit runs</a>
          <a class="btn-link" @click="updateUserRule($event, user.userId, 'editItems')" :class="getRight(user.right, 'editItems') ? 'active':''">Edit items</a>
          <a class="btn-link" @click="updateUserRule($event, user.userId, 'editNotes')" :class="getRight(user.right, 'editNotes') ? 'active':''">Edit notes</a>

          <a class="btn-link"  ><i class="material-icons" @click="deleteUser(user.userId)">delete</i></a>
        </div>
      </li>
    </ul>
      <label >
        <input placeholder="enter user email and press enter" @keypress.down.enter="addUser($event)">
      </label>
    </div>
    <h5>Delete this space</h5>
    <div class="card-panel">
      <label >
        <input placeholder="enter for delete space 'DELETE'" v-model="deleteSpace">
      </label>
      <button class="btn waves-effect waves-light" type="submit" name="action" @click="deleteSpaceFunc">delete
        <i class="material-icons right">delete</i>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SpaceSettingsComponent",
  data(){
    return{
      spaceId: '',
      space: {
        id: '',
        name: '',
        sort: 0,
      },
      spaceName: '',
      users: [{
        userId: "",
        spaceId: "",
        role: "",
        right: [],
        username: null,
        mail: ""
      }],
      deleteSpace: ''
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
    this.space = (await axios.get(`/space/${this.spaceId}`)).data;
    this.spaceName = this.space.name;
    this.users = (await axios.get(`/space/${this.spaceId}/users`)).data;
  },
  methods:{
    async updateUserRule(e, userId, rules){
      e.preventDefault();
      const userRight = this.users.find((value => value.userId === userId)).right;
      const currentValue = this.getRight(userRight, rules);
      let sendObj = {};
      switch (rules){
        case 'editPads':
          sendObj = {editPads: !currentValue}
          break;
        case 'editItems':
          sendObj = {editItems: !currentValue}
          break;
        case 'editRuns':
          sendObj = {editRuns: !currentValue}
          break
        case 'editNotes':
          sendObj = {editNotes: !currentValue}
          break
      }
      let temp;
      try {
        temp = await axios.patch(`/space/${this.spaceId}/user/${userId}`,sendObj)
      }catch (err){
        return false;
      }
      this.users = temp.data;
    },
    async deleteSpaceFunc(){
      if(this.deleteSpace === 'DELETE'){
        await axios.delete(`/space/${this.spaceId}`);
        location.href = '/'
      }
    },
    getAvatar(filepath){
      if(filepath)
        return process.env.VUE_APP_URL_BACKEND + '/' + filepath
      else
        return process.env.VUE_APP_URL_BACKEND + '/uploads/default.jpg'
    },
    getRight(jsons, key){
      try {
        const temp = JSON.parse(jsons)
        if (key in temp){
          return temp[key]
        }
        return false
      }catch (e) {
        return false;
      }
      
    },
    async saveSpace(e){
      try {
        await axios.put(`/space/${this.spaceId}`, {
          name: e.target.value
        });
      }catch (err){
        e.target.value = this.spaceName
      }
    },
    async addUser(e){
      const temp = (await axios.put(`/space/${this.spaceId}/user`, {
        mail: e.target.value.trim().toLowerCase()
      })).data
      if(temp!=null) {
        this.users = temp
        e.target.value = ''
      }

    },
    async deleteUser(userId){
      const temp = (await axios.delete(`/space/${this.spaceId}/user/${userId}`)).data
      if(temp!=null && Array.isArray(temp))
        this.users = temp
    }
  }
}
</script>

<style scoped>
.btn-link{
  cursor: pointer;
}
.secondary-content a{
  margin-left: 15px;
}
.secondary-content{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.secondary-content a.active{
  color: #ee6e73;
}
</style>