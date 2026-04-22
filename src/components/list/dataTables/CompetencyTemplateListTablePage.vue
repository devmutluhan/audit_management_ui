<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount" @rowDoubleClicked="(item) => {
            router.push({ name: 'competency-template-detail', params: { id: item.id } });
        }" @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:title="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'competency-template-detail', params: { id: data.id } }">
                {{ data.title }}
            </router-link>
        </template>
        <template v-slot:actions="{ row: data }" v-if="menuItems && hasClaimOrModules(['ManagePerformance'])">
            <GeneralDropdown v-if="filterMenuItems(data).length > 0" :data="data" :menuItems="filterMenuItems(data)">
            </GeneralDropdown>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter, templateStatusColumnFilter } from "@/core/data/readyFilterColumnObject";
import { useRouter } from "vue-router";
import { catchError } from "@/core/helpers/generalResponse";
import type { CompetencyTemplateDropdownDto } from "@/models/entities/humanResource/PerformanceDtos";
import { usePerformanceCommandStore } from "@/stores/humanResourcesStores/performanceCommandStore";
import { PerformanceTemplateStatus } from "@/models/custom/EnumTypes";

const router = useRouter();

const emits = defineEmits(['on-items-per-page-change', 'page-change']);

const props = defineProps<{
    tableData: PaginatedList<CompetencyTemplateDropdownDto>;
    loading: boolean;
}>();

const archiveFunc = (data: CompetencyTemplateDropdownDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    usePerformanceCommandStore().archiveCompetencyTemplate(data.id).then(() => {
        data.status = PerformanceTemplateStatus.Archived;
    }).catch((error) => {
        return catchError(error, () => { archiveFunc(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const activateFunc = (data: CompetencyTemplateDropdownDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    usePerformanceCommandStore().activateCompetencyTemplate(data.id).then(() => {
        data.status = PerformanceTemplateStatus.Active;
    }).catch((error) => {
        return catchError(error, () => { activateFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.archive",
        confirmModalValue: {
            text: "general.archiveDescription",
            buttonLoading: false,
            action: archiveFunc,
        }
    },
    {
        id: 2,
        title: "general.activate",
        confirmModalValue: {
            text: "general.activateDescription",
            buttonLoading: false,
            action: activateFunc,
        }
    }
]);


const filterMenuItems = (item: CompetencyTemplateDropdownDto) => {
    if (item.status == PerformanceTemplateStatus.Draft) {
        return menuItems.value;
    } else {
        return []
    }
}

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: 'list.title',
        columnLabel: "title",
        columnWidth: 175
    },
    templateStatusColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManagePerformance'])
    }
]);

</script>