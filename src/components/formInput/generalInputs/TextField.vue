<template>
    <v-row>
        <v-col cols="12" align="left" :class="padding">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-text-field @input="inputMask" v-model="modelValue" :rules="defaultRules" :hide-details="hideDetails"
                :inputmode="isNumber ? 'decimal' : isPhoneNumber ? 'numeric' : isPrice ? 'numeric' : ''"
                :label="placeLabel ? $t(placeLabel) : ''" :readonly="readonly" :maxLength="maxLength" :type="inputType"
                :density="density" :clearable="clearable" :disabled="disabled"
                :base-color="hideBorder ? 'transparent' : ''" :color="hideBorder ? '#00ACC1' : ''"
                :append-inner-icon="type == 'password' ? appendInnerIcon : ''" @click:appendInner="passwordTypeClick"
                :placeholder="placeholder ? $t(placeholder) : ''" :suffix="suffix" autocomplete="off">
                <template v-slot:append-inner v-if="$slots.customSuffix">
                    <slot name="customSuffix"></slot>
                </template>
                <template v-slot:clear v-if="clearable">
                    <v-icon size="16" color="error" @click="emit('clickClear')">mdi-close</v-icon>
                </template>
            </v-text-field>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import InputLabel from './InputLabel.vue';
import { computed, ref } from 'vue';
import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia';
const { numberRules, stringRules, emailRules, phoneNumberRules, passwordRules } = storeToRefs(useFormValidationStore());
import type { PropType } from 'vue';
import type { Density } from '@/models/types';

const slots = defineSlots<{
    customSuffix(): any
}>()

const appendInnerIcon = ref('mdi-eye-outline');
const defaultRules = computed(() => {
    if (props.isRequired) {
        if (props.isNumber) {
            if (props.max) {
                const result = useFormValidationStore().numberRulesForMaxLimit(props.max)
                return result.value
            } else if (props.min) {
                const result = useFormValidationStore().numberRulesForMinLimit(props.min)
                return result.value;
            } else {
                return numberRules.value;
            }
        } else if (props.isPhoneNumber) {
            return stringRules.value
        } else if (props.isEmail) {
            return emailRules.value;
        }
        return stringRules.value;
    } else {
        return [];
    }
});

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
    placeLabel: {
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
    type: {
        type: String,
        default: 'text',
    },
    isNumber: {
        type: Boolean,
        default: false,
    },
    isPhoneNumber: {
        type: Boolean,
        default: false,
    },
    isEmail: {
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
    isPrice: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    suffix: {
        type: String,
        default: ""
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    hideBorder: {
        type: Boolean,
        default: false
    },
    readonly: {
        type: Boolean,
        default: false
    },
    padding: {
        type: String,
        default: 'pa-3'
    },
    placeholder: {
        type: String,
        required: false,
        default: ''
    },
    max: {
        type: Number,
        default: null
    },
    min: {
        type: Number,
        default: null
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});
const inputType = ref(props.type)
const modelValue = computed({
    get() {
        return props.modelValue ?? [];
    },
    set(newValue: Array<any> | null) {
        emit('update:modelValue', newValue);
    }
});

const inputMask = (e: any) => {
    if (props.isPhoneNumber) {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{3})(\d)/, '$1 $2');
        value = value.replace(/(\d{3}) (\d{3})(\d)/, '$1 $2 $3');
        value = value.replace(/(\d{3}) (\d{3}) (\d{2})(\d)/, '$1 $2 $3 $4');
        e.target.value = value;
        return e;
    }

    if (props.isPrice) {
        // Todo: isPrice rules
    }

    if (props.isNumber) {
        e.target.value = e.target.value.replace(/[^\d.]/g, '');
        e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
    }

    if (props.isEmail) {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9@.]/g, '');
    }
}

const passwordTypeClick = () => {
    if (inputType.value == 'text') {
        inputType.value = 'password'
        appendInnerIcon.value = 'mdi-eye-outline'
    } else {
        inputType.value = 'text'
        appendInnerIcon.value = 'mdi-eye-off-outline'
    }
}
</script>
