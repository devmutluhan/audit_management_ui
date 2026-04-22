<template>
    <DialogContent title="general.addDepartment" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createDepartmentForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.leaveApprovelProcessCard" item-title="name" item-value="id"
                            :items="approvalProcessList" v-model="commandModel.leaveApprovalProcessId" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.expenseApprovalProcessCard" item-title="name" item-value="id"
                            :items="approvalProcessList" v-model="commandModel.expenseApprovalProcessId" />
                    </v-col>
                    <v-col cols="12">
                        <SingleSelectInput label="form.advanceApprovalProcessCard" item-title="name" item-value="id"
                            :items="approvalProcessList" v-model="commandModel.advanceApprovalProcessId" />
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
import { CreateOrUpdateDepartmentCommand } from '@/models/entities/management/ManagementCommands';
import { useManagementCommandStore } from '@/stores/managementStores/managementCommandStore';
import type { ApiResult } from '@/models/ApiResult';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { storeToRefs } from 'pinia';
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';

const commandModel = ref(new CreateOrUpdateDepartmentCommand())
const emit = defineEmits(['createItem']);

const { approvalProcessList } = storeToRefs(useApprovalProcessStore())
const { departmentList } = storeToRefs(useManagementDtoStore())
useApprovalProcessStore().getProcessList();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createDepartmentForm = ref(null as any);
const createDepartment = () => {
    createDepartmentForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useManagementCommandStore().createDepartment(commandModel.value).then((res: ApiResult<string>) => {
                if (res.data) {
                    departmentList.value.unshift({
                        id: res.data,
                        name: commandModel.value.name,
                        leaveApprovalProcessId: commandModel.value.leaveApprovalProcessId,
                        expenseApprovalProcessId: commandModel.value.expenseApprovalProcessId,
                        advanceApprovalProcessId: commandModel.value.advanceApprovalProcessId
                    })
                    emit('createItem');
                    props.dialogClose();
                    commandModel.value = new CreateOrUpdateDepartmentCommand()
                }
            }).catch((error) => {
                return catchError(error, () => { createDepartment() })
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
        click: createDepartment,
        loading: false
    }
])

</script>