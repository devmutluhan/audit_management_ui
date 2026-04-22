<template>
    <DialogContent title="general.addApprovalProcesses" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createApprovalProcesses">
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
                                    @selectValue="item.approverEmployeeId = $event;" justId>
                                </EmployeeSelectInput>
                            </v-col>
                            <v-col cols="8" sm="2" md="2">
                                <TextField v-model="item.order" label="form.order" isNumber />
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <v-btn variant="text" color="error" icon="mdi-delete" size="30"
                                    @click="approvalProcessesCommand.steps.splice(index, 1)"></v-btn>
                            </v-col>
                        </v-row>
                        <v-row style="border-top:1px solid rgb(var(--v-theme-cardToolbar));"
                            class="d-flex justify-center" v-if="index != approvalProcessesCommand.steps.length - 1">
                            <v-icon color="success">mdi-chevron-double-down</v-icon>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <AddButtonCard v-model="approvalProcessesCommand.steps" title="form.addStep"
                            :validationRef="createApprovalProcesses" :addItemFunc="addStepFunction" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { ApprovalProcessStepDto, CreateApprovalProcessCommand } from '@/models/entities/approvalProcess/ApprovalProcessCommands';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import EmployeeSelectInput from "@/components/formInput/readyInput/EmployeeSelectInput.vue";
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { ApprovalEmployeeDto } from '@/models/entities/approvalProcess/ApprovalProcessDtos';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const approvalProcessesCommand = ref(new CreateApprovalProcessCommand())
const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createApprovalProcesses = ref(null as any);
const addApprovalProcesses = () => {
    createApprovalProcesses.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            approvalProcessesCommand.value.steps = approvalProcessesCommand.value.steps.filter((x: ApprovalProcessStepDto) => x.approverEmployeeId != '' && x.approverEmployeeId != null && x.approverEmployeeId != undefined)
            useApprovalProcessStore().createApprovalProcess(approvalProcessesCommand.value).then(() => {
                emit('createItem');
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addApprovalProcesses());
            }).finally(() => {
                buttons.value[1].loading = false;
            });
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
        click: () => addApprovalProcesses(),
        loading: false
    }
])

const addStepFunction = () => {
    approvalProcessesCommand.value.steps.push({
        order: approvalProcessesCommand.value.steps.length + 1,
        approverEmployeeId: '',
        approverEmployee: new ApprovalEmployeeDto()
    });
}

</script>