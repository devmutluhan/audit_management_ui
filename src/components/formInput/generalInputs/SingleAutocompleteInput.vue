<template>
    <v-row>
        <v-col cols="12">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-autocomplete ref="autocompleteRef" v-model="modelValue" :loading="loading" :density="density"
                :placeholder="placeholder ? $t(placeholder) : ''" :items="items" hide-no-data
                :return-object="isReturnObject" :no-data-text="$t('general.noDataFound')" :hideDetails="hideDetails"
                :item-value="!isReturnObject ? itemValue : ''" :item-title="itemTitle" :clearable="clearable"
                :disabled="disabled" clear-on-select @click:clear="emit('clickClear')"
                :menu-props="{ maxHeight: 300, maxWidth: 300, theme: mode }" :rules="isRequired ? stringRules : []"
                autocomplete="off">
                <template v-slot:append v-if="appendIcon">
                    <v-btn @click="emit('appendIcon')" color="addButtonColor" icon variant="text">
                        <v-icon :size="24">{{ appendIcon }}</v-icon>
                    </v-btn>
                </template>
                <template v-slot:item="{ props, item, index }" v-if="$slots.menuItem">
                    <slot name="menuItem" :item="item.raw" :props="props" :index="index" :closeMenu="closeMenu">
                    </slot>
                </template>
                <template v-slot:chip="{ item }" v-if="$slots.chipItem">
                    <slot name="chipItem" :item="item.raw"></slot>
                </template>
                <template v-slot:append-item>
                    <div v-intersect="endIntersect" />
                </template>
            </v-autocomplete>
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
const autocompleteRef = ref(null as any);

const slots = defineSlots<{
    menuItem(props: { item: any, props: any, index: number, closeMenu: any }): any
    chipItem(props: { item: any }): any
}>()

const pageSize = ref(1000);
const pageNumber = ref(1);

const closeMenu = () => {
    if (autocompleteRef.value) {
        autocompleteRef.value.menu = false;
    }
};
const endIntersect = () => {
    pageNumber.value++;
    if (props.getFetchInfiniteScroll) {
        props.getFetchInfiniteScroll({ pageNumber: pageNumber.value, pageSize: pageSize.value });
    }
}

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
    getFetchInfiniteScroll: { // İnfinite scroll denenecek düzgün çalışmıyor.
        type: Function,
        required: false,
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