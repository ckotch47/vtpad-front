<template>
  <div class="vtpad_main">
    <div class='main_header'>
      <div>
        <label>
          <textarea
              type='text'
              class="materialize-textarea"
              v-model='newItem'
              @keydown.alt.enter="addItem($event)"
          />
        </label>
      </div>
    </div>
    <div class="vtpad">
      <div v-for="item in items" :key="item.id">
        <label>
            <textarea
                type='text'
                :value='item.text'
                :ref="'textarea_'+item.id"
                :id="item.id"
                class="materialize-textarea"
                @focusout="saveItem($event)"
                @keydown.ctrl.enter="addSubItem($event)"
                @keydown.alt.enter="addItem($event)"
                @keydown.ctrl.delete="deleteItem($event)"
            />
        </label>
          <SubItem :item=item.subItem :main-id=item.id :rootItems=items />
      </div>
    </div>

  </div>
</template>

<script>

import SubItem from "@/components/SubItem";
import axios from 'axios'

export default {
name: "VTPad",
  components: {SubItem},
  data() {
    return {
      padId: this.$route.params.padId,
      newItem: '',
      items: [],
      //     [{
      //   id: '',
      //   text: '',
      //   sort: 1,
      //   subItem: [{
      //     id: '',
      //     text: '',
      //     sort: 1,
      //   }]
      // }],
    };
  },
  async mounted() {
    await this.getItems();
  },
  methods: {
    async getItems(){
      this.items = (await axios.get(`/items/${this.padId}`)).data
    },
    async addItem(e){
      const indexElement = this.items.findIndex((value) => value.id === e.target.id);
      if(indexElement !== -1){
        await this.saveItem(e)
        const temp =
            (await axios.post('/items', {text: ''})).data

        this.items.push(temp);
        return true;
      }
      if(!e.target.value.toString()) return undefined;
      const temp =
          (await axios.post(`/items/${this.padId}`, {text: e.target.value.toString()})).data

      this.items.push(temp);
      return true;
    },
    async saveItem(e){
      const indexElement = this.items.findIndex((value) => value.id === e.target.id);
      if(indexElement === -1) return undefined;

      const temp = this.items[indexElement];
      if(!e.target.value.toString()) return undefined;
      this.items[indexElement].text = e.target.value.toString();
      await axios.put(`/items/${temp.id}`, {
        text: e.target.value
      });
    },
    async deleteItem(e){
      const id = e.target.id;
      const indexItem = this.items.findIndex((value) => value.id === id);
      if(indexItem === -1) return undefined;
      this.items.splice(indexItem,1);
      await axios.delete(`/items/${id}`);
    },
    async addSubItem(e) {
      const id = e.target.id;
      const indexElement = this.items.findIndex((value => value.id === id));
      if(indexElement === -1) return undefined;
      const temp = (await axios.post(`/subitems/${id}`, {text: ''})).data
      this.items[indexElement].subItem.push(temp);
    },
  }
};

</script>
<style>
.sub{
  margin-left: 3vw;
}

</style>