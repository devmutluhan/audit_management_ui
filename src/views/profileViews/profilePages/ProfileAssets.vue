<template>
    <v-row class="mt-4 fill-height">
        <v-col cols="12">
            <Datatable :data="assetsListForEmployee" :header="tableHeader" :enable-items-per-page-dropdown="false"
                :checkbox-enabled="false" :loading="loading">
                <template v-slot:returnDate="{ row: data }">
                    <span v-if="data.returnDate">
                        {{ formatterDate(data.returnDate) ?? '--' }}
                    </span>
                    <v-chip v-else color="success" class="font-weight-bold">
                        {{ $t('general.isActive') }}
                    </v-chip>
                </template>
            </Datatable>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { formatterDate } from "@/core/helpers/dateUtils";
import { useAssetsStore } from "@/stores/assetsStores/assetsStore";
import type { AssetsForEmployeeDto } from "@/models/entities/assets/AssetsModels";
import { userInfo } from "@/core/helpers/localStorageManagement";

const { assetsListForEmployee, loading } = storeToRefs(useAssetsStore());
useAssetsStore().getAssetsForEmployee({ employeeId: userInfo.value.employeeId })

const tableHeader = ref([
    {
        columnName: "list.serialNumber",
        columnLabel: "serialNumber",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.category",
        columnLabel: "categoryName",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "list.brand",
        columnLabel: "brand",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "list.model",
        columnLabel: "model",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "list.assignAssetDate",
        columnLabel: "assignDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: AssetsForEmployeeDto) => {
            return formatterDate(value.assignDate)
        }
    },
    {
        columnName: "form.returnAssetsDate",
        columnLabel: "returnDate",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: "list.description",
        columnLabel: "note",
        columnWidth: 175,
        filterEnabled: false,
    }
]);

</script>