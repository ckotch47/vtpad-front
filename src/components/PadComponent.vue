<template>
  <div class="pad" >
    <div class="pad_item"
         v-for="pad in pads" :key="pad.id">
      <router-link :to="`/pad/${spaceId}/items/${pad.id}`" >{{pad.name}}</router-link>
    </div>
  </div>
</template>

<script >
import axios from "axios";

export default {

name: "PadComponent",
  data(){
    return{
      spaceId: '',
      pads: [],
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
    async getPads(){
      const temp = (await axios.get(`/pad/${this.spaceId}`)).data;
      this.pads = temp
    }
  },
}
</script>

<style scoped>
.pad{
  width: 160px;
  background: #bfbfbf;
  box-shadow: -20px 4px 20px 1px rgb(114 114 114 / 55%)

}
.pad_item{
  margin: 15px 0;

}
</style>