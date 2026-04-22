<template>
    <DialogContent title="general.convertToProject" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="convertToProjectForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.title" label="form.title" isRequired>
                        </TextField>
                    </v-col>
                    <v-col cols="12" md="6">
                        <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" label="form.manager"
                            justId @selectValue="commandModel.managerId = $event" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" label="form.partner"
                            justId @selectValue="commandModel.partnerId = $event" isRequired />
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
import { ref, type PropType } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { useRouter } from 'vue-router';
import type { AgreementDetailDto } from '@/models/entities/crm/CrmAgreementDtos';
import { ConvertToProjectCommand } from '@/models/entities/crm/CrmProjectCommands';
import { useProjectStore } from '@/stores/crmStores/projectStore';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new ConvertToProjectCommand());
const emit = defineEmits(['createItem']);
const convertToProjectForm = ref(null as any);
const router = useRouter()
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedAgreement: {
        type: Object as PropType<AgreementDetailDto>,
        required: true
    }
});

const convertToProject = () => {
    convertToProjectForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.agreementId = props.selectedAgreement.id;
            useProjectStore().convertToProject(commandModel.value).then((response: any) => {
                router.push({ name: 'project-detail', params: { id: response.data } });
            }).catch((error) => {
                return catchError(error, () => convertToProject())
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
        click: convertToProject,
        loading: false
    }
])

</script>