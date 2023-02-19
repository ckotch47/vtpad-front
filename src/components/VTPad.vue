/* eslint-disable */
<template>
  <div class="vtpad_main">
    <run-select-component :pad-id="padId" />
    <div class='main_header'>
      <div>
        <label>
          <textarea
              type='text'
              class="materialize-textarea"
              v-model='newItem'
              @keydown.alt.enter="addItem($event, true)"
          />
        </label>
      </div>
    </div>
    <div class="vtpad">
      <div v-for="item in items" :key="item.id">
        <div class="vtpad-main_item">
          <div class="vtpad-main_item__checkbox">
            <label> <input type="checkbox" :ref="`checkbox_main_${item.id}`"/> <span/> </label>

          </div>
          <div class="vtpad-main_item__textarea">
            <label>
              <textarea
                  type='text'
                  :value='item.text'
                  :ref="'textarea_main'+item.id"
                  :id="item.id"
                  class="materialize-textarea"
                  @focusout="saveItem($event)"
                  @keydown.ctrl.enter="addSubItem($event)"
                  @keydown.alt.enter="addItem($event)"
                  @keydown.ctrl.delete="deleteItem($event)"

                  @keydown.down="nextMainFocused($event)"
                  @keydown.up="prevMainFocused($event)"

                  @keydown.shift.enter="checkMain($event)"

                  @keydown.alt.left="upMainItem($event)"
                  @keydown.alt.right="downMainItem($event)"
              />
            </label>
          </div>
        </div>
        <div class="sub" v-if="item.subItem">
          <div class="vtpad-sub_item"  v-for='elem in item.subItem' :key='elem.id'>
            <div class="vtpad-sub_item__checkbox">
              <label> <input type="checkbox" :ref="`checkbox_sub_${elem.id}`"/> <span/></label>
            </div>
            <div class="vtpad-sub_item__textarea">
              <label>
                    <textarea
                        type='text'
                        class="materialize-textarea"
                        :value='elem.text'
                        :ref="'textarea_sub_'+elem.id"
                        :id="elem.id"
                        :ids="item.id"
                        @focusout="saveSubItem($event)"
                        @keydown.ctrl.enter="addSubItem($event)"
                        @keydown.ctrl.delete="deleteSubItem($event)"
                        @keydown.alt.enter="addItem($event)"

                        @keydown.down="nextSubFocused($event)"
                        @keydown.up="prevSubFocused($event)"

                        @keydown.shift.enter="checkSub($event)"

                        @keydown.ctrl.left="upSubItem($event)"
                        @keydown.ctrl.right="downSubItem($event)"
                    />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
/* eslint-disable */
import axios from 'axios'
import RunSelectComponent from "@/components/RunSelectComponent";

