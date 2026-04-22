<template>
    <DialogContent title="general.selectEmployee" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="selecteEmployeeForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <EmployeeSelectInput justId @selectValue="employeeId = $event" isRequired
                            :employeeStatusFilter="null">
                        </EmployeeSelectInput>
                    </v-col>
                </v-row>
            </v-form>
            <VDialogContent v-model="addExpenseDialog">
                <AddExpenseDialog :employeeId="employeeId" :dialogClose="() => { addExpenseDialog = false }"
                    @createdItem="createItem('')" />
            </VDialogContent>
            <VDialogContent v-model="addVacationDialog">
                <AddVacationDialog :employeeId="employeeId" :dialogClose="() => { addVacationDialog = false }"
                    @createdItem="createItem($event)" />
            </VDialogContent>
            <VDialogContent v-model="addAdvanceDialog">
                <AddAdvanceDialog :employeeId="employeeId" :dialogClose="() => { addAdvanceDialog = false }"
                    @createdItem="createItem('')" />
            </VDialogContent>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import AddVacationDialog from "@/components/dialogs/humanResources/AddVacationDialog.vue";
import AddExpenseDialog from './AddExpenseDialog.vue';
import VDialogContent from '../VDialogContent.vue';
import AddAdvanceDialog from './AddAdvanceDialog.vue';

const employeeId = ref('');
const addVacationDialog = ref(false);
const addExpenseDialog = ref(false);
const addAdvanceDialog = ref(false);

const emit = defineEmits(['createItem']);
const selecteEmployeeForm = ref(null as any);
type DialogType = 'advance' | 'vacation' | 'expense'
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    type: {
        type: String as PropType<DialogType>,
        required: false
    }
});

const selectEmployee = () => {
    selecteEmployeeForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (props.type == 'expense') {
                addExpenseDialog.value = true;
            } else if (props.type == 'vacation') {
                addVacationDialog.value = true;
            } else if (props.type == 'advance') {
                addAdvanceDialog.value = true;
            }
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: selectEmployee,
        loading: false
    }
])

const createItem = (item: any) => {
    emit('createItem', item);
    props.dialogClose();
    employeeId.value = ''
}
</script>