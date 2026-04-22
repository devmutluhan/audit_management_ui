<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.createClaim" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <AddCompanyBranchClaimDialog :dialogClose="() => { isActive.value = false }"
                                @create-item="useCrmDefinitionStore().getDocumentAuthorization(listQuery)" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="documentAuthorizationList.items ?? []" :header="tableHeader"
                        :enable-items-per-page-dropdown="true" :loading="loading"
                        :currentPage="documentAuthorizationList.pageNumber"
                        :total="documentAuthorizationList.totalCount"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters);"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)">
                        <template v-for="(it, index) in iconTableItems" :key="index" v-slot:[it]="{ row: data }">
                            <v-icon v-if="data[it]" color="success">mdi-check-bold</v-icon>
                            <v-icon v-else color="error">mdi-close-thick</v-icon>
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <VDialogContent v-model="updateDialog">
        <UpdateCompanyBranchClaimDialog :dialogClose="() => { updateDialog = false }"
            :selectedClaimEmployee="selectedClaimEmployee"
            @create-item="useCrmDefinitionStore().getDocumentAuthorization(listQuery)" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { ActiveFiltersType, GeneralDropdownType } from "@/models/types";
import { storeToRefs } from "pinia";
import { useCrmDefinitionStore } from "@/stores/crmStores/crmDefinitionStore";
import AddCompanyBranchClaimDialog from "@/components/dialogs/crm/AddCompanyBranchClaimDialog.vue";
import UpdateCompanyBranchClaimDialog from "@/components/dialogs/crm/UpdateCompanyBranchClaimDialog.vue";
import { activeFilters, companyBranchColumnFilter, employeeColumnFilter, mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { filterQuery } from "@/core/helpers/generalUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const selectedClaimEmployee = ref({} as any)
const updateDialog = ref(false);

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const { documentAuthorizationList, loading } = storeToRefs(useCrmDefinitionStore());

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
    isChange();
});

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    useCrmDefinitionStore().getDocumentAuthorization(listQuery.value);
}

// Feature: Fırsat istenirse kod aşağıdaki array e eklenecek
// 'viewPotentialOpportunity'
// 'managePotentialOpportunity',
const iconTableItems = ref(['viewOffer', 'manageOffer', 'viewAgreement', 'manageAgreement', 'viewProject', 'manageProject'])
const tableHeader = ref([
    employeeColumnFilter,
    companyBranchColumnFilter,
    // Feature: Fırsat istenirse kod aşağıdaki array e eklenecek
    // {
    //     columnName: 'list.viewPotentialOpportunity',
    //     columnLabel: "viewPotentialOpportunity",
    //     sortEnabled: true,
    //     columnWidth: 175,
    // },
    // {
    //     columnName: 'list.managePotentialOpportunity',
    //     columnLabel: "managePotentialOpportunity",
    //     sortEnabled: true,
    //     columnWidth: 175,
    // },
    {
        columnName: 'list.viewOffer',
        columnLabel: "viewOffer",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.manageOffer',
        columnLabel: "manageOffer",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.viewAgreement',
        columnLabel: "viewAgreement",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.manageAgreement',
        columnLabel: "manageAgreement",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.viewProject',
        columnLabel: "viewProject",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.manageProject',
        columnLabel: "manageProject",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])


const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useCrmDefinitionStore().deleteDocumentAuthorization(data.id).then(() => {
        if (documentAuthorizationList.value.items)
            documentAuthorizationList.value.items = documentAuthorizationList.value.items.filter(x => x.id !== data.id);
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item) => {
            selectedClaimEmployee.value = item;
            updateDialog.value = true;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
]);

</script>