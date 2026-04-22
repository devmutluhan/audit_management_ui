<template>
    <v-card :border="false">
        <v-card-text v-if="!loading">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props }">
                            <PageTitleCreateButton title="general.createPositionPrice" v-bind="props">
                            </PageTitleCreateButton>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <AddPositionPriceDialog :dialogClose="() => { isActive.value = false }"
                                @createItem="addPositionPrice" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <VuetifyTable :data="initTableData" :headers="tableHeader" :group-by="groupBy">
                        <template v-slot:currency="{ row: data }">
                            {{ data.currency.code }}
                        </template>
                        <template v-slot:isPassive="{ row: data }">
                            <v-chip :color="data.isPassive ? 'error' : 'success'">
                                {{ data.isPassive ? $t('general.passive') : $t('general.isActive') }}
                            </v-chip>
                        </template>
                        <template v-slot:costPrice="{ row: data }">
                            {{ formatterPriceForCurrencyName(data.costPrice, data.currency.code) }}
                        </template>
                        <template v-slot:sellPrice="{ row: data }">
                            {{ formatterPriceForCurrencyName(data.sellPrice, data.currency.code) }}
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </VuetifyTable>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
    </v-card>
    <VDialogContent v-model="updateDialog">
        <UpdatePositionPriceDialog :dialogClose="() => { updateDialog = false }" :selectedItem="selectedItem" />
    </VDialogContent>
    <VDialogContent v-model="historyDialog" width="600">
        <ViewPositionPriceHistoryDialog :dialogClose="() => { historyDialog = false }" :selectedItem="selectedItem" />
    </VDialogContent>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from "@/models/types";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { clientFilter, formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";
import { formatterDate } from "@/core/helpers/dateUtils";
import AddPositionPriceDialog from "@/components/dialogs/crm/AddPositionPriceDialog.vue";
import { storeToRefs } from "pinia";
import { useCrmServiceStore } from "@/stores/crmStores/crmServiceStore";
import VuetifyTable from "@/components/kt-datatable/VuetifyTable.vue";
import UpdatePositionPriceDialog from "@/components/dialogs/crm/UpdatePositionPriceDialog.vue";
import ViewPositionPriceHistoryDialog from "@/components/dialogs/crm/ViewPositionPriceHistoryDialog.vue";
import type { PositionPriceDto } from "@/models/entities/crm/CrmServiceDtos";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

const groupBy = ref([{ key: 'positionName' }]);

const { positionPriceList, loading } = storeToRefs(useCrmServiceStore())
useCrmServiceStore().getPositionPriceList();

const selectedItem = ref({} as any);
const updateDialog = ref(false);
const historyDialog = ref(false)

const tableHeader = ref([
    {
        title: 'form.validityDate',
        key: "validityDate",
        sortable: true,
        valueFormatter: (value: PositionPriceDto) => {
            return formatterDate(value.validityDate)
        },
    },
    {
        title: 'list.currency',
        key: "currency",
        sortable: true
    },
    {
        title: 'general.activeOrPassive',
        key: "isPassive",
        sortable: true
    },
    {
        title: 'list.costPrice',
        key: "costPrice",
        sortable: true
    },
    {
        title: 'list.salePrice',
        key: "sellPrice",
        sortable: true
    },
    {
        title: 'list.actions',
        key: "actions",
        columnWidth: 135,
    }
])

const initTableData = ref([] as any)

watch(() => positionPriceList.value, () => {
    initTableData.value = positionPriceList.value;
});

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(positionPriceList.value, 'positionName', searchName);
    } else {
        initTableData.value = positionPriceList.value
    }
}

const addPositionPrice = (event: Array<any>) => {
    event.forEach((a) => {
        positionPriceList.value.push(a)
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.history",
        action: (item) => {
            historyDialog.value = true;
            selectedItem.value = item
        }
    },
    {
        title: "general.update",
        action: (item) => {
            updateDialog.value = true;
            selectedItem.value = item
        }
    },
]);

</script>