import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import { vfmPlugin } from 'vue-final-modal'


let app = createApp(App)



app
    .use(vfmPlugin)
    .use(ContextMenu)
    .use(router)
    .mount('#app')
