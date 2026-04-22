<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('general.addresses') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="outlined"
                                    prepend-icon="mdi-account-check-outline" class="text-capitalize">
                                    {{ $t('general.addAddress') }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <AddAddressDialog :dialogClose="() => { isActive.value = false }"
                                    :customer-id="route.params.id.toString()"
                                    @createItem="(event: any) => addAddress(event)" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text style="max-height:250px; overflow:auto">
                    <v-row class="d-flex align-center" v-if="customerDetail.addresses.length > 0">
                        <v-col cols="12" v-for="(address, index) in customerDetail.addresses" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="8">
                                    <p class="mb-1 font-weight-medium text-blue-accent-3">
                                        {{ address.countryName + " ( " + address.countryCode + ' )' }}
                                    </p>
                                    <p class="mb-0 font-weight-medium"> {{ address.city + ' / ' + address.street }} </p>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                                    <GeneralDropdown :menuItems="addressMenuItems" :data="address" />
                                </v-col>
                            </v-row>
                            <v-row v-if="index !== customerDetail.addresses.length - 1">
                                <v-col cols="12 py-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col class="py-6">
                            {{ $t('general.noAddress') }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <VDialogContent v-model="dialog">
        <UpdateAddressDialog :dialogClose="() => { dialog = false }" @createItem="(event: any) => updateAddress(event)"
            :updateItem="selectedAddress" />
    </VDialogContent>
</template>

<script lang="ts" setup>

import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import AddAddressDialog from "@/components/dialogs/customer/AddAddressDialog.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { storeToRefs } from "pinia";
import UpdateAddressDialog from "@/components/dialogs/customer/UpdateAddressDialog.vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { AddCustomerAddressCommand } from "@/models/entities/customer/CustomerCommads";
import type { GeneralDropdownType } from "@/models/types";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
const { customerDetail } = storeToRefs(useCustomerDtoStore());
const dialog = ref(false);
const selectedAddress = ref(new AddCustomerAddressCommand());

const addressMenuItems = ref<GeneralDropdownType[]>([
    {
        title: 'general.update',
        action: (address: any) => {
            selectedAddress.value = address;
            dialog.value = true;
        }
    },
    {
        title: 'general.delete',
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: (data: any) => deleteAddress(data),
        },
    }
])


const addAddress = (address: any) => {
    customerDetail.value.addresses.push(address);
}

const updateAddress = (address: any) => {
    const index = customerDetail.value.addresses.findIndex((item: any) => item.id === address.id);
    customerDetail.value.addresses[index] = address;
}

const route = useRoute();

const deleteAddress = (address: any) => {
    addressMenuItems.value[1].confirmModalValue ? addressMenuItems.value[1].confirmModalValue.buttonLoading = true : ''
    useCustomerCommandStore().deleteCustomerAddress(address.id).then(() => {
        const index = customerDetail.value.addresses.findIndex((item: any) => item.id === address.id);
        if (index != -1)
            customerDetail.value.addresses.splice(index, 1);
    }).catch((error) => {
        return catchError(error, () => { deleteAddress(address) })
    }).finally(() => {
        addressMenuItems.value[1].confirmModalValue ? addressMenuItems.value[1].confirmModalValue.buttonLoading = false : ''
    })
}

</script>