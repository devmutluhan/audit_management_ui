<template>
    <DialogContent title="general.updateCompanyBranch" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateCompanyBranchForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.leaveApprovelProcessCard" :items="approvalProcessList"
                            item-title="name" item-value="id" v-model="commandModel.leaveApprovalProcessId" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleSelectInput label="form.expenseApprovalProcessCard" :items="approvalProcessList"
                            item-title="name" item-value="id" v-model="commandModel.expenseApprovalProcessId" />
                    </v-col>
                    <v-col cols="12">
                        <SingleSelectInput label="form.advanceApprovalProcessCard" item-title="name" item-value="id"
                            :items="approvalProcessList" v-model="commandModel.advanceApprovalProcessId" />
                    </v-col>
                    <v-col cols="12">
                        <v-row class="d-flex align-center">
                            <v-col cols="12" md="6">
                                <v-row>
                                    <v-col cols="12">
                                        <SingleSelectInput label="form.offerApprovalProcessCard"
                                            :items="approvalProcessList" item-title="name" item-value="id"
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
                                <v-row v-if="isActiveRisk">
                                    <v-col cols="12" class="pb-0">
                                        <EmployeeSelectInput @selectValue="selectedRiskEmployees.lowApprover = $event"
                                            :selectItems="[props.selectedItem.riskApprovalProcess?.lowApprover]"
                                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" hide-details
                                            label="enums.Low"></EmployeeSelectInput>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <EmployeeSelectInput isRequired
                                            @selectValue="selectedRiskEmployees.midApprover = $event"
                                            :selectItems="[props.selectedItem.riskApprovalProcess?.midApprover]"
                                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" hide-details
                                            label="enums.Mid"></EmployeeSelectInput>
                                    </v-col>
                                    <v-col cols="12" class="pb-8">
                                        <EmployeeSelectInput isRequired
                                            @selectValue="selectedRiskEmployees.highApprover = $event"
                                            :selectItems="[props.selectedItem.riskApprovalProcess?.highApprover]"
                                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" hide-details
                                            label="enums.High"></EmployeeSelectInput>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { CompanyBranchDto, RiskApprovalProcessCommand, CreateOrUpdateCompanyBranchCommand, RiskApprovalProcessDto } from '@/models/entities/management/ManagementCommands';
import { useManagementCommandStore } from '@/stores/managementStores/managementCommandStore';
import type { ApiResult } from '@/models/ApiResult';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import { storeToRefs } from 'pinia';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const selectedRiskEmployees = ref(new RiskApprovalProcessDto())
const commandModel = ref(new CreateOrUpdateCompanyBranchCommand())
const emit = defineEmits(['createItem']);
const isActiveRisk = ref(false);
const { approvalProcessList } = storeToRefs(useApprovalProcessStore())
const { companyBranchList } = storeToRefs(useManagementDtoStore())
useApprovalProcessStore().getProcessList();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<CompanyBranchDto>,
        required: true
    }
});

const updateCompanyBranchForm = ref(null as any);

onMounted(() => {
    commandModel.value.expenseApprovalProcessId = props.selectedItem.expenseApprovalProcessId;
    commandModel.value.leaveApprovalProcessId = props.selectedItem.leaveApprovalProcessId;
    commandModel.value.offerApprovalProcessId = props.selectedItem.offerApprovalProcessId;
    commandModel.value.advanceApprovalProcessId = props.selectedItem.advanceApprovalProcessId;
    if (props.selectedItem.riskApprovalProcess) {
        isActiveRisk.value = true;
        selectedRiskEmployees.value.lowApprover = JSON.parse(JSON.stringify(props.selectedItem.riskApprovalProcess.lowApprover))
        selectedRiskEmployees.value.midApprover = JSON.parse(JSON.stringify(props.selectedItem.riskApprovalProcess.midApprover))
        selectedRiskEmployees.value.highApprover = JSON.parse(JSON.stringify(props.selectedItem.riskApprovalProcess.highApprover))
    }
    commandModel.value.name = props.selectedItem.name;
})

const updateCompanyBranch = () => {
    updateCompanyBranchForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (isActiveRisk.value) {
                commandModel.value.riskApprovalProcess = {
                    lowApproverId: selectedRiskEmployees.value.lowApprover.id ?? null,
                    midApproverId: selectedRiskEmployees.value.midApprover.id,
                    highApproverId: selectedRiskEmployees.value.highApprover.id
                }
            }

            useManagementCommandStore().updateCompanyBranch(props.selectedItem.id, commandModel.value).then((res: ApiResult<string>) => {
                const index = companyBranchList.value.findIndex((x: any) => x.id == props.selectedItem.id);
                if (index != -1) {
                    companyBranchList.value[index] = {
                        id: props.selectedItem.id,
                        name: commandModel.value.name,
                        leaveApprovalProcessId: commandModel.value.leaveApprovalProcessId,
                        expenseApprovalProcessId: commandModel.value.expenseApprovalProcessId,
                        offerApprovalProcessId: commandModel.value.offerApprovalProcessId,
                        advanceApprovalProcessId: commandModel.value.advanceApprovalProcessId,
                        riskApprovalProcess: commandModel.value.riskApprovalProcess ? {
                            lowApprover: selectedRiskEmployees.value.lowApprover,
                            midApprover: selectedRiskEmployees.value.midApprover,
                            highApprover: selectedRiskEmployees.value.highApprover
                        } : null
                    }
                }
                props.dialogClose();
                commandModel.value = new CreateOrUpdateCompanyBranchCommand()
            }).catch((error) => {
                return catchError(error, () => { updateCompanyBranch() })
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
        click: updateCompanyBranch,
        loading: false
    }
])

</script>