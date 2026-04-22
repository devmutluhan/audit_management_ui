<template>
    <v-row>
        <v-col cols="12" :class="padding">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-select v-model="modelValue" :density="density" :items="items" hide-no-data
                :menu-icon="hideMenuIcon ? '' : '$dropdown'" :label="inputLabel ? $t(inputLabel) : ''"
                :return-object="isReturnObject" :base-color="hideBorder ? 'transparent' : ''"
                :placeholder="placeholder ? $t(placeholder) : ''" :color="hideBorder ? '#00ACC1' : ''"
                :no-data-text="$t('general.noDataFound')" :hideDetails="hideDetails" :suffix="suffix"
                :item-value="!isReturnObject ? itemValue : ''" :item-title="itemTitle" clear-on-select
                :menu-props="{ maxHeight: 300, maxWidth: 300, theme: mode }" :disabled="disabled"
                :rules="isRequired ? stringRules : []" autocomplete="off">
                <template v-slot:clear v-if="clearable">
                    <v-icon size="16" color="error" @click="emit('clickClear')">mdi-close</v-icon>
                </template>
                <template v-slot:append v-if="appendIcon">
                    <v-btn @click="emit('appendIcon')" color="addButtonColor" icon variant="text">
                        <v-icon :size="24">{{ appendIcon }}</v-icon>
                    </v-btn>
                </template>
                <template v-slot:append-inner v-if="$slots.customSuffix">
                    <slot name="customSuffix"></slot>
                </template>
                <template v-slot:item="{ props, item, index }" v-if="$slots.menuItem">
                    <slot name="menuItem" :item="item.raw" :props="props" :index="index"></slot>
                </template>
                <template v-slot:chip="{ item }" v-if="$slots.chipItem">
                    <slot name="chipItem" :item="item.raw"></slot>
                </template>
                <template v-slot:append-item>
                    <div v-intersect="endIntersect" />
                </template>
            </v-select>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia'
import InputLabel from './InputLabel.vue';
import type { PropType } from 'vue';
import type { Density } from '@/models/types';

const themeStore = useThemeStore();
const formValidationStore = useFormValidationStore();
const { mode } = storeToRefs(themeStore);
const { stringRules } = storeToRefs(formValidationStore);

const emit = defineEmits(['update:modelValue', 'clickClear', 'appendIcon']);

const slots = defineSlots<{
    menuItem(props: { item: any, props: any, index: number }): any
    chipItem(props: { item: any }): any
    customSuffix(): any
}>()

const pageSize = ref(1000);
const pageNumber = ref(1);
const endIntersect = () => {
    pageNumber.value++;
    if (props.getFetchInfiniteScroll) {
        props.getFetchInfiniteScroll({ pageNumber: pageNumber.value, pageSize: pageSize.value });
    }
}

const props = defineProps({
    modelValue: {
        required: true,
        type: null as any,
    },
    label: {
        required: false,
        type: String,
    },
    inputLabel: {
        required: false,
        type: String,
    },
    descriptionText: {
        type: String,
        default: '',
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
    clearable: {
        type: Boolean,
        default: false,
    },
    filterAction: {
        type: Function,
        required: false,
    },
    hideDetails: {
        type: Boolean,
        default: false,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    appendIcon: {
        type: String,
        required: false
    },
    getFetchInfiniteScroll: { // İnfinite scroll denenecek düzgün çalışmıyor.
        type: Function,
        required: false,
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    suffix: {
        type: String,
        default: ''
    },
    hideBorder: {
        type: Boolean,
        default: false
    },
    hideMenuIcon: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
    padding: {
        type: String,
        default: 'pa-4'
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