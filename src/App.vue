<template>
  <div class="row">
    <div class="col s3" v-if="showSpace">
      <space-component />
    </div>


    <div :class="showSpace ? 'col s9' : 'col s12' ">

        <router-view />
    </div>

  </div>

</template>

<script>
import SpaceComponent from "@/components/SpaceComponent";
import axios from 'axios'


axios.defaults.baseURL = 'http://192.168.31.104:8000';

axios.defaults.headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  responseType: "json",
};

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error.response.status === 401 &&
      location.href.split('/').at(-1) !== 'auth' &&
      location.href.split('/').at(-1) !== 'register') {
    location.href = '/auth'
  }
  return Promise.reject(error);
});

axios.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('token');

  if (!tokens) {
    return config;
  }

  let token = tokens;

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default {
  name: 'App',
  components: {SpaceComponent},
  data(){
    return {
      mobile: false,
      showSpace: true
    }
  },
  mounted() {
    console.log(process.env.BASE_URL)
    localStorage.getItem('token')
    if(this.$store.state.token === '' && this.$router.currentRoute.value.path === '/register'){
      this.$router.push('/auth')
    }
    if(this.$router.currentRoute.value.path === '/auth' ||
        this.$router.currentRoute.value.path === '/register')
      this.showSpace = false

    if(this.$isMobile()) {
      this.mobile = true;
      this.showSpace = false;
      // if(this.$router.currentRoute.value.path === '/' &&
      //     !this.$router.currentRoute.value.name){
      //   this.$router.push('/spaces')
      // }
    }
  },
  watch: {
     '$route' (to) {
       if(this.$isMobile())
        this.showSpace = false;
       else
        this.showSpace = !(to.path === '/auth' || to.path === '/register')
     }
  }
}
</script>

<style>
.menu_item {
  display: flex;
}
.menu_item span {
  margin-left: 10px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
img{

  object-fit: cover;
}
</style>
