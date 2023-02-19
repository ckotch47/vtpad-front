<template>
  <div ref="modal1" class="modal">
    <div class="modal-content">
      <h4>{{title}}</h4>
      <p>{{text}}</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat" @click="close()">Agree</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteModalComponent",
  props: {
    title: String,
    text: String
  },
  methods: {
    close(){
      this.$refs.modal1.classList.remove('open')
    }
  }
}
</script>

<style scoped>

</style>