<template>
    <DialogContent title="general.terminateEmployee" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-airplane-alert">
        <template v-slot:dialogBody>
            <v-form ref="terminateEmployeeFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <SingleSelectInput label="list.terminateReason" v-model="selectedReason" item-title="value"
                            item-value="id" :items="terminationReasonList" isRequired>
                            <template v-slot:menuItem="{ item }">
                                <v-list-item link class="py-0 px-2" @click="selectedReason = item">
                                    <v-row>
                                        <v-col class="pb-0">
                                            <p class="text-body-1 ma-0">{{ item.value }}</p>
                                            <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col class="pa-0">
                                            <v-divider></v-divider>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                            </template>
                        </SingleSelectInput>
                    </v-col>
                    <v-col cols="12">
                        <TextArea label="list.description" v-model="commandModel.terminationDetails" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { TerminateEmployeeCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { TerminationReasonDto } from '@/models/entities/humanResource/EmployeeDtos';

const commandModel = ref(new TerminateEmployeeCommand())
const selectedReason = ref(new TerminationReasonDto())
const emit = defineEmits(['terminateEmployee']);
const { terminationReasonList } = storeToRefs(useEmployeeDtoStore());
useEmployeeDtoStore().getTerminateReasonList();
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    }
});

const terminateEmployeeFormRef = ref(null as any);
const terminateEmployee = () => {
    terminateEmployeeFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.terminationReasonId = selectedReason.value.id;
            useEmployeeCommandStore().terminateEmployee(props.employeeId, commandModel.value).then(() => {
                emit('terminateEmployee', {});
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => terminateEmployee());
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: terminateEmployee,
        loading: false
    }
])

</script>