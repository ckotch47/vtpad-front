import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import VueMobileDetection from "vue-mobile-detection";
import { createStore } from 'vuex'

const app = createApp(App)

const store = createStore({
    state() {
        return{
            token: localStorage.getItem('token') || '',
        }
    }
})



app
    .use(store)
    .use(VueMobileDetection)
    .use(ContextMenu)
    .use(router)
    .mount('#app')
