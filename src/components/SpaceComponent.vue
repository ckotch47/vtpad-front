<template>
  <div class="space">
    <div class="space_item" v-for="space in spaces" :key="space.id">
      <router-link :to="'/pad/'+space.id" class="=space_item__name">{{space.name}}</router-link>
    </div>
    <div class="space_item">
      <p>new</p>
    </div>
  </div>
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
        sort: 0
      }]
    }
  },
  async mounted(){
    const temp = (await axios.get('/space')).data;
    this.spaces = temp
  }
}
</script>

<style scoped>
.space{
  height: 92vh;
  background: #e1e1e1;
}
.space_item{
  margin: 15px 0;
}
</style>