<template>
    <div class="sub" v-if="items">
      <label v-for='elem in items' :key='elem.id'>
                <textarea
                    type='text'
                    class="materialize-textarea"
                    :value='elem.text'
                    :ref="'textarea_sub_'+elem.id"
                    :id="elem.id"
                    :idx="mainId"
                    @focusout="saveSubItem($event)"
                    @keydown.ctrl.enter="addSubItem($event)"
                    @keydown.ctrl.delete="deleteSubItem($event)"
                />
      </label>
    </div>
</template>

<script>
import axios from "axios";

export default
{
  name:"SubItem",
  props: {
    mainId: String,
    item: [Object],
    rootItems: [Object]
  },
  data(){
    return {
      items: [{
        id: '',
        text: '',
        sort: 0,
        items_id: ''
      }]
    }
  },
  mounted() {
    this.items = this.item
  },
  methods: {
    async saveSubItem(e){
      const indexElement = this.items.findIndex((value) => value.id === e.target.id);
      if(indexElement === -1) return undefined;
      const temp = this.items[indexElement];
      this.items[indexElement].text = e.target.value.toString();
      await axios.put(`/subitems/${temp.id}`, {
        text: e.target.value
      });
    },
    async addSubItem(e){
      await this.saveSubItem(e);
      const mainId = e.target.getAttribute('idx');
      const temp = (await axios.post(`/subitems/${mainId}`, {text: ''})).data;
      this.items.push(temp);
    },
    async deleteSubItem(e){
      const id = e.target.id;
      const indexElement = this.items.findIndex((value) => value.id === id);
      if(indexElement === -1) return undefined;
      this.items.splice(indexElement,1);
      await axios.delete(`/subitems/${id}`);
    },
  }
}
</script>

<style scoped>

</style>