export default {
name: "VTPad",
  components: {RunSelectComponent},
  data() {
    return {
      selectList: '',
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
    async upMainItem(e){
      e.preventDefault();
      let index = this.items.findIndex((value) => value.id === e.target.id);
      if(!this.items[index-1]) return false;
      const prevIndex = index - 1;
      const temp = await axios.patch(`/items/${this.items[index].id}`, {
        sortBeforeId: this.items[prevIndex].id
      });
      if(temp.status === 200)
        this.items = temp.data

      await this.$refs[`textarea_main${this.items[index].id}`][0].focus()
      this.$refs[`textarea_main${this.items[index-1].id}`][0].focus()
    },
    async downMainItem(e){
      e.preventDefault();
      const index = this.items.findIndex((value) => value.id === e.target.id);
      if(!this.items[index+1]) return false;
      const prevIndex = index + 1;
      const temp = await axios.patch(`/items/${this.items[index].id}`, {
        sortAfterId: this.items[prevIndex].id
      });
      if(temp.status === 200)
        this.items = temp.data
      this.$refs[`textarea_main${this.items[prevIndex].id}`][0].focus()
    },
    async upSubItem(e){

    },
    async downSubItem(e){

    },
    async getItems(){
      this.items = (await axios.get(`/items/${this.padId}`)).data
    },
    async addItem(e, main=false){
      const indexElement = this.items.findIndex((value) => value.id === e.target.id);
      if(indexElement !== -1){
        await this.saveItem(e)
        const temp =
            (await axios.post(`/items/${this.padId}`, {text: ''})).data
        this.items.push(temp);
        return true;
      }
      if(!e.target.value.toString()) return undefined;
      const text = main ? e.target.value.toString() :''
      const temp =
          (await axios.post(`/items/${this.padId}`, {text: text})).data

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
      await this.prevMainFocused(e)
      this.items.splice(indexItem,1);
      await axios.delete(`/items/${id}`);

    },


    async addSubItem(e) {
      if(e.target.getAttribute('ids')) await this.saveSubItem(e);

      let id = '';
      if(e.target.getAttribute('ids')) id = e.target.getAttribute('ids');
      else id = e.target.id
      const indexElement = this.items.findIndex((value => value.id === id));
      if(indexElement === -1) return undefined;
      const temp = (await axios.post(`/items/${this.padId}`, {text: '', mainId: id})).data
      this.items[indexElement].subItem.push(temp);
    },
    async deleteSubItem(e){
      const id = e.target.id;
      const index = this.items.findIndex(value => value.id === e.target.getAttribute('ids'))
      const indexElement = this.items[index].subItem.findIndex((value) => value.id === id);
      if(indexElement === -1) return undefined;
      this.items[index].subItem.splice(indexElement,1);
      await axios.delete(`/items/${id}`);
      await this.prevSubFocused(e)
    },
    async saveSubItem(e){
      const index = this.items.findIndex(value => value.id === e.target.getAttribute('ids'))
      const indexElement = this.items[index].subItem.findIndex((value) => value.id === e.target.id);
      if(indexElement === -1) return undefined;
      const temp = this.items[index].subItem[indexElement];
      this.items[index].subItem[indexElement].text = e.target.value.toString();
      await axios.put(`/items/${temp.id}`, {
        text: e.target.value
      });
    },
    async nextSubFocused(e, checkbox=false){
      e.preventDefault();
      const index = this.items.findIndex(value => value.id === e.target.getAttribute('ids'))
      const indexElement = this.items[index].subItem.findIndex((value) => value.id === e.target.id);
      if(this.items[index].subItem[indexElement+1]){
        if(checkbox && this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement+1].id}`][0])
          this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0].checked = true

        this.$refs[`textarea_sub_${this.items[index].subItem[indexElement+1].id}`][0].focus()
      } else {
        if(this.items[index+1]){
          this.$refs[`textarea_main${this.items[index+1].id}`][0].focus()
        }
      }
    },
    async prevSubFocused(e, checkbox = false){
      e.preventDefault();
      const index = this.items.findIndex(value => value.id === e.target.getAttribute('ids'))
      const indexElement = this.items[index].subItem.findIndex((value) => value.id === e.target.id);

      if(this.items[index].subItem[indexElement-1]){
        if(checkbox && this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement-1].id}`][0])
          this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0].checked = true

        this.$refs[`textarea_sub_${this.items[index].subItem[indexElement-1].id}`][0].focus()
      } else {
        if(checkbox && this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0])
          this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0].checked = true
        this.$refs[`textarea_main${this.items[index].id}`][0].focus()
      }
    },

    async nextMainFocused(e){
      e.preventDefault();
      const index = this.items.findIndex((value) => value.id === e.target.id);
      if(this.items[index].subItem.length > 0){
        this.$refs[`textarea_sub_${this.items[index].subItem[0].id}`][0].focus()
      }else if (this.items[index+1]){
        this.$refs[`textarea_main${this.items[index+1].id}`][0].focus()
      }
    },
    async prevMainFocused(e){
      e.preventDefault();
      const index = this.items.findIndex((value) => value.id === e.target.id);
      if(!this.items[index-1]) return false;
      if(this.items[index-1].subItem.length > 0){
        this.$refs[`textarea_sub_${this.items[index-1].subItem.at(-1).id}`][0].focus()
      }else if (this.items[index-1]){
        this.$refs[`textarea_main${this.items[index-1].id}`][0].focus()
      }
    },

    async checkMain(e){
      e.preventDefault();
      const index = this.items.findIndex((value) => value.id === e.target.id);
      this.$refs[`checkbox_main_${this.items[index].id}`][0].checked = !this.$refs[`checkbox_main_${this.items[index].id}`][0].checked
    },
    async checkSub(e){
      e.preventDefault();
      const index = this.items.findIndex(value => value.id === e.target.getAttribute('ids'))
      const indexElement = this.items[index].subItem.findIndex((value) => value.id === e.target.id);
      this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0].checked = !this.$refs[`checkbox_sub_${this.items[index].subItem[indexElement].id}`][0].checked
    },


  },


};

</script>
<style>
.sub{
  margin-left: 3vw;
}
.vtpad-main_item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
}
.vtpad-main_item__checkbox {

}
.vtpad-main_item__textarea {
  width: 60vw;
  margin-left: 15px;
}

.vtpad-sub_item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
}
.vtpad-sub_item__checkbox {

}
.vtpad-sub_item__textarea {
  width:  calc(60vw - 50px);;
  margin-left: 15px;
}
[type="checkbox"]+span:not(.lever):before, [type="checkbox"]:not(.filled-in)+span:not(.lever):after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  z-index: 0;
  border: 2px solid #5a5a5a;
  border-radius: 1px;
  margin-top: 3px;
  -webkit-transition: .2s;
  transition: .2s;
}
[type="checkbox"]:checked+span:not(.lever):before {
  top: -4px;
  left: -5px;
  width: 16px;
  height: 25px;
  border-top: 2px solid transparent;
  border-left: 2px solid transparent;
  border-right: 2px solid #26a69a;
  border-bottom: 2px solid #26a69a;
  -webkit-transform: rotate(40deg);
  transform: rotate(40deg);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
}
.runs {
  margin: 0.5rem 0 1rem 0;
}
</style>