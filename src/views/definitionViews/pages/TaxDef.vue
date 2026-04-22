<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton title="general.createTax" @clicked="dialog = true"></PageTitleCreateButton>
                    <VDialogContent v-model="dialog">
                        <template v-slot:default>
                            <UpdateOrCreateTaxDialog :dialogClose="() => { dialog = false; isUpdated = false }"
                                :updateItem="updateItem" :isUpdated="isUpdated" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col> -->
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="initTableData" :header="tableHeader" :enable-items-per-page-dropdown="true"
                        :loading="loading" :isHeadRowFilter="true">
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { TaxTypeEnum } from "@/models/custom/EnumTypes";
import { enumToArray } from "@/core/helpers/enumToArray";
import { useTaxStore } from "@/stores/generalStores/taxStore";
import { storeToRefs } from "pinia"
import type { GeneralDropdownType } from "@/models/types";
import { catchError } from "@/core/helpers/generalResponse";
import { TaxDto } from "@/models/entities/general/GeneralDtos";
import UpdateOrCreateTaxDialog from "@/components/dialogs/definitions/UpdateOrCreateTaxDialog.vue";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { clientFilter } from "@/core/helpers/generalUtils";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import { activeClientFilters, clientFilterList, mountComponentForClientFilter, nameFilterText, taxRateFilter, taxTypeEnumFilter } from "@/core/data/readyClientFilterColumnObject";

const taxStore = useTaxStore();
const { taxList, loading } = storeToRefs(taxStore);
taxList.value = new Array<TaxDto>();
const buttonLoading = ref(false);

const tableHeader = ref([
    nameFilterText,
    taxTypeEnumFilter,
    taxRateFilter,
    {
        columnName: 'list.taxFormula',
        columnLabel: "formula",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: any) => {
            return value.formula == '' ? '-' : value.formula;
        }
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])

taxStore.getTaxList({ pageNumber: 1, pageSize: 1000 })

const isUpdated = ref(false);
const dialog = ref(false);
const updateItem = ref(new TaxDto());

const initTableData = ref(new Array<TaxDto>());

watch(() => taxList.value.length, () => {
    initTableData.value = taxList.value
});

mountComponentForClientFilter(tableHeader.value);
watch(() => activeClientFilters.value.length, () => {
    initTableData.value = clientFilterList(taxList.value)
})

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    taxStore.deleteTax(data.id).then(() => {
        taxList.value = taxList.value.filter(x => x.id !== data.id);

    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: any) => {
            isUpdated.value = true;
            dialog.value = true;
            updateItem.value = item;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: buttonLoading.value,
            action: deleteFunc,
        },
    },
]);


</script>