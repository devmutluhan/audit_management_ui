<template>
    <DialogContent :title="document.documentName + ' ' + $t('menu.create')" :buttons="buttons"
        :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createEmployeeDocForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <FileInput @response="selectedFile = $event[0]" label="form.document"
                            :file-category="FileCategoryEnum.PersonalFile" isRequired>
                        </FileInput>
                    </v-col>
                    <v-col cols="12">
                        <DateInput v-model="commandModel.expirationDate" hide-details />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.isPrivate" label="form.isPrivate" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import FileInput from '@/components/formInput/generalInputs/FileInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { GeneralFileResponse, type ApiResult } from '@/models/ApiResult';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { useRoute } from 'vue-router';
import { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { AddEmployeeDocumentsCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import type { DocumentsDto } from '@/models/entities/humanResource/EmployeeDtos';

const commandModel = ref(new AddEmployeeDocumentsCommand());
const emit = defineEmits(['createItem']);
const selectedFile = ref(new GeneralFileResponse())
const route = useRoute();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    document: {
        type: Object as PropType<DocumentsDto>,
        required: true
    }
});

const createEmployeeDocForm = ref(null as any);
const createEmployeeDocument = () => {
    createEmployeeDocForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.employeeId = route.params.id.toString();
            if (selectedFile.value.fileId) {
                commandModel.value.fileId = selectedFile.value.fileId
            }
            useEmployeeCommandStore().createEmployeeDocument(props.document.definitionId, commandModel.value).then((res: ApiResult<string>) => {
                if (res.data) {
                    emit('createItem');
                    props.dialogClose();
                    commandModel.value = new AddEmployeeDocumentsCommand()
                }
            }).catch((error) => {
                return catchError(error, () => { createEmployeeDocument() })
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
        click: createEmployeeDocument,
        loading: false
    }
])

</script>