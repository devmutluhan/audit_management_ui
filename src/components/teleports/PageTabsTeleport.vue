<template>
    <Teleport to="#kt_page_tabs_actions" v-if="isMounted">
        <template v-if="$slots.component">
            <slot name="component"></slot>
        </template>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const isMounted = ref(false);

const slots = defineSlots<{
    component(): any
}>()

onMounted(() => {
    isMounted.value = true
})

</script>