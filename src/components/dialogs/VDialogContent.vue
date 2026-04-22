<template>
    <v-dialog :width="width" :fullscreen="isMobileDevice()">
        <template v-slot:activator="{ props: activatorProps }">
            <slot name="activator" :props="activatorProps">
            </slot>
        </template>
        <template v-slot:default="{ isActive }">
            <slot name="default" :isActive="isActive"></slot>
        </template>
    </v-dialog>
    <v-dialog v-model="visible" :width="width" :fullscreen="isMobileDevice()">
        <template v-slot:default="{ isActive }">
            <slot name="default" :isActive="isActive"></slot>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">

import { isMobileDevice } from '@/assets/ts/_utils';
import { computed, type Ref } from 'vue';

const emit = defineEmits(['update:modelValue']);

const slots = defineSlots<{
    activator(props: { props: any }): any
    default(props: { isActive: Ref<boolean, boolean> }): any
}>()

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: false,
        default: false
    },
    width: {
        type: String,
        required: false,
        default: '800'
    }
});

const visible = computed({
    get() {
        return props.modelValue ?? false;
    },
    set(newValue: Array<any> | null) {
        emit('update:modelValue', newValue);
    }
});

</script>