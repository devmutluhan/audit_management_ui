<template>
    <v-card border="false" :rounded="rounded" @click="openFileUploader">
        <v-file-input ref="uploader" class="d-none" :multiple="multiple" @change="onChangeFile"
            hide-details></v-file-input>
        <slot name="component"></slot>
    </v-card>
</template>

<script setup lang="ts">
import { catchError } from '@/core/helpers/generalResponse';
import type { GeneralFileResponse } from '@/models/ApiResult';
import type { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { useFileStore } from '@/stores/fileStore';
import { type PropType, ref } from 'vue';

const emit = defineEmits(['fileList']);

const slots = defineSlots<{
    component(props: any): any
}>();

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false,
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
        default: 90
    },
    compress: {
        type: Boolean,
        default: false
    },
    encrypt: {
        type: Boolean,
        default: false
    },
    rounded: {
        type: String,
        default: 'lg',
        required: false
    }
});
const uploader = ref(null as any)

const openFileUploader = () => {
    uploader.value.click()
}

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
            emit('fileList', [response])
        }).catch((error: any) => {
            return catchError(error, () => onChangeFile(event));
        })
    });

    try {
        await Promise.all(uploadPromises);
    } catch (err) {
        console.error("Dosya(lar) yüklenirken hata oluştu:", err);
    }
};


</script>