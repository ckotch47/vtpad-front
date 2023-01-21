import { createWebHistory, createRouter } from "vue-router";
import PadComponent from "@/components/PadComponent";
import VTPad from "@/components/VTPad";

const routes = [
    {
        path: "/pad/:spaceId",
        name: "PadComponent",
        component: PadComponent,
    },
    {
        path: "/pad/:spaceId/items/:padId",
        name: "VTPad",
        component: VTPad,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;