<template>
  <form class="card-panel form-register" @submit.prevent="register">
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
  name: "RegisterComponent",
  data(){
    return {
      mail: '',
      password: ''
    }
  },
  methods:{
    async register(){
      const temp = (await axios.post('/user', {
        mail: this.mail,
        password: this.password
      })).data
      try {
        if(temp.id){
          this.$router.push('/auth')
        }
      }catch (e){
        alert(temp)
      }
    }
  }
}
</script>

<style scoped>

.form-register {
  max-width: max-content;
  margin: auto;
}
</style>