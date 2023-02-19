<template>
  <form class="card-panel form-auth" @submit.prevent="login">
    <label>
      <input type="text" placeholder="e-mail" v-model="mail">
    </label>
    <label>
      <input type="password" placeholder="password" v-model="password">
    </label>
    <button class="btn waves-effect waves-light" type="submit" name="action">Submit
      <i class="material-icons right">send</i>
    </button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  name: "AuthComponent",
  data(){
    return {
      mail: '',
      password: ''
    }
  },
  methods:{
    async login(){
      const temp = (await axios.post('/auth', {
        mail: this.mail,
        password: this.password
      })).data
      let token = ''
      try {
        token = temp.access_token
        if(token && token !== ''){
          localStorage.setItem('token', token);
          this.$store.state.token = token;
          this.$router.push('/')
        }
      }catch (e){
        alert(temp)
      }

    }
  }
}
</script>

<style scoped>

.form-auth {
  max-width: max-content;
  margin: auto;
}
</style>