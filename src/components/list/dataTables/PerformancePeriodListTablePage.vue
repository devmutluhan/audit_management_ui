<template>
    <div class="fill-height">
        <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
            :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount" @rowDoubleClicked="(item) => {
                router.push({ name: 'performance-detail', params: { id: item.id } });
            }" @on-items-per-page-change="emits('on-items-per-page-change', $event)"
            @page-change="emits('page-change', $event)">
            <template v-slot:title="{ row: data }">
                <router-link class="text-rowTextColor font-weight-black"
                    :to="{ name: 'performance-detail', params: { id: data.id } }">
                    {{ data.title }}
                </router-link>
            </template>
            <template v-slot:startEndDate="{ row: data }">
                📅 {{
                    formatterDate(data.startDate)
                }} - {{
                    formatterDate(data.endDate)
                }}
            </template>
            <template v-slot:actions="{ row: data }" v-if="hasClaimOrModules(['ManagePerformance'])">
                <GeneralDropdown :data="data" :menuItems="filterMenuItems(data.status)">
                </GeneralDropdown>
            </template>
        </Datatable>
        <VDialogContent v-model="updateDialog">
            <UpdatePerformancePeriodDialog :dialogClose="() => { updateDialog = false }"
                :performance="selectedPerformance" @createItem="updatePeriod($event)" />
        </VDialogContent>
    </div>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import UpdatePerformancePeriodDialog from "@/components/dialogs/humanResources/UpdatePerformancePeriodDialog.vue";
import { onMounted, ref } from "vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter, performanceStartDateColumnFilter, performanceStatusColumnFilter } from "@/core/data/readyFilterColumnObject";
import { useRouter } from "vue-router";
import { formatterDate } from "@/core/helpers/dateUtils";
import { catchError } from "@/core/helpers/generalResponse";
import { PeriodDto } from "@/models/entities/humanResource/PerformanceDtos";
import { usePerformanceCommandStore } from "@/stores/humanResourcesStores/performanceCommandStore";
import type { UpdatePeriodCommand } from "@/models/entities/humanResource/PerformanceCommands";
import { PeriodStatusType } from "@/models/custom/EnumTypes";

const router = useRouter();

const emits = defineEmits(['deletePerformance', 'on-items-per-page-change', 'page-change']);
const updateDialog = ref(false);
const selectedPerformance = ref(new PeriodDto())

const props = defineProps<{
    tableData: PaginatedList<PeriodDto>;
    loading: boolean;
}>();

const deleteFunc = (data: any) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    usePerformanceCommandStore().deletePeriod(data.id).then(() => {
        emits('deletePerformance', data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const updatePeriod = (event: UpdatePeriodCommand) => {
    if (props.tableData.items) {
        const index = props.tableData.items.findIndex((a) => a.id == selectedPerformance.value.id);
        if (index != -1) {
            props.tableData.items[index].startDate = event.startDate;
            props.tableData.items[index].title = event.title;
            props.tableData.items[index].endDate = event.endDate;
        }
    }
}

const filterMenuItems = (status: PeriodStatusType) => {
    if (status == PeriodStatusType.Planning) {
        return menuItems.value
    } else {
        return new Array<GeneralDropdownType>()
    }
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        }
    },
    {
        id: 2,
        title: "general.update",
        action: (item: PeriodDto) => {
            updateDialog.value = true;
            selectedPerformance.value = item;
        }
    },
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: 'list.title',
        columnLabel: "title",
        columnWidth: 175
    },
    performanceStartDateColumnFilter,
    performanceStatusColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManagePerformance'])
    }
]);

</script>