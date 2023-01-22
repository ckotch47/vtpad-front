<template>
  <div class="row">

    <div class="col s3">
      <space-component />
    </div>

    <div class="col s9">
      <router-view />
    </div>

  </div>

</template>

<script>
import SpaceComponent from "@/components/SpaceComponent";
import axios from 'axios'


axios.defaults.baseURL = 'http://localhost:8000';
export default {
  name: 'App',
  components: {SpaceComponent},
}
</script>

<style>
.menu_item {
  display: flex;
}
.menu_item span {
  margin-left: 10px;
}
</style>
