<template>
    <DialogContent title="general.addCompanyBranch" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createCompanyBranchForm">
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
                    <v-col cols="12" md="6">
                        <v-row>
                            <v-col cols="12">
                                <SingleSelectInput label="form.offerApprovalProcessCard" item-title="name"
                                    item-value="id" :items="approvalProcessList"
                                    v-model="commandModel.offerApprovalProcessId" />
                            </v-col>
                            <v-col cols="12">
                                <v-btn color="rejectButtonColor"
                                    @click="isActiveRisk = false; commandModel.riskApprovalProcess = null"
                                    v-if="isActiveRisk">
                                    {{ $t('form.cancelRiskProcess') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn
                            @click="isActiveRisk = true; commandModel.riskApprovalProcess = new RiskApprovalProcessCommand()"
                            v-if="!isActiveRisk"> {{ $t('form.riskProcess') }}
                        </v-btn>
                        <v-row v-if="isActiveRisk && commandModel.riskApprovalProcess">
                            <v-col cols="12" class="pb-0">
                                <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                                    @selectValue="selectedRiskEmployees.lowApprover = $event" hide-details
                                    label="enums.Low"></EmployeeSelectInput>
                            </v-col>
                            <v-col cols="12" class="pb-0">
                                <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" isRequired
                                    @selectValue="selectedRiskEmployees.midApprover = $event" hide-details
                                    label="enums.Mid"></EmployeeSelectInput>
                            </v-col>
                            <v-col cols="12" class="pb-8">
                                <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" isRequired
                                    @selectValue="selectedRiskEmployees.highApprover = $event" hide-details
                                    label="enums.High"></EmployeeSelectInput>
                            </v-col>
                        </v-row>
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
import { CreateOrUpdateCompanyBranchCommand, RiskApprovalProcessCommand, RiskApprovalProcessDto } from '@/models/entities/management/ManagementCommands';
import { useManagementCommandStore } from '@/stores/managementStores/managementCommandStore';
import type { ApiResult } from '@/models/ApiResult';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { storeToRefs } from 'pinia';
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new CreateOrUpdateCompanyBranchCommand())
const selectedRiskEmployees = ref(new RiskApprovalProcessDto())
const emit = defineEmits(['createItem']);
const isActiveRisk = ref(false);
const { approvalProcessList } = storeToRefs(useApprovalProcessStore())
const { companyBranchList } = storeToRefs(useManagementDtoStore())
useApprovalProcessStore().getProcessList();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createCompanyBranchForm = ref(null as any);
const createCompanyBranch = () => {
    createCompanyBranchForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (isActiveRisk.value) {
                commandModel.value.riskApprovalProcess = {
                    lowApproverId: selectedRiskEmployees.value.lowApprover.id ?? null,
                    midApproverId: selectedRiskEmployees.value.midApprover.id,
                    highApproverId: selectedRiskEmployees.value.highApprover.id
                }
            }
            useManagementCommandStore().createCompanyBranch(commandModel.value).then((res: ApiResult<string>) => {
                if (res.data) {
                    companyBranchList.value.unshift({
                        id: res.data,
                        name: commandModel.value.name,
                        leaveApprovalProcessId: commandModel.value.leaveApprovalProcessId,
                        expenseApprovalProcessId: commandModel.value.expenseApprovalProcessId,
                        advanceApprovalProcessId: commandModel.value.advanceApprovalProcessId,
                        offerApprovalProcessId: commandModel.value.offerApprovalProcessId,
                        riskApprovalProcess: commandModel.value.riskApprovalProcess ? {
                            lowApprover: selectedRiskEmployees.value.lowApprover,
                            midApprover: selectedRiskEmployees.value.midApprover,
                            highApprover: selectedRiskEmployees.value.highApprover
                        } : null
                    })
                    emit('createItem');
                    props.dialogClose();
                    commandModel.value = new CreateOrUpdateCompanyBranchCommand()
                }
            }).catch((error) => {
                return catchError(error, () => { createCompanyBranch() })
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
        click: createCompanyBranch,
        loading: false
    }
])

</script>