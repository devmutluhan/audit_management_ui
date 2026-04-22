<template>
    <v-row>
        <v-col cols="12" align="left">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-textarea :rows="rows" v-model="modelValue" :rules="isRequired ? stringRules : []" variant="outlined"
                no-resize :hide-details="hideDetails" :maxLength="maxLength" :density="density" :readonly="readonly"
                :placeholder="placeholder ? $t(placeholder) : ''" autocomplete="off"></v-textarea>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { computed } from 'vue';

import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia';
import InputLabel from './InputLabel.vue';
const { stringRules } = storeToRefs(useFormValidationStore());
import type { PropType } from 'vue';
import type { Density } from '@/models/types';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    rows: {
        type: Number,
        default: 3,
    },
    modelValue: {
        required: true,
        type: null as any,
    },
    descriptionText: {
        type: String,
        default: '',
    },
    placeholder: {
        required: false,
        type: String,
    },
    label: {
        required: false,
        type: String,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    rules: {
        type: Array as any,
        default: () => [],
    },
    maxLength: {
        type: String,
        default: "255",
    },
    hideDetails: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const modelValue = computed({
    get() {
        return props.modelValue ?? [];
    },
    set(newValue: Array<any> | null) {
        emit('update:modelValue', newValue);
    }
});

</script>