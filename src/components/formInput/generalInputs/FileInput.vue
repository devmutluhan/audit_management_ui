<template>
    <v-row>
        <v-col cols="12" align="left">
            <InputLabel :description-text="descriptionText" :description-text-visible="descriptionTextVisible"
                :is-required="isRequired" :label="label" />
            <v-file-input v-model="fileInputRef" color="deep-purple-accent-4" :accept="accept" :multiple="multiple"
                :rules="isRequired ? stringRules : []" :placeholder="$t('form.selectDocument')"
                :prepend-icon="prependIcon" density="comfortable" :hide-details="hideDetails" variant="outlined"
                @change="onChangeFile($event)" :show-size="1000" autocomplete="off">
                <template v-slot:selection="{ fileNames }">
                    <template v-for="(fileName, index) in fileNames" :key="fileName">
                        <v-chip v-if="index < 2" color="deep-purple-accent-4" label size="small" class="me-2">
                            {{ fileName }}
                        </v-chip>

                        <span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
                            +{{ fileList.length - 2 }} File(s)
                        </span>
                    </template>
                </template>
            </v-file-input>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { type PropType, ref } from 'vue';
import { useFormValidationStore } from '@/stores/formValidation';
import { useFileStore } from '@/stores/fileStore';
import { storeToRefs } from 'pinia';
import { catchError } from '@/core/helpers/generalResponse';
import InputLabel from './InputLabel.vue';
import type { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { watch } from 'vue';
import type { GeneralFileResponse } from '@/models/ApiResult';
const { stringRules } = storeToRefs(useFormValidationStore());

const fileList = ref([] as any[]);
const fileInputRef = ref(null as any);

const emit = defineEmits(['response']);
const props = defineProps({
    files: {
        type: Array<string>,
        default: ['']
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
    hideDetails: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    accept: {
        type: String,
        default: 'image/*',
    },
    prependIcon: {
        type: String,
        default: '',
    },
    fileCategory: {
        type: Number as PropType<FileCategoryEnum>,
        required: true
    },
    imageWidth: {
        type: Number,
        default: 420
    },
    imageHeight: {
        type: Number,
        default: 420
    },
    imageQuality: {
        type: Number,
        default: 80
    },
    compress: {
        type: Boolean,
        default: false
    },
    encrypt: {
        type: Boolean,
        default: false
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const onChangeFile = async (event: any) => {
    const files = event.target?.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file: any) => {
        const formData = new FormData();

        formData.append("file", file);
        const queryParams = {
            category: props.fileCategory,
            compress: props.compress,
            encrypt: props.encrypt,
            maxImageWidth: props.imageWidth,
            maxImageHeight: props.imageHeight,
            imageQuality: props.imageQuality,
        };
        formData.append("fileName", file.name);
        formData.append('category', queryParams.category.toString());
        formData.append('compress', queryParams.compress.toString());
        formData.append('encrypt', queryParams.encrypt.toString());
        formData.append('maxImageWidth', queryParams.maxImageWidth.toString());
        formData.append('maxImageHeight', queryParams.maxImageHeight.toString());
        formData.append('imageQuality', queryParams.imageQuality.toString());

        return useFileStore().uploadFiles(formData).then((response: GeneralFileResponse) => {
            fileList.value.push(file);
            emit('response', [response])
        }).catch((error: any) => {
            return catchError(error, () => onChangeFile(event));
        });
    });

    try {
        await Promise.all(uploadPromises);
    } catch (err) {
        console.error("Dosya(lar) yüklenirken hata oluştu:", err);
    }
};

watch(() => props.files, () => {
    if (props.files.length > 0 && props.files[0] != '') {
        fileInputRef.value = {
            name: props.files[0]
        }
    }
})
</script>