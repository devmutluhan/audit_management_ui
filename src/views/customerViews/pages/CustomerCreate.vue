<template>
    <v-row class="d-flex align-center justify-center">
        <v-col cols="12" sm="10" class="mt-12">
            <v-form ref="createEmployeeFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="createCustomerCommand.name" placeholder="form.megabyteCompany"
                            label="form.customerName" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <CustomerSelectInput @selectValue="createCustomerCommand.parentId = $event;"
                            label="form.parentCustomer" justId />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <SwitchInput v-model="createCustomerCommand.keyClient" label="form.keyClient" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="createCustomerCommand.termTime" placeholder="form.6" isNumber :max="12"
                            label="form.termTime" :isRequired="createCustomerCommand.termTime ? true : false" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="createCustomerCommand.taxNumber" placeholder="form.1234567890"
                            label="form.taxNumber" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="createCustomerCommand.taxOfficeId" label="form.taxOffice"
                            :items="taxOfficeList" itemValue="id" itemTitle="name" placeholder="general.select" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="createCustomerCommand.customerTypeId"
                            placeholder="general.select" label="form.customerType" :items="customerTypes" itemValue="id"
                            itemTitle="name" />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="createCustomerCommand.sectorId" label="form.sector"
                            :items="customerSectors" itemValue="id" placeholder="general.select" itemTitle="name" />
                    </v-col>
                </v-row>
                <v-row class="d-flex justify-center align-center">
                    <v-col cols="8" md="3">
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
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import SwitchInput from "@/components/formInput/generalInputs/SwitchInput.vue";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { useTaxStore } from "@/stores/generalStores/taxStore";
import { storeToRefs } from "pinia";
import router from "@/router";
import { CreateCustomerCommand } from "@/models/entities/customer/CustomerCommads";
import SingleAutocompleteInput from "@/components/formInput/generalInputs/SingleAutocompleteInput.vue";
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import { catchError } from "@/core/helpers/generalResponse";
import CustomerSelectInput from "@/components/formInput/readyInput/CustomerSelectInput.vue";
import GeneralButton from "@/components/formInput/generalInputs/GeneralButton.vue";

const createCustomerCommand = ref(new CreateCustomerCommand());
const createEmployeeFormRef = ref(null as any);

const { taxOfficeList } = storeToRefs(useTaxStore());
const { customerTypes, customerSectors } = storeToRefs(useCustomerDtoStore());
useTaxStore().getTaxOfficeList();
useCustomerDtoStore().getCustomerTypes();
useCustomerDtoStore().getCustomerSectors();

const loading = ref(false)

const clickSubmit = () => {
    const promiseValidate = createEmployeeFormRef.value.validate();
    promiseValidate.then((res: any) => {
        if (res.valid) {
            loading.value = true;
            useCustomerCommandStore().createCustomer(createCustomerCommand.value).then((res: any) => {
                router.push({ name: "customer-detail", params: { id: res.data } });
            }).catch((error) => {
                return catchError(error, () => clickSubmit())
            }).finally(() => {
                loading.value = false
            })
        }
    })
}

</script>