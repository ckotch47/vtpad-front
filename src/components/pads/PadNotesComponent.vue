<template>

  <div class="card-panel-new_note">
    <div class="card new_note">
      <div class="card-content">
        <div  class="card-title activator grey-text text-darken-4" >
          <label><input v-model="newNote.title" placeholder="Title"></label>
          <label><textarea class="materialize-textarea" v-model="newNote.text" placeholder="Text"></textarea></label>
        </div>
        <a class="btn-floating btn-large waves-effect waves-light teal lighten-1" @click="newNoteSave"><i class="material-icons">add</i></a>
      </div>
    </div>
  </div>

  <div class="main_card">

    <div class="card" v-for="note in notes" :key="note.id"  @click="show(note.id)">
      <div class="card-title">
        <span class="activator grey-text text-darken-4">{{note.title}}</span>
      </div>
      <div class="card-content">
        <div v-html="note.text.length < 20 ? note.text : `${note.text.slice(0,20)}...`"></div>
      </div>
      <div class="card-content hidden" contenteditable="true" v-html="note.text"></div>

    </div>


  </div>

  <div ref="modal_note" class="modal">
    <div class="modal-content">
      <input class="modal_title" ref="modalTitleRef" :value="modalTitle"/>
      <editor-content :editor="editor" />
    </div>
    <div class="modal-footer">

      <a href="#!" class="modal-close waves-effect waves-green btn-flat" @click="close">cancel</a>
      <a href="#!" class="modal-close waves-effect waves-green btn-flat" @click="updateNote">Save</a>
    </div>
  </div>

<div class="modal-overlay" ref="modal_note__overlay"></div>

</template>

<script>



import axios from "axios";
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
export default {
  components: {
    EditorContent,
  },
name: "PadNotesComponent",
  data (){
    return{
      newNote: {
        title: '',
        text: ''
      },
      notes: [{
        id:'0',
        title: 'Title for note',
        text: 'I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.'
      }],
      modalTitle: '',
      modalText: '',
      modalId: '',
      spaceId: '',
      editor: null,
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
  async mounted(){
    await this.getAllNote();
  },
  methods: {
    async getAllNote(){
      this.notes = (await axios.get(`/notes/${this.spaceId}`)).data;
    },
    async newNoteSave(){
      if(!this.newNote.title) return false;
      const temp = await axios.post(`/notes/${this.spaceId}`, {
        title: this.newNote.title,
        text: this.newNote.text
      });
      if(temp.status === 200)
        this.notes.push(temp.data)
    },
    async updateNote(){
      console.log()
        const temp = await axios.patch(`/notes/${this.modalId}`, {
          title: this.$refs.modalTitleRef.value,
          text: this.editor.getHTML(),
        });
        if(temp.status !== 200) return false;

      const elem = this.notes.findIndex((value => value.id===temp.data.id));
      this.notes[elem] = temp.data;
      this.close();
    },
    show(e){
      const elem = this.notes.filter((value => value.id===String(e)))[0];
      this.modalText = elem.text;
      this.modalTitle = elem.title;
      this.modalId = elem.id;
      this.editor = new Editor({
        extensions: [
          StarterKit,
        ],
        content: elem.text
      })

      this.$refs.modal_note.classList.add('open');
      this.$refs.modal_note__overlay.classList.add('open');
    },
    close(){
      this.editor.destroy()
      this.$refs.modal_note.classList.remove('open');
      this.$refs.modal_note__overlay.classList.remove('open');
    }
  }
}
</script>

<style scoped>
.main_card .card{
  width: 320px;
  margin: 10px;
}
.main_card{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.new_note{
  max-width: 680px;
  margin: auto;
}
.new_note .btn-floating{
  position: absolute;
  right: 10px;
}
.card-panel-new_note{
  margin-bottom: 40px;
}
.card-content.hidden{
  display: none;
}
.modal.open{
  z-index: 4001;
  display: block;
  opacity: 1;
  top: 30vh;
  transform: scaleX(1) scaleY(1);
  max-width: 600px;
}
.modal-overlay.open{
  z-index: 1002;
  display: block;
  opacity: 0.5;
}
.modal_title{
  font-size: 2.28rem;
  margin-bottom: 0.912rem;
  /*margin: 1.52rem 0 0.912rem 0;*/
  font-weight: 400;
}
.card{
  cursor: pointer;
}
.card .card-title{
  padding: 8px 24px 0 24px;

}
.card .card-content{
  padding: 12px 24px;
}
.card-panel-new_note{
  margin-top: 48px;
}
</style>