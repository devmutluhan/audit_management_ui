<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @rowDoubleClicked="(item) => { router.push({ name: 'customer-detail', params: { id: item.id } }) }"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:imageUrl="{ row: data }">
            <router-link :to="{ name: 'customer-detail', params: { id: data.id } }">
                <ImageCard :full-name="data.name" color="warning" :avatar-text="data.logoUrl"
                    :rounded="isMobileDevice() ? 'lg' : 'circle'" />
            </router-link>
        </template>
        <template v-slot:name="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'customer-detail', params: { id: data.id } }">
                {{ data.name }}
            </router-link>
        </template>
        <template v-slot:isPassive="{ row: data }">
            <v-chip :color="data.isPassive ? 'error' : 'success'" class="font-weight-bold">
                {{ data.isPassive == false ? $t('general.isActive') : $t('general.passive') }}
            </v-chip>
        </template>
        <template v-slot:parent="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black" v-if="data.parentId"
                :to="{ name: 'customer-detail', params: { id: data.parentId } }">
                {{ data.parent ?? '--' }}
            </router-link>
        </template>
        <template v-slot:actions="{ row: data }" v-if="menuItems && hasClaimOrModules(['ManageCustomer'])">
            <GeneralDropdown :data="data" :menuItems="filterMenuItems(data)">
            </GeneralDropdown>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";

import type { CustomerDto } from "@/models/entities/customer/CustomerDtos";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { customerNameColumnFilter, customerParentColumnFilter, customerSectorColumnFilter, mountComponentForFilter, customerTypeColumnFilter, customerIsPassiveColumnFilter } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import ImageCard from "@/components/cards/ImageCard.vue";
import router from "@/router";
import { isMobileDevice } from "@/assets/ts/_utils";
import { catchError } from "@/core/helpers/generalResponse";

const emits = defineEmits(['deleteCustomer', 'passiveCustomer', 'on-items-per-page-change', 'page-change']);

const props = defineProps<{
    tableData: PaginatedList<CustomerDto>;
    loading: boolean;
}>();

const deleteFunc = (data: CustomerDto) => {
    menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = true : '';
    useCustomerCommandStore().deleteCustomer(data.id).then(() => {
        emits('deleteCustomer', data.id);
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = false : '';
    });
}

const passiveOrActiveFunc = (data: CustomerDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';

    useCustomerCommandStore().passiveCustomer(data.id).then(() => {
        emits('passiveCustomer', data.id);
    }).catch((error) => {
        return catchError(error, () => passiveOrActiveFunc(data));
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.setPassive",
        confirmModalValue: {
            text: "general.statusDescriptionForCustomer",
            buttonLoading: false,
            action: passiveOrActiveFunc,
        },
    },
    {
        id: 2,
        title: "general.setActive",
        confirmModalValue: {
            text: "general.statusDescriptionForCustomer",
            buttonLoading: false,
            action: passiveOrActiveFunc,
        },
    },
    {
        id: 3,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const filterMenuItems = (item: CustomerDto) => {
    if (item.isPassive) {
        return menuItems.value.filter((a) => a.id != 1)
    } else {
        return menuItems.value.filter((a) => a.id != 2)
    }
}

const tableHeader = ref([
    {
        columnName: '',
        columnLabel: "imageUrl",
        columnWidth: 50
    },
    customerNameColumnFilter,
    customerTypeColumnFilter,
    customerParentColumnFilter,
    customerSectorColumnFilter,
    customerIsPassiveColumnFilter,
    {
        columnName: 'list.termTime',
        columnLabel: "termTime",
        columnWidth: 175
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManageCustomer'])
    },
]);

</script>