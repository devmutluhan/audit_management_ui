<template>
    <v-btn :color="color" :prepend-icon="prependIcon" :append-icon="appendIcon" :variant="variant" :rounded="rounded"
        :size="size" :to="to ? to : null" :block="block" class="font-weight-bold px-6 text-subtitle-1"
        @click="to ? null : emits('clicked')" :loading="loading">
        {{ $t(props.title) }}
    </v-btn>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
type ButtonVariant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';

const emits = defineEmits(['clicked'])
const props = defineProps({
    title: {
        type: String,
        required: false,
        default: 'general.save'
    },
    to: {
        type: Object as PropType<any>,
        required: false
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    },
    prependIcon: {
        type: String,
        required: false,
    },
    appendIcon: {
        type: String,
        required: false,
    },
    block: {
        type: Boolean,
        required: false,
        default: false
    },
    size: {
        type: String,
        required: false,
        default: 'large'
    },
    rounded: {
        type: String,
        required: false,
        default: 'lg'
    },
    color: {
        type: String,
        required: false,
        default: 'addButtonColor'
    },
    variant: {
        type: String as PropType<ButtonVariant>,
        required: false,
        default: 'flat'
    }
})
</script>