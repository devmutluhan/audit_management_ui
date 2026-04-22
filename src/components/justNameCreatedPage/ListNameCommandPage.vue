<template>
    <v-row class="fill-height">
        <v-col>
            <Datatable :data="initTableData" :header="tableHeader" :enable-items-per-page-dropdown="true"
                :isHeadRowFilter="true" :loading="loading">
                <template v-slot:actions="{ row: data }">
                    <GeneralDropdown :data="data" :menuItems="menuItems" />
                </template>
            </Datatable>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref, watch } from "vue";
import { ActiveFiltersType, FilterItemsType, FilterItemTypeEnum, FilterOptionType, type GeneralDropdownType } from "@/models/types";
import type { LookupDto } from "@/models/ApiResult";
import { clientFilter } from "@/core/helpers/generalUtils";

const props = defineProps<{
    tableData: any[];
    menuItems: GeneralDropdownType[];
    columnName?: string;
    loading: boolean;
    searchValue?: string;
}>()

const tableHeader = ref([
    {
        columnName: props.columnName ? props.columnName : 'general.title',
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "name",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                filter(prop[0].value)
            },
        } as FilterOptionType,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])

const initTableData = ref(new Array<LookupDto>());

// watch(() => props.searchValue, (newValue) => {
//     if (newValue !== undefined) {
//         initTableData.value = clientFilter(props.tableData, 'name', newValue);
//     } else {
//         initTableData.value = props.tableData
//     }
// });

const filter = (newValue) => {
    if (newValue !== undefined) {
        initTableData.value = clientFilter(props.tableData, 'name', newValue);
    } else {
        initTableData.value = props.tableData
    }
}

watch(() => props.tableData.length, (newValue) => {
    initTableData.value = props.tableData
});


</script>