<template>
    <v-col>
        <v-row>
            <v-col cols="12" class="pt-12">
                <v-row class="d-flex align-center">
                    <v-spacer></v-spacer>
                    <v-col cols="auto">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <PageTitleCreateButton v-bind="activatorProps" title="form.assignAssets">
                                </PageTitleCreateButton>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <AssignAssetsDialogForEmployee :employeeId="route.params.id.toString()"
                                    :dialogClose="() => { isActive.value = false }"
                                    @create-item="assetsListForEmployee.unshift($event)" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row style="height: 50vh;">
            <v-col class="fill-height">
                <Datatable :data="assetsListForEmployee" :header="tableHeader" :loading="loading"
                    :enable-items-per-page-dropdown="false" :checkbox-enabled="false">
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
    </v-col>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { formatterDate } from "@/core/helpers/dateUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import AssignAssetsDialogForEmployee from "@/components/dialogs/assets/AssignAssetsDialogForEmployee.vue";
import { useAssetsStore } from "@/stores/assetsStores/assetsStore";
import type { AssetsForEmployeeDto } from "@/models/entities/assets/AssetsModels";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const route = useRoute();
const { assetsListForEmployee, loading } = storeToRefs(useAssetsStore());
useAssetsStore().getAssetsForEmployee({ employeeId: route.params.id.toString() })

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