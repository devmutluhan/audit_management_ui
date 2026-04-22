<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount" :items-per-page="15"
        :itemsPerPageDropdownEnabled="false" @rowDoubleClicked="(item) => emits('read-notification', item)"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:title="{ row: data }">
            <p @click="emits('read-notification', data)">
                {{ data.title }}
            </p>
        </template>
        <template v-slot:message="{ row: data }">
            <p @click="emits('read-notification', data)">
                {{ data.message }}
            </p>
        </template>
        <template v-slot:actions="{ row: data }">
            <GeneralDropdown :menuItems="menuItems" :data="data"></GeneralDropdown>
        </template>
    </Datatable>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import type { NotificationsDto } from "@/models/entities/general/GeneralDtos";
import type { GeneralDropdownType } from "@/models/types";

const emits = defineEmits(['on-items-per-page-change', 'page-change', 'read-notification'])

const props = defineProps<{
    tableData: PaginatedList<NotificationsDto>;
    loading: boolean;
}>();

const tableHeader = ref([
    {
        columnName: 'list.title',
        columnLabel: "title",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'form.message',
        columnLabel: "message",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'form.readAt',
        columnLabel: "readAt",
        sortEnabled: false,
        columnWidth: 175,
        valueFormatter: (value: NotificationsDto) => {
            return formatterDateFromHours(value.readAt)
        },
    }
    // {
    //     columnName: 'list.actions',
    //     columnLabel: "actions",
    //     sortEnabled: true,
    //     columnWidth: 175
    // }
]);

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.detailView",
        action: (item) => {
            // Todo: notification Detail 
        }
    }
]);

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});

</script>