<template>
    <DialogContent title="general.updateApprovalProcesses" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateApprovalProcessesRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="9">
                        <TextField v-model="approvalProcessesCommand.name" isRequired label="form.title" />
                    </v-col>
                    <v-col cols="12" sm="3">
                        <SwitchInput v-model="approvalProcessesCommand.isPrivate" label="form.isPrivate" hide-details
                            descriptionText="statusCode.isPrivateForApprovalProcess" />
                    </v-col>
                    <v-col cols="12" v-for="(item, index) in approvalProcessesCommand.steps" :key='index'>
                        <v-row class="d-flex align-center">
                            <v-col cols="12" sm="8" md="9">
                                <EmployeeSelectInput :employeeStatusFilter="EmployeeStatusTypeEnum.Valid"
                                    @selectValue="item.approverEmployee = $event"
                                    :selectItems="[item.approverEmployee]">
                                </EmployeeSelectInput>
                            </v-col>
                            <v-col cols="8" sm="2" md="2">
                                <TextField v-model="item.order" label="form.order" isNumber />
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <v-btn variant="text" color="error" icon="mdi-delete" size="30"
                                    @click="deleteStep(index)"></v-btn>
                            </v-col>
                        </v-row>
                        <v-row class="d-flex justify-center" v-if="index != approvalProcessesCommand.steps.length - 1">
                            <v-icon color="success">mdi-chevron-double-down</v-icon>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <AddButtonCard v-model="approvalProcessesCommand.steps" title="form.addStep"
                            :validationRef="updateApprovalProcessesRef" :addItemFunc="addStepFunction" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { ApprovalProcessStepDto, UpdateApprovalProcessCommand } from '@/models/entities/approvalProcess/ApprovalProcessCommands';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import EmployeeSelectInput from "@/components/formInput/readyInput/EmployeeSelectInput.vue";
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const approvalProcessesCommand = ref(new UpdateApprovalProcessCommand());

const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    updateItem: {
        type: null as any,
        required: true
    }
});
const updateApprovalProcessesRef = ref(null as any);
const updateApprovalProcesses = () => {
    updateApprovalProcessesRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            approvalProcessesCommand.value.steps.forEach((a) => {
                if (a.approverEmployee) {
                    a.approverEmployeeId = a.approverEmployee.id;
                }
            });
            approvalProcessesCommand.value.steps = approvalProcessesCommand.value.steps.filter((x: ApprovalProcessStepDto) => x.approverEmployeeId != '' && x.approverEmployeeId != null && x.approverEmployeeId != undefined);
            if (approvalProcessesCommand.value.steps.length == 0) {
                buttons.value[1].loading = false;
                return
            }
            useApprovalProcessStore().updateApprovalProcess(props.updateItem.id, approvalProcessesCommand.value).then(() => {
                emit('createItem');
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updateApprovalProcesses());
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: () => updateApprovalProcesses(),
        loading: false
    }
])

const addStepFunction = () => {
    approvalProcessesCommand.value.steps.push({
        order: approvalProcessesCommand.value.steps.length + 1,
        approverEmployeeId: '',
        approverEmployee: null
    });
}

const deleteStep = (index: number) => {
    approvalProcessesCommand.value.steps.forEach((a, i) => {
        if (index <= i) {
            a.order -= 1
        }
    })
    approvalProcessesCommand.value.steps.splice(index, 1);
}

onMounted(() => {
    if (props.updateItem) {
        approvalProcessesCommand.value.name = props.updateItem.name;
        approvalProcessesCommand.value.isPrivate = props.updateItem.isPrivate;
        approvalProcessesCommand.value.steps = props.updateItem.approvers.map((x: any) => {
            return {
                approverEmployeeId: x.approver.id,
                order: x.order + 1,
                approverEmployee: x.approver
            }
        });
    }
})

</script>