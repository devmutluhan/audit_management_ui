<template>
    <v-row>
        <v-col cols="12">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-text-field v-model="modelValue" :density="density" :rules="isRequired ? dateRules : []"
                :hide-details="hideDetails" :type="type" :clearable="clearable" :max="max" :min="min"
                :disabled="disabled" @click:clear="emit('clickClear')" autocomplete="off"></v-text-field>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { computed } from 'vue';
import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia';
import type { PropType } from 'vue';
import type { Density } from '@/models/types';
import InputLabel from './InputLabel.vue';

const { dateRules } = storeToRefs(useFormValidationStore());

const emit = defineEmits(['update:modelValue', 'clickClear']);
const props = defineProps({
    modelValue: {
        required: true,
        type: null as any,
    },
    descriptionText: {
        type: String,
        default: '',
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
    hideDetails: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'date',
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    clearable: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    max: {
        type: String,
        default: '9999-12-31'
    },
    min: {
        type: String,
        default: '1800-01-01'
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