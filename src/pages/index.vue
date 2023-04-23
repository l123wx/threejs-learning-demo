<template>
    <RouterLink
        v-for="item in $router.getRoutes()"
        :to="item.path"
    >
        {{ item.path }}
    </RouterLink>
</template>
