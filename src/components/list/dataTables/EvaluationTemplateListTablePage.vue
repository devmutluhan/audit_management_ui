<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:defaultGoalTitle="{ row: data }">
            {{ data.defaultGoalTitle ?? '--' }}
        </template>
        <template v-slot:goalWeight="{ row: data }">
            {{ data.goalWeight == 0 ? $t('enums.None') : '% ' + data.goalWeight * 100 }}
        </template>
        <template v-slot:competencyWeight="{ row: data }">
            {{ data.competencyWeight == 0 ? $t('enums.None') : '% ' + data.competencyWeight * 100 }}
        </template>
        <template v-slot:goalType="{ row: data }">
            {{enumToArray(GoalTypeEnum).find((a) => a.value == data.goalType)?.title ?? '--'}}
        </template>
        <template v-slot:actions="{ row: data }" v-if="menuItems && hasClaimOrModules(['ManagePerformance'])">
            <GeneralDropdown v-if="filterMenuItems(data).length > 0" :data="data" :menuItems="filterMenuItems(data)">
            </GeneralDropdown>
        </template>
    </Datatable>
    <VDialogContent v-model="updateDialog">
        <template v-slot:default>
            <CreateEvaluationTemplateDialog :dialogClose="() => { updateDialog = false }"
                :selectedItem="selectedItem" />
        </template>
    </VDialogContent>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import type { PaginatedList } from "@/models/ApiResult";
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { isPassiveColumnFilter, mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { catchError } from "@/core/helpers/generalResponse";
import { EvaluationTemplateDto } from "@/models/entities/humanResource/PerformanceDtos";
import { usePerformanceCommandStore } from "@/stores/humanResourcesStores/performanceCommandStore";
import { ChangeEvaluationTemplateStatusCommand } from "@/models/entities/humanResource/PerformanceCommands";
import { enumToArray } from "@/core/helpers/enumToArray";
import { GoalTypeEnum } from "@/models/custom/EnumTypes";
import CreateEvaluationTemplateDialog from "@/components/dialogs/humanResources/CreateEvaluationTemplateDialog.vue";

const emits = defineEmits(['on-items-per-page-change', 'page-change']);

const props = defineProps<{
    tableData: PaginatedList<EvaluationTemplateDto>;
    loading: boolean;
}>();

const updateDialog = ref(false);
const selectedItem = ref(new EvaluationTemplateDto());
const passiveOrActiveFunc = (data: EvaluationTemplateDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    const command = new ChangeEvaluationTemplateStatusCommand();
    command.isPassive = !data.isPassive;
    usePerformanceCommandStore().changeEvaluationTemplateStatus(data.id, command).then(() => {
        data.isPassive = command.isPassive
    }).catch((error) => {
        return catchError(error, () => { passiveOrActiveFunc(data) })
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
            text: "general.statusDescriptionForTemplate",
            buttonLoading: false,
            action: passiveOrActiveFunc,
        },
    },
    {
        id: 2,
        title: "general.setActive",
        confirmModalValue: {
            text: "general.statusDescriptionForTemplate",
            buttonLoading: false,
            action: passiveOrActiveFunc,
        },
    },
    {
        id: 3,
        title: "general.update",
        action: (item: EvaluationTemplateDto) => {
            selectedItem.value = item
            updateDialog.value = true
        }
    },
]);


const filterMenuItems = (item: EvaluationTemplateDto) => {
    if (item.isPassive) {
        return menuItems.value.filter((a) => a.id != 1)
    } else {
        return menuItems.value.filter((a) => a.id != 2)
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
    {
        columnName: 'list.competencyWeight',
        columnLabel: "competencyWeight",
        columnWidth: 175
    },
    {
        columnName: 'list.goalWeight',
        columnLabel: "goalWeight",
        columnWidth: 175
    },
    {
        columnName: 'list.goalTitle',
        columnLabel: "defaultGoalTitle",
        columnWidth: 175
    },
    {
        columnName: 'list.goalType',
        columnLabel: "goalType",
        columnWidth: 175
    },
    isPassiveColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManagePerformance'])
    }
]);

</script>