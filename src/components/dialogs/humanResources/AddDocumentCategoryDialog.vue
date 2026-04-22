<template>
    <DialogContent title="general.addDocumentCategory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createDocumentCategoryForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" isRequired />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import type { ApiResult } from '@/models/ApiResult';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { CreateDocumentCategoryCommand } from '@/models/entities/humanResource/DocumentModels';
import { useDocumentStore } from '@/stores/humanResourcesStores/documentStore';

const commandModel = ref(new CreateDocumentCategoryCommand());
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createDocumentCategoryForm = ref(null as any);
const createDocumentCategory = () => {
    createDocumentCategoryForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useDocumentStore().createCategory(commandModel.value).then((res: ApiResult<string>) => {
                if (res.data) {
                    emit('createItem', {
                        id: res.data,
                        name: commandModel.value.name,
                        description: commandModel.value.description,
                        isActive: true
                    });
                    props.dialogClose();
                    commandModel.value = new CreateDocumentCategoryCommand()
                }
            }).catch((error) => {
                return catchError(error, () => { createDocumentCategory() })
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createDocumentCategory,
        loading: false
    }
])

</script>