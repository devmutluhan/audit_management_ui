<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton title="general.addNew" @clicked="dialog = true">
                    </PageTitleCreateButton>
                    <VDialogContent v-model="dialog">
                        <CreateOrUpdateTaxOfficeDialog :dialogClose="() => { dialog = false; isUpdated = false }"
                            :updateItem="updateItem" :isUpdated="isUpdated" />
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <!-- <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row> -->
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="initTableData" :header="tableHeader" :loading="loading"
                        :enable-items-per-page-dropdown="true" :isHeadRowFilter="true">
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
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { useTaxStore } from "@/stores/generalStores/taxStore";
import type { GeneralDropdownType } from "@/models/types";
import { storeToRefs } from "pinia"
import { catchError } from "@/core/helpers/generalResponse";
import CreateOrUpdateTaxOfficeDialog from "@/components/dialogs/customer/CreateOrUpdateTaxOfficeDialog.vue";
import { TaxOfficeDto } from "@/models/entities/general/GeneralDtos";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import { activeClientFilters, clientFilterList, codeFilterText, mountComponentForClientFilter, nameFilterText } from "@/core/data/readyClientFilterColumnObject";

const dialog = ref(false)
const taxStore = useTaxStore();
const { taxOfficeList, loading } = storeToRefs(taxStore);

taxOfficeList.value = new Array<TaxOfficeDto>()

const tableHeader = ref([
    codeFilterText,
    nameFilterText,
    {
        columnName: 'list.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
]);

taxStore.getTaxOfficeList();

const isUpdated = ref(false);
const updateItem = ref(new TaxOfficeDto());

const initTableData = ref(new Array<TaxOfficeDto>());

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    taxStore.deleteTaxOffice(data.id).then(() => {
        taxOfficeList.value = taxOfficeList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
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
            buttonLoading: false,
            action: deleteFunc,
        },
    },
]);

watch(() => taxOfficeList.value.length, () => {
    initTableData.value = taxOfficeList.value
});

mountComponentForClientFilter(tableHeader.value);
watch(() => activeClientFilters.value.length, () => {
    initTableData.value = clientFilterList(taxOfficeList.value)
})

</script>