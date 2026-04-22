<template>
    <DialogContent title="form.assignTraining" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="assignTrainingToEmployeesForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <EmployeeSelectInput multiple justId @selectValue="commandModel.employeeIds = $event" isRequired
                            :employeeStatusFilter="null" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { useTrainingStore } from '@/stores/humanResourcesStores/trainingStore';
import { CreateAssignmentsForEmployeesCommand } from '@/models/entities/humanResource/TrainingModels';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';

const commandModel = ref(new CreateAssignmentsForEmployeesCommand());
const emits = defineEmits(['createItem'])
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedTrainingId: {
        type: String,
        required: true
    }
});

const assignTrainingToEmployeesForm = ref(null as any);
const assingTrainingToEmployee = () => {
    assignTrainingToEmployeesForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useTrainingStore().createTrainingAssignmentsForEmployees(commandModel.value, props.selectedTrainingId).then((response: any) => {
                emits('createItem')
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => assingTrainingToEmployee())
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
        click: assingTrainingToEmployee,
        loading: false
    }
])
</script>