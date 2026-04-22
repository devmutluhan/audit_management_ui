<template>
    <v-tooltip :location="location">
        <template v-slot:activator="{ props }" v-if="$slots.activatorItem">
            <span v-bind="props">
                <slot name="activatorItem"></slot>
            </span>
        </template>
        <template v-else v-slot:activator="{ props }">
            <v-icon v-bind="props" :color="color" :size="size">{{ icon }}</v-icon>
        </template>
        <v-row>
            <v-col>
                {{ $t(descriptionText) }}
            </v-col>
        </v-row>
    </v-tooltip>
</template>

<script setup lang="ts">
import type { LocationTooltip } from '@/models/types';
import type { PropType } from 'vue';

const slots = defineSlots<{
    activatorItem(props: any): any
}>()

const props = defineProps({
    descriptionText: {
        required: true,
        type: null as any,
    },
    color: {
        type: String,
        required: false,
        default: 'info'
    },
    icon: {
        type: String,
        required: false,
        default: 'mdi-information'
    },
    location: {
        type: String as PropType<LocationTooltip>,
        required: false,
        default: 'end'
    },
    size: {
        type: Number,
        required: false,
        default: 15
    }
})

</script>