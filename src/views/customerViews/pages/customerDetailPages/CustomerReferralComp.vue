<template>

    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('general.referrals') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="outlined"
                                    prepend-icon="mdi-account-check-outline" class="text-capitalize">
                                    {{ $t('general.addReferral') }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <AddReferralDialog :dialogClose="() => { isActive.value = false }"
                                    @createItem="(event: any) => addReferral(event)" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text style="max-height:250px; overflow:auto">
                    <v-row class="d-flex align-center" v-if="customerDetail.referrals.length > 0">
                        <v-col cols="12" v-for="(referral, index) in customerDetail.referrals" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="4" sm="3">
                                    <p class="mb-1 font-weight-medium text-blue-accent-3">
                                        {{ referral.referenceCompany }} </p>
                                    <p class="mb-0 font-weight-medium">
                                        {{ referral.referencePartner }} </p>
                                </v-col>
                                <v-col cols="4">
                                    <p class="mb-1 font-weight-medium"> {{ referral.phoneNumber }} </p>
                                    <p class="mb-0 font-weight-medium"> {{ referral.countryName ?? '' }} /
                                        {{ referral.city ?? '' }}
                                    </p>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                                    <GeneralDropdown :menuItems="referralMenuItems" :data="referral" />
                                </v-col>
                            </v-row>
                            <v-row v-if="index !== customerDetail.referrals.length - 1">
                                <v-col cols="12 py-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col class="py-6">
                            {{ $t('general.noReferral') }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>

        <VDialogContent v-model="dialog">
            <UpdateReferralDialog :dialogClose="() => { dialog = false }"
                @createItem="(event: any) => updateReferral(event)" :updateItem="selectedReferral" />
        </VDialogContent>
    </v-row>
</template>

<script lang="ts" setup>
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import AddReferralDialog from "@/components/dialogs/customer/AddReferralDialog.vue";
import UpdateReferralDialog from "@/components/dialogs/customer/UpdateReferralDialog.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { useRoute } from "vue-router";
import { catchError } from "@/core/helpers/generalResponse";
import type { GeneralDropdownType } from "@/models/types";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
const { customerDetail } = storeToRefs(useCustomerDtoStore());
const dialog = ref(false);
const selectedReferral = ref({} as any);

const deleteFunc = (referral: any) => {
    referralMenuItems.value[1].confirmModalValue ? referralMenuItems.value[1].confirmModalValue.buttonLoading = true : ''
    useCustomerCommandStore().deleteCustomerRefferal(referral.id, route.params.id.toString()).then(() => {
        const index = customerDetail.value.referrals.findIndex((item: any) => item.id === referral.id);
        if (index != -1)
            customerDetail.value.referrals.splice(index, 1);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(referral) })
    }).finally(() => {
        referralMenuItems.value[1].confirmModalValue ? referralMenuItems.value[1].confirmModalValue.buttonLoading = false : ''
    })
}

const referralMenuItems = ref<GeneralDropdownType[]>([
    {
        title: 'general.update',
        action: (item: any) => {
            selectedReferral.value = item;
            dialog.value = true
        }
    },
    {
        title: 'general.delete',
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    }
])

const addReferral = (referral: any) => {
    customerDetail.value.referrals.push(referral);
}

const updateReferral = (referral: any) => {
    const index = customerDetail.value.referrals.findIndex((item: any) => item.id === referral.id);
    customerDetail.value.referrals[index] = referral;
}

const route = useRoute();



</script>