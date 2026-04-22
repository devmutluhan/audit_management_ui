<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton v-if="hasClaimOrModules(['ManageCustomer'])" title="general.createCustomer"
                        :to="{ name: 'customer-create' }">
                    </PageTitleCreateButton>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <CustomerListTablePage :tableData="customerList" @deleteCustomer="deleteCustomer($event)"
                        @passiveCustomer="passiveCustomer($event)" :loading="customerListLoading"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CustomerListTablePage from "@/components/list/dataTables/CustomerListTablePage.vue";
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import { storeToRefs } from "pinia";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import type { CustomerDto } from "@/models/entities/customer/CustomerDtos";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const { customerList, customerListLoading } = storeToRefs(useCustomerDtoStore());
customerList.value = {} as PaginatedList<CustomerDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useCustomerDtoStore().getCustomerList(listQuery.value);
}
isChange()

const passiveCustomer = (id: number) => {
    const customer = customerList.value.items?.find((x: any) => x.id === id);
    if (customer) {
        customer.isPassive = !customer.isPassive;
    }
};

const deleteCustomer = (id: number) => {
    if (customerList.value.items)
        customerList.value.items = customerList.value.items?.filter((x: any) => x.id !== id);
};

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

</script>