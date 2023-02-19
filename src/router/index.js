import { createWebHistory, createRouter } from "vue-router";
import VTPad from "@/components/VTPad";
import RunComponent from "@/components/RunComponent";
import SpaceComponent from "@/components/SpaceComponent";
import AuthComponent from "@/components/AuthComponent";
import RegisterComponent from "@/components/RegisterComponent";
import ProfileComponent from "@/components/settings/ProfileComponent";
import SpaceSettingsComponent from "@/components/settings/SpaceSettingsComponent";
import PadMainComponent from "@/components/pads/PadMainComponent";

const routes = [
    {
        path: "/space",
        name: "PadComponent",

        children: [
            {
                path: ':spaceId',
                component: PadMainComponent,
            }
        ]
    },
    {
        path: "/pad",
        name: "VTPad",
        children: [
            {
                path: ':padId',
                name: 'pad',
                component: VTPad,
            }
        ]

    },
    {
        path: "/runs",
        name: "RunComponent",
        children: [
            {
                path: ':runId',
                component: RunComponent,
            }
        ]
    },
    {
        path: "/spaces",
        name: "SpaceComponent",
        component: SpaceComponent,
    },
    {
        path: "/auth",
        name: "auth",
        component: AuthComponent

    },
    {
        path: '/register',
        name: 'register',
        component: RegisterComponent
    },
    {
      path: '/settings',
      name: 'settings',
      children: [
          {
              path: 'profile',
              name: 'settingsProfile',
              component: ProfileComponent,
          },
          {
              path: 'space/:spaceId',
              name: 'settingsSpace',
              component: SpaceSettingsComponent,
          }
      ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;