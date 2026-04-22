<template>
    <v-row class="d-flex align-center justify-center">
        <v-col cols="12" sm="10" class="mt-12">
            <v-form ref="createEmployeeFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="createEmployeeCommand.firstName" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="createEmployeeCommand.lastName" label="form.surname" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="createEmployeeCommand.identityNumber" maxLength="11" isNumber
                            label="form.identityNumber" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="createEmployeeCommand.workPhoneNumber" isPhoneNumber maxLength="13"
                            label="form.workingPhone" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="createEmployeeCommand.workingEmail" label="form.workingEmail"
                            descriptionText="statusCode.loginEmailDescription" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <DateInput v-model="createEmployeeCommand.officalStartDate" label="form.officalStartDate"
                            isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col>
                        <SwitchInput v-model="createEmployeeCommand.sendWelcomeEmail" label="form.sendWelcomeEmail"
                            descriptionText="statusCode.sendWelcomeEmailDescription" />
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-center align-center">
                    <v-col cols="3">
                        <GeneralButton prependIcon="mdi-content-save-outline" title="general.save" @click="clickSubmit"
                            :loading="loading" size="x-large" block>
                        </GeneralButton>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { CreateEmployeeCommand } from "@/models/entities/humanResource/EmployeeCommands";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import SwitchInput from "@/components/formInput/generalInputs/SwitchInput.vue";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import { useEmployeeCommandStore } from "@/stores/humanResourcesStores/employeeCommandStore";
import router from "@/router";
import { catchError } from "@/core/helpers/generalResponse";
import GeneralButton from "@/components/formInput/generalInputs/GeneralButton.vue";
const createEmployeeCommand = ref(new CreateEmployeeCommand());
const createEmployeeFormRef = ref(null as any);
const loading = ref(false)

const clickSubmit = () => {
    const promiseValidate = createEmployeeFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            loading.value = true;
            useEmployeeCommandStore().createEmployee(createEmployeeCommand.value).then((res: any) => {
                router.push({ name: "employee-detail", params: { id: res.data } });
            }).catch((error) => {
                return catchError(error, () => clickSubmit())
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

</script>