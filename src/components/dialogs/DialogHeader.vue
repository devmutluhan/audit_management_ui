<template>
    <div class="d-flex align-center justify-space-between px-6 py-4 border-b">
        <div class="d-flex align-center text-truncate">
            <v-avatar v-if="titleIcon" color="logoGreen" variant="tonal" size="40" class="mr-4 rounded-lg">
                <v-icon :icon="titleIcon" size="24"></v-icon>
            </v-avatar>

            <span class="text-h6 font-weight-bold text-high-emphasis text-truncate">
                {{ $t(title) }}
            </span>
        </div>

        <v-btn icon="mdi-close" variant="text" density="comfortable" color="grey-darken-1" @click="clickClose"></v-btn>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    clickClose: {
        type: Function,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    titleIcon: {
        type: String,
        default: ''
    }
});
</script>

<style scoped>
.border-b {
    border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}
</style>