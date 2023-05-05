<template>
    <RouterLink
        v-for="item in routes"
        :to="item.path"
        style="display: block"
    >
        {{ item.path }}
    </RouterLink>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const routes = router.getRoutes().filter(route => route.path !== '/')
</script>
