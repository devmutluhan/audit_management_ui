<template>
    <DialogContent title="general.addPay" :dialogClose="dialogClose" titleIcon="mdi-plus" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addSalaryForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField v-model="createSalaryCommand.amount" label="form.amount" isRequired isNumber />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createSalaryCommand.currencyCode" label="form.currencyCode"
                            isRequired item-title="code" item-value="code" :items="currencies" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="createSalaryCommand.payPeriod" label="form.payPeriod"
                            :items="payPeriods" item-title="title" item-value="value" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="createSalaryCommand.effectiveOn" label="form.effectiveOn" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SwitchInput v-model="createSalaryCommand.isGross" label="form.isGross" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SwitchInput v-model="createSalaryCommand.isMinimumWage" label="form.isMinimumWage" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { storeToRefs } from 'pinia'
import { ref } from 'vue';
import { CreateEmployeeSalariesCommand } from '@/models/entities/humanResource/EmployeeCommands';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { enumToArray } from '@/core/helpers/enumToArray';
import { PayPeriodTypeEnum } from '@/models/custom/EnumTypes';
import { useRoute } from 'vue-router';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { catchError } from '@/core/helpers/generalResponse';
const createSalaryCommand = ref(new CreateEmployeeSalariesCommand());
const payPeriods = enumToArray(PayPeriodTypeEnum);
const { createEmployeeSalary } = useEmployeeCommandStore();
const { currencies } = storeToRefs(useGeneralStore())

useGeneralStore().getCurrencies();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const route = useRoute();

const addSalaryForm = ref(null as any);
const addEmployeeSalary = () => {
    addSalaryForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons[1].loading = true
            createEmployeeSalary(route.params.id.toString(), createSalaryCommand.value).then(() => {
                useEmployeeDtoStore().getEmployeeSalaries(route.params.id.toString())
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => addEmployeeSalary())
            }).finally(() => {
                buttons[1].loading = false;
            })
        }
    });
}
const buttons = [
    {
        type: 'close',
        click: () => {
            props.dialogClose();
        }
    },
    {
        type: 'save',
        click: addEmployeeSalary,
        loading: false
    }
];

</script>