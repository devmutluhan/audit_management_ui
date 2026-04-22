<template>
    <v-dialog v-model="modelValue" width="600">
        <v-card color="cardColor" rounded="xl">
            <v-card-text>
                <v-form ref="confirmDialogForm">
                    <v-row>
                        <v-col cols="12" align="center">
                            <v-icon size="100" color="alertIconColor">
                                {{ modal.icon ? modal.icon : 'mdi-alert-circle-outline' }}
                            </v-icon>
                        </v-col>
                        <v-col cols="12" align="center" class="text-h4 font-weight-bold">
                            {{ modal.title ? $t(modal.title) : $t('general.areYouSure') }}
                        </v-col>
                        <v-col cols="12" align="center" class="text-body">
                            {{ modal.text ? $t(modal.text) : $t('general.cannotBeUndone') }}
                        </v-col>
                        <v-col cols="12" align="center" class="text-body" v-if="modal.isDescriptionField">
                            <TextArea v-model="modal.descriptionField" isRequired label="form.description">
                            </TextArea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-toolbar color="transparent" class="pt-4 pb-4">
                <v-row class="d-flex justify-center">
                    <v-col cols="auto">
                        <v-btn size="large" @click="clickSubmit" color="confirmButtonColor"
                            :loading="modal.buttonLoading" variant="outlined">
                            {{ modal.confirmButtonText ? $t(modal.confirmButtonText) : $t('general.sure') }}
                        </v-btn>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn size="large" @click="modelValue = false" color="cancelButtonColor" variant="outlined">
                            {{ modal.cancelButtonText ? $t(modal.cancelButtonText) : $t('general.cancel') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-toolbar>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { ConfirmModalType } from "@/models/types";
import TextArea from "../formInput/generalInputs/TextArea.vue";

const emit = defineEmits(['update:modelValue']);
const confirmDialogForm = ref(null as any);

const clickSubmit = () => {
    confirmDialogForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (props.modal.action) {
                props.modal.action(props.data)
            }
        }
    })
}

const props = defineProps({
    modelValue: {
        required: true,
        type: Boolean,
    },
    modal: {
        required: true,
        type: Object as () => ConfirmModalType,
    },
    data: {
        required: false,
        type: Object as any,
        default: null,
    },
});

watch(() => props.modal.buttonLoading, (newValue, oldValue) => {
    if (oldValue && newValue === false) {
        emit('update:modelValue', newValue);
    }
});

const modelValue = computed({
    get() {
        return props.modelValue ?? false
    },
    set(newValue: Boolean | null) {
        props.modal.descriptionField = '';
        emit('update:modelValue', newValue);
    }
});
</script>