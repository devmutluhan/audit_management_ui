<template>
    <DialogContent title="general.updateVacation" :dialogClose="dialogClose" titleIcon="mdi-airplane"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="updateVacationForm">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" sm="8">
                        <VacationTypeSelectInput @selectValue="leaveType = $event; checkLeaveControl()" isRequired
                            :items="employeeLeaveTypeList" :selectItem="selectLeaveType">
                        </VacationTypeSelectInput>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <TextField v-model="usedDays" label="form.usedDays" type="number" readonly />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="12" sm="8" md="4">
                        <DateInput v-model="combineDatesCommand.startDate" isRequired label="form.startDate"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="4" md="2" class="pt-sm-12">
                        <TextField v-model="combineDatesCommand.startTime" isRequired type="time"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="8" md="4">
                        <DateInput v-model="combineDatesCommand.endDate" isRequired label="form.endDate"
                            @update:model-value="checkLeaveControl" />
                    </v-col>
                    <v-col cols="12" sm="4" md="2" class="pt-sm-12">
                        <TextField v-model="combineDatesCommand.endTime" isRequired type="time"
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
                        <EmployeeSelectInput label="form.substitute" @selectValue="replacementEmployee = $event"
                            :selectItems="[replacementEmployee]" :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" />
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
import { CheckLeaveRequestCommand, CombineDatesModel, UpdateLeaveRequestCommand } from '@/models/entities/humanResource/LeaveCommands';
import { catchError } from '@/core/helpers/generalResponse';
import VacationTypeSelectInput from '@/components/formInput/readyInput/VacationTypeSelectInput.vue';
import { combineDateTime, formatterInputDate, getDateTime } from '@/core/helpers/dateUtils';
import { ReplacementEmployeeDto } from '@/models/entities/humanResource/LeaveDtos';
import { LeaveTypeDto } from '@/models/entities/humanResource/LeavePolicyDtos';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const emit = defineEmits(['updated']);
const { employeeLeaveTypeList } = storeToRefs(useLeaveStore());

const updateVacationForm = ref(null as any);
const commandModel = ref(new UpdateLeaveRequestCommand());
const combineDatesCommand = ref(new CombineDatesModel());
const isCheck = ref(false);
const usedDays = ref(null as any);
const replacementEmployee = ref(new ReplacementEmployeeDto());
const leaveType = ref(new LeaveTypeDto());
const selectLeaveType = ref('');

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItemId: {
        type: String,
        required: true
    },
    employeeId: {
        type: null as any,
        required: true
    }
});

onMounted(() => {
    useLeaveStore().getLeaveTypesForEmployee(props.employeeId);
    getLeaveDetail();
})

const getLeaveDetail = () => {
    useLeaveStore().getLeaveDetail(props.selectedItemId).then((res) => {
        selectLeaveType.value = res.leaveType.id;
        combineDatesCommand.value.startDate = formatterInputDate(res.startDate);
        combineDatesCommand.value.endDate = formatterInputDate(res.endDate);
        combineDatesCommand.value.startTime = getDateTime(res.startDate);
        combineDatesCommand.value.endTime = getDateTime(res.endDate);
        replacementEmployee.value = res.replacementEmployee;
        commandModel.value.description = res.description
    }).catch((error) => {
        return catchError(error, () => { getLeaveDetail() })
    })
}

const updateVacation = () => {
    updateVacationForm.value.validate().then((res: any) => {
        if (res.valid && isCheck.value) {
            buttons.value[1].loading = true;
            commandModel.value.startDate = combineDateTime(combineDatesCommand.value.startDate, combineDatesCommand.value.startTime)
            commandModel.value.endDate = combineDateTime(combineDatesCommand.value.endDate, combineDatesCommand.value.endTime)
            commandModel.value.leaveTypeId = leaveType.value.id;
            if (replacementEmployee.value) {
                commandModel.value.replacementEmployeeId = replacementEmployee.value.id;
            }
            useLeaveStore().updateLeaveRequest(props.selectedItemId, commandModel.value).then((res) => {
                props.dialogClose();
                emit('updated', commandModel.value);
            }).catch((error) => {
                return catchError(error, () => { updateVacation() })
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
        click: updateVacation,
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