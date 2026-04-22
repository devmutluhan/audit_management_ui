<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <PageTitleCreateButton @clicked="createDialog = true"></PageTitleCreateButton>
                    <VDialogContent v-model="createDialog">
                        <CreateExpenseCategoryDialog :dialogClose="() => { createDialog = false; }"
                            :updateItem="createDialog" />
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col> -->
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
        <VDialogContent v-model="updateDialog">
            <UpdateExpenseCategory :dialogClose="() => { updateDialog = false }" :selectedItem="selectedItem"
                @createItem="updateItem($event)" />
        </VDialogContent>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from "@/models/types";
import { storeToRefs } from "pinia"
import { useExpenseStore } from "@/stores/humanResourcesStores/expenseStore";
import { ExpenseCategoryDto, UpdateExpenseCategoryCommand } from "@/models/entities/humanResource/ExpenseCommands";
import UpdateExpenseCategory from "@/components/dialogs/humanResources/UpdateExpenseCategory.vue";
import SearchInput from "@/components/formInput/readyInput/SearchInput.vue";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import CreateExpenseCategoryDialog from "@/components/dialogs/humanResources/CreateExpenseCategoryDialog.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import { activeClientFilters, clientFilterList, descriptionFilterText, mountComponentForClientFilter, titleFilterText } from "@/core/data/readyClientFilterColumnObject";

const updateDialog = ref(false)
const createDialog = ref(false)
const expenseStore = useExpenseStore();
const { expenseCategoryList, loading } = storeToRefs(expenseStore);
expenseCategoryList.value = new Array<ExpenseCategoryDto>();
const initTableData = ref(new Array<ExpenseCategoryDto>());

const selectedItem = ref(new ExpenseCategoryDto())
const tableHeader = ref([
    titleFilterText,
    descriptionFilterText,
    {
        columnName: 'list.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])
expenseStore.getExpenseCategoryList({ pageSize: 1000, pageNumber: 1 })


watch(() => expenseCategoryList.value.length, () => {
    initTableData.value = expenseCategoryList.value
});

mountComponentForClientFilter(tableHeader.value);
watch(() => activeClientFilters.value.length, () => {
    initTableData.value = clientFilterList(expenseCategoryList.value)
})

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    expenseStore.deleteExpenseCategory(data.id).then(() => {
        const index = expenseCategoryList.value.findIndex((a) => a.id == data.id);
        if (index != -1)
            expenseCategoryList.value.splice(index, 1)
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const updateItem = (item: UpdateExpenseCategoryCommand) => {
    const index = expenseCategoryList.value.findIndex((a) => a.id == item.id);
    if (index != -1) {
        expenseCategoryList.value[index] = item
    }
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: ExpenseCategoryDto) => {
            selectedItem.value = item
            updateDialog.value = true
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

</script>