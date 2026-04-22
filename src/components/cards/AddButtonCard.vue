<template>
    <v-row>
        <v-text-field class="d-none" id="textInputNone" v-model="modelValue" :rules="isRequired ? arrayRules : []">
        </v-text-field>
        <v-col cols="12" class="py-1" v-if="component">
            <VDialogContent>
                <template v-slot:activator="{ props: activatorProps }">
                    <v-card v-bind="activatorProps" color="cardToolbar"
                        :style="validate ? { border: '1px solid rgb(var(--v-theme-error))' } : {}">
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col class="text-body-1">
                                    {{ $t(title) }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto">
                                    <v-icon size="20">{{ appendIcon }}</v-icon>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </template>
                <template v-slot:default="{ isActive }">
                    <component :is="component" :dialogClose="() => { isActive.value = false }" @addItem="addItemFunc" />
                </template>
            </VDialogContent>
        </v-col>
        <v-col cols="12" class="py-1" v-else>
            <v-card @click="addItemFunc" link color="cardToolbar" :disabled="disabled"
                :style="validate ? { border: '1px solid rgb(var(--v-theme-error))' } : {}">
                <v-card-text>
                    <v-row class="d-flex align-center">
                        <v-col class="text-body-1">
                            {{ $t(title) }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                            <v-icon size="20">{{ appendIcon }}</v-icon>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="py-1">
            <p class="ma-0 pa-0 ml-4" v-if="validate" style="color: rgb(var(--v-theme-error));">
                {{ $t('general.required') }}
            </p>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed, ref } from 'vue';
import VDialogContent from '../dialogs/VDialogContent.vue';

const { arrayRules } = storeToRefs(useFormValidationStore());
const validate = ref(false);
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        type: Array as any,
        required: true
    },
    component: {
        type: Object as any,
        required: false
    },
    title: {
        type: String,
        default: ''
    },
    appendIcon: {
        type: String,
        default: 'mdi-plus'
    },
    isRequired: {
        type: Boolean,
        default: true
    },
    validationRef: {
        type: Object as any,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    },
    addItemFunc: {
        type: Function as any,
        default: () => { },
        required: true
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

const validationRefComputed = computed(() => {
    return props.validationRef;
});

watch(() => validationRefComputed.value?.errors, () => {
    if (!props.isRequired) return;
    if (validationRefComputed.value.errors.some((x: any) => x.id == 'textInputNone')) {
        validate.value = true;
    } else {
        validate.value = false;
    }
}, { deep: true });
</script>