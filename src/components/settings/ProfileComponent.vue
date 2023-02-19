<template>
  <div class="profile_header ">
    <img class="circle" :src="`${userAvatar}`" style="width: 64px; height: 64px">
    <h4>Profile</h4>
  </div>
  <div class="card-panel">
    <label><input v-model="username" placeholder="username" /></label>
    <label><input :value="user.mail" disabled ></label>

    <button class="btn waves-effect waves-light" type="submit" name="action" @click="saveUser">save
      <i class="material-icons right">save</i>
    </button>

  </div>
</template>

<script>
import axios from "axios";

export default {
name: "ProfileComponent",
  data(){
    return{
      username: '',
      userAvatar: '',
      mail: '',
      user: {
        id: '',
        username: '',
        mail: ''
      },
    }
  },
  async mounted() {
    this.user = (await axios.get('/user')).data;
    if(this.user.avatar_id){
      this.userAvatar = process.env.VUE_APP_URL_BACKEND + '/' +(await axios.get(`/file/${this.user.avatar_id}`)).data.filepath
    }
    this.username = this.user.username;
  },
  methods: {
    async saveUser(){
      this.user = (await axios.patch('/user', {
        username: this.username
      })).data
    }
  }
}
</script>

<style scoped>
.profile_header{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
}
.profile_header img{
  margin-right: 15px;
}
</style>