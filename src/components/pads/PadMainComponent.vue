<template>
  <div class="row">
    <div class="col s12">
      <ul class="tabs" @click="test($event)" ref="tabsList">
        <li class="tab col s3"><a class="active"  tabindex="pads">Pads</a></li>
        <li class="tab col s3"><a  tabindex="runs">Runs</a></li>
        <li class="tab col s3 "><a tabindex="bugs">Bugs</a></li>
        <li class="tab col s3"><a  tabindex="notes">Notes</a></li>
      </ul>
    </div>
    <transition name="slide-fade">
    <div class="tab_body">
      <div id="pads" class="col s12" v-if="this.tabActive==='pads'"><PadListComponent /></div>
      <div id="runs" class="col s12" v-if="this.tabActive==='runs'"><PadRunsComponent /></div>
      <div id="bugs" class="col s12" v-if="this.tabActive==='bugs'"><PadBugsComponent /></div>
      <div id="notes" class="col s12" v-if="this.tabActive==='notes'"><PadNotesComponent /></div>
    </div>
    </transition>
  </div>



</template>

<script>


import PadListComponent from "@/components/pads/PadListComponent";
import PadRunsComponent from "@/components/pads/PadRunsComponent";
import PadBugsComponent from "@/components/pads/PadBugsComponent";
import PadNotesComponent from "@/components/pads/PadNotesComponent";
export default {

  name: "PadMainComponent",
  components: {PadNotesComponent, PadBugsComponent, PadRunsComponent, PadListComponent},
  data(){
      return{
        tabActive: 'pads',
        space_id: '',
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
  methods: {
    test(e){
      e.preventDefault();
      for(const el of this.$refs.tabsList.children){
        el.children[0].classList.remove('active');
      }
      e.target.classList.add('active');
      this.tabActive = e.target.getAttribute('tabindex');
    }
  }

}
</script>

<style scoped>
.tabs .tab a{
  color: #26a69a;
}
.tabs .tab a:hover, .tabs .tab a.active{
  background-color: #e0f2f1  ;
  cursor: pointer;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>