<template>
    <DialogContent title="general.updateDocumentChild" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateDocumentChildForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.isRequired" label="form.isRequired" />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.hasExpiration" label="form.hasExpiration" />
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
import { DocumentDefinitionDto, UpdateDocumentDefinitionCommand } from '@/models/entities/humanResource/DocumentModels';
import { useDocumentStore } from '@/stores/humanResourcesStores/documentStore';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';

const commandModel = ref(new UpdateDocumentDefinitionCommand());
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<DocumentDefinitionDto>,
        required: true
    }
});

onMounted(() => {
    if (props.selectedItem) {
        commandModel.value.name = props.selectedItem.name
        commandModel.value.isRequired = props.selectedItem.isRequired
        commandModel.value.hasExpiration = props.selectedItem.hasExpiration
    }
})

const updateDocumentChildForm = ref(null as any);
const updateDocumentCategory = () => {
    updateDocumentChildForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useDocumentStore().updateDefinition(props.selectedItem.id, commandModel.value).then((res: any) => {
                props.selectedItem.name = commandModel.value.name
                props.selectedItem.isRequired = commandModel.value.isRequired
                props.selectedItem.hasExpiration = commandModel.value.hasExpiration
                emit('createItem');
                props.dialogClose();
                commandModel.value = new UpdateDocumentDefinitionCommand()
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