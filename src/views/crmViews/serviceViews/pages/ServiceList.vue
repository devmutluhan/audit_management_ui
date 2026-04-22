<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props }">
                            <PageTitleCreateButton title="general.createService" v-bind="props">
                            </PageTitleCreateButton>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <AddServiceDialog :dialogClose="() => { isActive.value = false }" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="serviceList.items ?? []" :header="tableHeader" :loading="loading"
                        :currentPage="serviceList.pageNumber" :total="serviceList.totalCount"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)">
                        <template v-slot:inRotation="{ row: data }">
                            <v-chip :color="data.inRotation ? 'success' : 'error'" class="font-weight-bold">
                                {{ data.inRotation == true ? $t('list.include') : $t('list.exclude') }}
                            </v-chip>
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-dialog v-model="addToPositionForServiceDialog" width="800">
        <AddPositionForGroupOrServiceDialog :dialogClose="() => { addToPositionForServiceDialog = false }"
            :isGroup="false" :selectedItem="selectedItem" @createItem="selectedItem.subItems.unshift($event)" />
    </v-dialog>
    <!-- Hizmeti Günceller -->
    <v-dialog v-model="updateServiceDialog" width="800">
        <UpdateServiceDialog :dialogClose="() => { updateServiceDialog = false }" :selectedItem="selectedItem" />
    </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import UpdateServiceDialog from "@/components/dialogs/crm/UpdateServiceDialog.vue"
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { ActiveFiltersType, GeneralDropdownType } from "@/models/types";
import AddServiceDialog from "@/components/dialogs/crm/AddServiceDialog.vue";
import AddPositionForGroupOrServiceDialog from "@/components/dialogs/crm/AddPositionForGroupOrServiceDialog.vue"
import { storeToRefs } from "pinia";
import { useCrmServiceStore } from "@/stores/crmStores/crmServiceStore";
import type { PaginatedList } from "@/models/ApiResult";
import type { ServiceDto } from "@/models/entities/crm/CrmServiceDtos";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters, mountComponentForFilter, serviceFilterForServiceGroupColumnFilter, titleColumnFilter } from "@/core/data/readyFilterColumnObject";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { useManagementDtoStore } from "@/stores/managementStores/managementDtoStore";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";


onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const { serviceList, loading } = storeToRefs(useCrmServiceStore());
const { companySettings } = storeToRefs(useManagementDtoStore());
serviceList.value = {} as PaginatedList<ServiceDto>;

const updateServiceDialog = ref(false);
const addToPositionForServiceDialog = ref(false);
const selectedItem = ref({} as any);

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useCrmServiceStore().getServiceList(listQuery.value)
}
isChange()

const tableHeader = ref([
    titleColumnFilter,
    {
        columnName: 'list.inRotation',
        columnLabel: "inRotation",
        sortEnabled: true,
        columnWidth: 175,
    },
    serviceFilterForServiceGroupColumnFilter,
    {
        columnName: 'list.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])

watch(() => companySettings.value, (newValue) => {
    if (newValue && newValue.id) {
        if (!newValue.includeCompanyRotation) {
            tableHeader.value = tableHeader.value.filter((a) => a.columnLabel != 'inRotation')
        }
    }
}, { immediate: true, deep: true });


watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

const deleteService = (data: any) => {
    menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = true : '';
    useCrmServiceStore().deleteService(data.serviceGroup.id, data.id).then(() => {
        if (serviceList.value.items) {
            let serviceIndex = serviceList.value.items.findIndex((x: any) => x.id == data.id);
            serviceList.value.items.splice(serviceIndex, 1);
        }
    }).catch((error) => {
        return catchError(error, () => { deleteService(data) })
    }).finally(() => {
        menuItems.value[2].confirmModalValue ? menuItems.value[2].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "list.addToPositionForServiceGroup",
        action: (item: any) => {
            addToPositionForServiceDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        title: "general.update", // güncelle - sadece hizmeti güncelleyebilecek  PUT /api/crm/service-groups/{serviceGroupId}/services/{id}
        action: (item: any) => {
            updateServiceDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteService,
        },
    },
]);
</script>