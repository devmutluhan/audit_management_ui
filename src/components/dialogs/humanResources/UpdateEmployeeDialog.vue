<template>
    <DialogContent title="general.updateEmployee" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateEmployeeFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField label="list.name" v-model="commandModel.firstName" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.surname" v-model="commandModel.lastName" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.contractType" v-model="commandModel.contractType" clearable
                            :items="enumToArray(ContractTypeEnum)" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput :disabled="commandModel.contractType == ContractTypeEnum.Indefinite"
                            :isRequired="commandModel.contractType == ContractTypeEnum.Definite"
                            label="list.contractEndDate" v-model="commandModel.contractEndDate" clearable />
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
import { UpdateEmployeeCommand } from '@/models/entities/humanResource/EmployeeCommands';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ContractTypeEnum } from '@/models/custom/EnumTypes';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { storeToRefs } from 'pinia';

const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const commandModel = ref(new UpdateEmployeeCommand())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const updateEmployeeFormRef = ref(null as any);
const updateEmployee = () => {
    updateEmployeeFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (commandModel.value.contractType == ContractTypeEnum.Indefinite)
                commandModel.value.contractEndDate = ''
            useEmployeeCommandStore().updateEmployee(commandModel.value).then((res: any) => {
                employeeDetail.value.contractEndDate = commandModel.value.contractEndDate ?? ''
                employeeDetail.value.contractType = commandModel.value.contractType
                employeeDetail.value.firstName = commandModel.value.firstName
                employeeDetail.value.lastName = commandModel.value.lastName
                employeeDetail.value.fullName = commandModel.value.firstName + ' ' + commandModel.value.lastName
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updateEmployee())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    commandModel.value.avatarFileId = employeeDetail.value.avatarFileId
    commandModel.value.id = employeeDetail.value.id
    commandModel.value.contractEndDate = employeeDetail.value.contractEndDate
    commandModel.value.contractType = employeeDetail.value.contractType
    commandModel.value.firstName = employeeDetail.value.firstName
    commandModel.value.lastName = employeeDetail.value.lastName
});

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: updateEmployee,
        loading: false
    }
])

</script>