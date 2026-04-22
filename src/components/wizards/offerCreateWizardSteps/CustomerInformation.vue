<template>
    <v-card class="fill-height">
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.customerInformation') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="12" sm="8">
                    <CustomerSelectInput @selectValue="createOfferCommand.customer = $event;" isRequired
                        @clickClear="updateCustomerModelValue" :selectItems="[createOfferCommand.customer]"
                        @updateModelValue="updateCustomerModelValue" />
                </v-col>
                <v-col cols="12" sm="4">
                    <TextField v-model="createOfferCommand.termTime" label="form.termTime" isRequired isNumber />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <SingleSelectInput :items="customerDetail.addresses" itemTitle="city" itemValue="id"
                        :append-icon="hasClaimOrModules(['ManageCustomer']) ? 'mdi-plus-circle' : ''"
                        :disabled="!customerDetail.id" @appendIcon="addCustomerAddressDialog = true"
                        v-model="createOfferCommand.customerAddressId" label="form.customerAddress">
                        <template v-slot:menuItem="{ item }">
                            <v-list-item @click="createOfferCommand.customerAddressId = item.id">
                                {{ item.city }}
                                <v-list-item-subtitle>{{ item.street + '/' + item.countryName
                                }}</v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </SingleSelectInput>
                </v-col>
                <v-col cols="12">
                    <SingleSelectInput v-model="createOfferCommand.customerRepresentativeId" itemTitle="fullName"
                        :disabled="!customerDetail.id" itemValue="id"
                        :append-icon="hasClaimOrModules(['ManageCustomer']) ? 'mdi-plus-circle' : ''"
                        label="general.customerRepresentative" :items="customerDetail.representatives"
                        @appendIcon="addCustomerRepresentativeDialog = true">
                        <template v-slot:menuItem="{ item }">
                            <v-list-item @click="createOfferCommand.customerRepresentativeId = item.id">
                                {{ item.fullName }}
                                <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </SingleSelectInput>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <VDialogContent v-model="addCustomerAddressDialog">
        <AddAddressDialog :customer-id="customerDetail.id" :dialogClose="() => { addCustomerAddressDialog = false }"
            @createItem="(event: any) => { customerDetail.addresses.push(event); createOfferCommand.customerAddressId = event.id }" />
    </VDialogContent>
    <VDialogContent v-model="addCustomerRepresentativeDialog">
        <AddRepresentativeDialog :customer-id="customerDetail.id"
            :dialogClose="() => { addCustomerRepresentativeDialog = false }"
            @createItem="(event: any) => { customerDetail.representatives.push(event); createOfferCommand.customerRepresentativeId = event.id }" />
    </VDialogContent>
</template>

<script setup lang="ts">
import AddAddressDialog from '@/components/dialogs/customer/AddAddressDialog.vue';
import AddRepresentativeDialog from '@/components/dialogs/customer/AddRepresentativeDialog.vue';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import CustomerSelectInput from '@/components/formInput/readyInput/CustomerSelectInput.vue';
import { AddressDto, CustomerDetailDto, RepresentativeDto } from '@/models/entities/customer/CustomerDtos';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { useCustomerDtoStore } from '@/stores/customerStores/customerDtoStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { ref } from 'vue';
import type { AnswerCommandDto } from '@/models/entities/crm/CrmRiskFormModels';
import { catchError } from '@/core/helpers/generalResponse';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const { createOfferCommand } = storeToRefs(useOfferStore());
const customerDetail = ref(new CustomerDetailDto())
const addCustomerAddressDialog = ref(false);
const addCustomerRepresentativeDialog = ref(false);

const updateCustomerModelValue = () => {
    createOfferCommand.value.customerRepresentativeId = null;
    createOfferCommand.value.customerAddressId = null;
    createOfferCommand.value.address = null;
    createOfferCommand.value.representative = null;
    createOfferCommand.value.termTime = null;
    createOfferCommand.value.riskFormAnswers = null;
    createOfferCommand.value.questions = new Array<AnswerCommandDto>();
}

const getCustomerInfo = (customerId: string) => {
    useCustomerDtoStore().getCustomerDetail(customerId).then((res) => {
        customerDetail.value = res;
        createOfferCommand.value.termTime = res.termTime;
        createOfferCommand.value.representative = res.representatives.find((a) => a.id == createOfferCommand.value.customerRepresentativeId) ?? new RepresentativeDto()
        createOfferCommand.value.address = res.addresses.find((a) => a.id == createOfferCommand.value.customerAddressId) ?? new AddressDto()
    }).catch((error) => {
        return catchError(error, () => { getCustomerInfo(customerId) })
    })
}

watch(() => createOfferCommand.value.customerRepresentativeId, (newValue) => {
    if (newValue && createOfferCommand.value.customer) {
        createOfferCommand.value.representative = customerDetail.value.representatives.find((a) => a.id == newValue) ?? new RepresentativeDto()
    }
})

watch(() => createOfferCommand.value.customerAddressId, (newValue) => {
    if (newValue && createOfferCommand.value.customer) {
        createOfferCommand.value.address = customerDetail.value.addresses.find((a) => a.id == newValue) ?? new AddressDto()
    }
})

watch(() => createOfferCommand.value.customer, () => {
    if (createOfferCommand.value.customer) {
        createOfferCommand.value.customerId = createOfferCommand.value.customer.id;
        getCustomerInfo(createOfferCommand.value.customer.id);
    }
})

</script>