<template>
    <DialogContent title="general.addVacation" :dialogClose="dialogClose" titleIcon="mdi-airplane" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addVacationForm">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="9" sm="8">
                        <VacationTypeSelectInput @selectValue="leaveType = $event; checkLeaveControl()" isRequired
                            :items="employeeLeaveTypeList">
                        </VacationTypeSelectInput>
                    </v-col>
                    <v-col cols="3" sm="4">
                        <TextField v-model="usedDays" label="form.usedDays" type="number" disabled />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" sm="8" md="4">
                        <DateInput v-model="combineDatesCommand.startDate" isRequired label="form.startDate"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="4" md="2" class="pt-sm-12">
                        <TextField :label="isMobileDevice() ? $t('form.startTime') : ''"
                            v-model="combineDatesCommand.startTime" isRequired type="time"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="8" md="4">
                        <DateInput v-model="combineDatesCommand.endDate" isRequired label="form.endDate"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="4" md="2" class="pt-sm-12">
                        <TextField :label="isMobileDevice() ? $t('form.endTime') : ''"
                            v-model="combineDatesCommand.endTime" isRequired type="time"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12">
                        <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                            label="form.substitute" @selectValue="replacementEmployee = $event" />
                    </v-col>
                    <!-- <v-col cols="12" sm="8" md="4">
                        <DateInput v-model="combineDatesCommand.returnDate" label="form.returnDate"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="4" md="2" class="pt-sm-12">
                        <TextField v-model="combineDatesCommand.returnTime" type="time"
                            @update:model-value="checkLeaveControl" />
                    </v-col> -->
                </v-row>
                <v-row>
                    <!-- <v-col cols="12">
                        <SwitchInput v-model="commandModel.sendNotification" :disabled="!replacementEmployee.id"
                            label="form.sendNotificationToReplacement"  />
                    </v-col> -->
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.skipApprovementProcess" label="form.skipApprovalProcess" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { useLeaveStore } from '@/stores/humanResourcesStores/leaveStore';
import { storeToRefs } from 'pinia';
import { CheckLeaveRequestCommand, CombineDatesModel, CreateLeaveRequestCommand } from '@/models/entities/humanResource/LeaveCommands';
import { catchError } from '@/core/helpers/generalResponse';
import VacationTypeSelectInput from '@/components/formInput/readyInput/VacationTypeSelectInput.vue';
import { combineDateTime } from '@/core/helpers/dateUtils';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';
import { ReplacementEmployeeDto } from '@/models/entities/humanResource/LeaveDtos';
import { LeaveTypeDto } from '@/models/entities/humanResource/LeavePolicyDtos';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { isMobileDevice } from '@/assets/ts/_utils';

const { employeeLeaveTypeList, employeeLeaveList } = storeToRefs(useLeaveStore());
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const emit = defineEmits(['createdItem']);

const addVacationForm = ref(null as any);
const commandModel = ref(new CreateLeaveRequestCommand());
const combineDatesCommand = ref(new CombineDatesModel());
const isCheck = ref(false);
const usedDays = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    employeeId: {
        required: true,
        type: null as any
    }
});
commandModel.value.employeeId = props.employeeId;
const replacementEmployee = ref(new ReplacementEmployeeDto());
const leaveType = ref(new LeaveTypeDto());

useLeaveStore().getLeaveTypesForEmployee(props.employeeId);
onMounted(() => {
    combineDatesCommand.value.startTime = '00:00:00'
    combineDatesCommand.value.endTime = '23:59:00'
})
const addVacation = () => {
    addVacationForm.value.validate().then((res: any) => {
        if (res.valid && isCheck.value) {
            buttons.value[1].loading = true;
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)
            commandModel.value.leaveTypeId = leaveType.value.id;
            if (replacementEmployee.value) {
                commandModel.value.replacementEmployeeId = replacementEmployee.value.id;
            }
            commandModel.value.replacementEmployeeId = commandModel.value.replacementEmployeeId == '' ? null : commandModel.value.replacementEmployeeId;
            useLeaveStore().createLeaveRequest(commandModel.value).then((response) => {
                props.dialogClose();
                emit('createdItem', {
                    id: response.data.id,
                    employeeId: props.employeeId,
                    startDate: commandModel.value.startDate,
                    endDate: commandModel.value.endDate,
                    returnDate: "",
                    createdAt: new Date().toString(),
                    updatedAt: "-",
                    status: response.data.status,
                    cancellationReason: "",
                    replacementEmployeeId: replacementEmployee.value.id,
                    replacementEmployee: replacementEmployee.value,
                    employee: {
                        id: employeeDetail.value.id,
                        firstName: employeeDetail.value.firstName,
                        lastName: employeeDetail.value.lastName,
                        fullName: employeeDetail.value.fullName,
                        positionName: employeeDetail.value.currentExperience?.position,
                        avatarUrl: employeeDetail.value.avatarUrl,
                        workEmail: employeeDetail.value.workEmail
                    },
                    leaveType: leaveType.value,
                    usedDays: usedDays.value
                });
            }).catch((error) => {
                return catchError(error, () => { addVacation() })
            }).finally(() => {
                buttons.value[1].loading = false
            })
        }
    });
}

const buttons = ref([
    {
        click: props.dialogClose,
        type: 'close',
    },
    {
        type: 'save',
        click: addVacation,
        loading: false
    }
])

const checkLeaveControl = () => {
    if (combineDatesCommand.value.startDate && combineDatesCommand.value.endDate && combineDatesCommand.value.startTime && combineDatesCommand.value.endTime && leaveType.value.id) {
        const checkCommand = {
            employeeId: props.employeeId,
            leaveTypeId: leaveType.value.id,
            startDate: combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime),
            endDate: combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime),
            description: commandModel.value.description,
            replacementEmployeeId: commandModel.value.replacementEmployeeId ?? null,
        } as CheckLeaveRequestCommand

        useLeaveStore().checkLeave(checkCommand).then((res) => {
            usedDays.value = res.data.preview.usedDays;
            isCheck.value = true
        }).catch((error) => {
            return catchError(error, () => { checkLeaveControl() })
        })
    }
}


</script>