import { createRouter, createWebHashHistory } from 'vue-router'

const pages = import.meta.glob(['../pages/**', '!../pages/index.vue'])

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../pages/index.vue')
        },
        ...Object.keys(pages).map(path => {
            return {
                path: path.match(/(?<=\.\/pages).+(?=\.vue)/g)?.[0] || '',
                component: pages[path]
            }
        })
    ]
})

export default router