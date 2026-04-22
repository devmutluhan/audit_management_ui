<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount" @rowDoubleClicked="(item) => {
            router.push({ name: 'training-detail', params: { id: item.id } });
        }" @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:name="{ row: data }">
            <router-link class="text-rowTextColor font-weight-black"
                :to="{ name: 'training-detail', params: { id: data.id } }">
                {{ data.name }}
            </router-link>
        </template>
        <template v-slot:actions="{ row: data }" v-if="menuItems && hasClaimOrModules(['ManageTraining'])">
            <GeneralDropdown :data="data" :menuItems="menuItems">
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
import { mountComponentForFilter, nameColumnFilter } from "@/core/data/readyFilterColumnObject";
import { useRouter } from "vue-router";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import type { GetTrainingDto } from "@/models/entities/humanResource/TrainingModels";
import { useTrainingStore } from "@/stores/humanResourcesStores/trainingStore";
import { catchError } from "@/core/helpers/generalResponse";

const router = useRouter();

const emits = defineEmits(['deletePerformance', 'on-items-per-page-change', 'page-change', 'update-dialog']);
const props = defineProps<{
    tableData: PaginatedList<GetTrainingDto>;
    loading: boolean;
}>();

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useTrainingStore().deleteTraining(data.id).then(() => {
        emits('deletePerformance', data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.update",
        action: (data) => { emits('update-dialog', data) }
    },
    {
        id: 2,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        }
    }
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    nameColumnFilter,
    {
        columnName: 'form.startDate',
        columnLabel: "startDate",
        valueFormatter: (value: GetTrainingDto) => {
            return formatterDateFromHours(value.startDate)
        },
        columnWidth: 175
    },
    {
        columnName: 'form.endDate',
        columnLabel: "endDate",
        valueFormatter: (value: GetTrainingDto) => {
            return formatterDateFromHours(value.endDate)
        },
        columnWidth: 175
    },
    {
        columnName: 'list.instructorName',
        columnLabel: "instructorName",
        columnWidth: 175
    },
    {
        columnName: 'list.instructorCompany',
        columnLabel: "instructorCompany",
        columnWidth: 175
    },
    {
        columnName: 'list.location',
        columnLabel: "location",
        columnWidth: 175
    },
    {
        columnName: 'list.description',
        columnLabel: "description",
        columnWidth: 175
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManageTraining'])
    }
]);

</script>