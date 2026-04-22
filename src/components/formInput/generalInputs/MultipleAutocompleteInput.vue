<template>
    <v-row>
        <v-col cols="12">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-autocomplete v-model="modelValue" :density="density" multiple :items="items" chips hide-no-data
                :return-object="isReturnObject" :no-data-text="$t('general.noDataFound')" :hideDetails="hideDetails"
                :item-value="!isReturnObject ? itemValue : ''" :item-title="itemTitle" :clearable="clearable"
                clear-on-select @click:clear="emit('clickClear')" :disabled="disabled"
                :placeholder="placeholder ? $t(placeholder) : ''"
                :menu-props="{ maxHeight: 300, maxWidth: 300, theme: mode }" :rules="isRequired ? stringRules : []"
                autocomplete="off">
                <template v-slot:append v-if="appendIcon">
                    <v-btn @click="emit('appendIcon')" color="addButtonColor" icon variant="text">
                        <v-icon :size="24">{{ appendIcon }}</v-icon>
                    </v-btn>
                </template>
                <template v-slot:item="{ props, item, index }" v-if="$slots.menuItem">
                    <slot name="menuItem" :item="item.raw" :props="props" :index="index"></slot>
                </template>
                <template v-slot:chip="{ item, index, props }" v-if="$slots.chipItem">
                    <slot name="chipItem" :item="item.raw" :props="props" :index="index"></slot>
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useFormValidationStore } from '@/stores/formValidation';
import InputLabel from './InputLabel.vue';
import { storeToRefs } from 'pinia'
import type { PropType } from 'vue';
import type { Density } from '@/models/types';

const themeStore = useThemeStore();
const formValidationStore = useFormValidationStore();
const { mode } = storeToRefs(themeStore);
const { stringRules } = storeToRefs(formValidationStore);
const emit = defineEmits(['update:modelValue', 'clickClear', 'appendIcon']);

const slots = defineSlots<{
    menuItem(props: { item: any, props: any, index: number }): any
    chipItem(props: { item: any, props: any, index: any }): any
}>()

const props = defineProps({
    label: {
        required: false,
        type: String,
    },
    placeholder: {
        required: false,
        type: String,
    },
    descriptionText: {
        type: String,
        default: '',
    },
    modelValue: {
        required: true,
        type: null as any,
    },
    items: {
        required: true,
        type: Array as any,
    },
    itemValue: {
        required: false,
        type: String,
    },
    itemTitle: {
        required: false,
        type: String,
    },
    isReturnObject: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    filterAction: {
        type: Function,
        required: false,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    hideDetails: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    appendIcon: {
        type: String,
        required: false
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const modelValue = computed({
    get() {
        return props.modelValue ?? null;
    },
    set(newValue: Array<any> | null) {
        emit('update:modelValue', newValue);
    }
});


</script>