<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('general.customerRepresentative') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="outlined"
                                    prepend-icon="mdi-account-check-outline" class="text-capitalize">
                                    {{ $t('general.addRepresentative') }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <AddRepresentativeDialog :dialogClose="() => { isActive.value = false }"
                                    @createItem="(event: any) => addRepresentative(event)"
                                    :customer-id="route.params.id.toString()" />
                            </template>
                        </VDialogContent>
                    </v-col>

                </v-toolbar>
                <v-card-text style="max-height:250px; overflow:auto">
                    <v-row class="d-flex align-center" v-if="customerDetail.representatives.length > 0">
                        <v-col cols="12" v-for="(representative, index) in customerDetail.representatives" :key="index">
                            <v-row class="d-flex align-center">
                                <v-col cols="4" sm="3">
                                    <p class="mb-1 font-weight-medium text-blue-accent-3">
                                        {{ representative.fullName }}
                                    </p>
                                    <p class="mb-0 font-weight-medium" v-if="representative.position">
                                        {{ representative.position }}
                                    </p>
                                </v-col>
                                <v-col cols="4" class="px-1">
                                    <p class="mb-1 font-weight-medium" v-if="representative.phoneNumber">
                                        {{ $t('general.phone') }} : {{ representative.phoneNumber }}
                                    </p>
                                    <p class="mb-0 font-weight-medium">
                                        {{ representative.email }} </p>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" v-if="hasClaimOrModules(['ManageCustomer'])">
                                    <GeneralDropdown :menuItems="representativeMenuItems" :data="representative" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col class="py-6">
                            {{ $t('general.noRepresentative') }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

    <VDialogContent v-model="updateDialog">
        <UpdateRepresentativeDialog :dialogClose="() => { updateDialog = false }"
            @createItem="(event: any) => updateRepresentative(event)" :updateItem="selectedRepresentative" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import AddRepresentativeDialog from "@/components/dialogs/customer/AddRepresentativeDialog.vue";
import UpdateRepresentativeDialog from "@/components/dialogs/customer/UpdateRepresentativeDialog.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref } from "vue";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { catchError } from "@/core/helpers/generalResponse";
import type { GeneralDropdownType } from "@/models/types";
import { useRoute } from "vue-router";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
const route = useRoute();

const { customerDetail } = storeToRefs(useCustomerDtoStore());
const updateDialog = ref(false);
const selectedRepresentative = ref(null as any);

const deleteFunc = (representative: any) => {
    representativeMenuItems.value[1].confirmModalValue ? representativeMenuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useCustomerCommandStore().deleteCustomerRepresentative(representative.id).then(() => {
        const index = customerDetail.value.representatives.findIndex((item: any) => item.id === representative.id);
        if (index != -1)
            customerDetail.value.representatives.splice(index, 1);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(representative) })
    }).finally(() => {
        representativeMenuItems.value[1].confirmModalValue ? representativeMenuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })

}
const representativeMenuItems = ref<GeneralDropdownType[]>([
    {
        title: 'general.update',
        action: (item: any) => {
            selectedRepresentative.value = item;
            updateDialog.value = true
        }
    },
    {
        title: 'general.delete',
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: (data: any) => deleteFunc(data),
        },
    }
])

const addRepresentative = (representative: any) => {
    customerDetail.value.representatives.push(representative);
}

const updateRepresentative = (representative: any) => {
    const index = customerDetail.value.representatives.findIndex((item: any) => item.id === representative.id);
    customerDetail.value.representatives[index] = representative;
}


</script>