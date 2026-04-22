<template>
    <DialogContent title="general.updateDocumentCategory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateDocumentCategoryForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.isActive" label="form.isEnabled" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { DocumentCategoryDto, UpdateDocumentCategoryCommand } from '@/models/entities/humanResource/DocumentModels';
import { useDocumentStore } from '@/stores/humanResourcesStores/documentStore';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';

const commandModel = ref(new UpdateDocumentCategoryCommand());
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<DocumentCategoryDto>,
        required: true
    }
});

onMounted(() => {
    if (props.selectedItem) {
        commandModel.value.name = props.selectedItem.name
        commandModel.value.description = props.selectedItem.description
        commandModel.value.isActive = props.selectedItem.isActive
    }
})

const updateDocumentCategoryForm = ref(null as any);
const updateDocumentCategory = () => {
    updateDocumentCategoryForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useDocumentStore().updateCategory(props.selectedItem.id, commandModel.value).then((res: any) => {
                props.selectedItem.name = commandModel.value.name
                props.selectedItem.description = commandModel.value.description
                props.selectedItem.isActive = commandModel.value.isActive
                emit('createItem');
                props.dialogClose();
                commandModel.value = new UpdateDocumentCategoryCommand()
            }).catch((error) => {
                return catchError(error, () => { updateDocumentCategory() })
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
        click: updateDocumentCategory,
        loading: false
    }
])

</script>