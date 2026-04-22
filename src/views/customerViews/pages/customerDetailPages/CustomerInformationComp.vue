<template>
    <v-row>
        <v-col md="6" cols="12" class="mt-6">
            <!-- Genel Bilgiler -->
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar class="d-flex align-center">
                            <v-col cols="auto">
                                <p class="mb-0 text-h6 font-weight-bold">{{ $t('menu.generalInformation') }}</p>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                                <VDialogContent>
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn v-bind="activatorProps" variant="outlined"
                                            prepend-icon="mdi-account-check-outline" class="text-capitalize">
                                            {{ $t('general.updateCustomer') }}
                                        </v-btn>
                                    </template>

                                    <template v-slot:default="{ isActive }">
                                        <UpdateCustomerInfoDialog :dialogClose="() => { isActive.value = false }" />
                                    </template>
                                </VDialogContent>
                            </v-col>
                        </v-toolbar>
                        <v-card-text class="pa-6">
                            <v-row>
                                <v-col>
                                    <v-row>
                                        <v-col>
                                            <p class="mb-1">{{ $t('general.taxNumber') }}</p>
                                            <p class="mb-1 font-weight-medium">
                                                {{ customerDetail.taxNumber ? customerDetail.taxNumber : '--' }}
                                            </p>
                                        </v-col>
                                        <v-col>
                                            <p class="mb-1">{{ $t('general.taxOffice') }}</p>
                                            <p class="mb-1 font-weight-medium">
                                                {{ customerDetail.taxOffice?.name ?? '--' }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <p class="mb-1">{{ $t('form.termTime') }}</p>
                                            <p class="mb-1 font-weight-medium"> {{ customerDetail.termTime ?? '--' }}
                                            </p>
                                        </v-col>
                                        <v-col>
                                            <p class="mb-1">{{ $t('form.customerType') }}</p>
                                            <p class="mb-1 font-weight-medium"> {{ customerDetail.type?.name ?? '--' }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <p class="mb-1">{{ $t('form.sector') }}</p>
                                            <p class="mb-1 font-weight-medium"> {{ customerDetail.sector?.name ?? '--'
                                                }}
                                            </p>
                                        </v-col>
                                        <v-col>
                                            <p class="mb-1">{{ $t('form.parent') }}</p>
                                            <p class="mb-0 font-weight-bold"> {{ customerDetail.parent?.name ?? '--' }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Referanslar -->
            <CustomerRefferralComp />
        </v-col>
        <v-col md="6" cols="12" class="mt-6">
            <!-- Müşteri Yetkilileri -->
            <CustomerRepresentativeComp />

            <!-- Adresler -->
            <CustomerAddressComp />

        </v-col>
    </v-row>
</template>

<script setup lang="ts">

import CustomerAddressComp from "@/views/customerViews/pages/customerDetailPages/CustomerAddressComp.vue";
import CustomerRepresentativeComp from "@/views/customerViews/pages/customerDetailPages/CustomerRepresentativeComp.vue";
import UpdateCustomerInfoDialog from "@/components/dialogs/customer/UpdateCustomerInfoDialog.vue";
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { storeToRefs } from "pinia";
import CustomerRefferralComp from "./CustomerReferralComp.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const { customerDetail } = storeToRefs(useCustomerDtoStore());


</script>