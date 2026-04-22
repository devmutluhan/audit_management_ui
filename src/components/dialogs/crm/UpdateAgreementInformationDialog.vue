<template>
    <DialogContent title="general.updateAgreementInfo" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateAgreementForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.title" label="form.title" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <DateInput v-model="commandModel.startDate" label="form.startDate" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <DateInput v-model="commandModel.endDate" label="form.endDate" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.expenseLimit" label="form.expenseLimit" isRequired isNumber />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <FileInput @response="selectedFile = $event[0]" :files="[selectedFile.url ?? '']"
                            :file-category="FileCategoryEnum.Contract" label="form.document" isNumber isRequired>
                        </FileInput>
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { FileCategoryEnum } from '@/models/custom/EnumTypes';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import FileInput from '@/components/formInput/generalInputs/FileInput.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { ref, nextTick, onMounted, type PropType } from 'vue';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import type { AgreementDetailDto } from '@/models/entities/crm/CrmAgreementDtos';
import { UpdateAgreementInfoCommand } from '@/models/entities/crm/CrmAgreementCommands';
import { useAgreementStore } from '@/stores/crmStores/agreementStore';
import { GeneralFileResponse } from '@/models/ApiResult';

const route = useRoute();
const commandModel = ref(new UpdateAgreementInfoCommand())
const selectedFile = ref(new GeneralFileResponse())
const updateAgreementForm = ref(null as any)

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<AgreementDetailDto>,
        required: true
    },
});

onMounted(() => {
    nextTick(() => {
        commandModel.value.title = props.selectedItem.title;
        commandModel.value.expenseLimit = props.selectedItem.expenseLimit;
        // todo: fileUrl burada hata var
        // commandModel.value.agreementDocumentFileId = props.selectedItem.agreementDocumentUrl;
        commandModel.value.description = props.selectedItem.description;
        commandModel.value.endDate = props.selectedItem.endDate;
        commandModel.value.startDate = props.selectedItem.startDate;
    })
})

const updateAgreement = () => {
    updateAgreementForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            // todo: fileUrl düzeltilince aşağıdaki kalkacak
            commandModel.value.agreementDocumentFileId = selectedFile.value.fileId
            useAgreementStore().updateAgreement(commandModel.value, route.params.id.toString()).then((response: any) => {
                props.dialogClose();
                props.selectedItem.title = commandModel.value.title;
                props.selectedItem.expenseLimit = commandModel.value.expenseLimit ?? 0;
                props.selectedItem.agreementDocumentUrl = selectedFile.value.url;
                props.selectedItem.description = commandModel.value.description;
                props.selectedItem.endDate = commandModel.value.endDate;
                props.selectedItem.startDate = commandModel.value.startDate;
            }).catch((error) => {
                return catchError(error, () => updateAgreement())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
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
        click: () => { updateAgreement() },
        loading: false
    }
]);

</script>