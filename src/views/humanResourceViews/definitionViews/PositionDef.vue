<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc"></SearchInput>
            </v-col> -->
            <PageTitleTeleport>
                <template v-slot:component>
                    <CreatedNameCommandPage :createFunc="createItem" :loading="buttonLoading" />
                </template>
            </PageTitleTeleport>
            <ListNameCommandPage :tableData="positionList" :menuItems="menuItems" :loading="loading"
                :searchValue="searchValue" />
            <UpdateNameCommandPageDialog v-model="updateDialog" :updateClick="updateItem" :selectedItem="selectedItem"
                :loading="buttonLoading" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CreatedNameCommandPage from "@/components/justNameCreatedPage/CreatedNameCommandPage.vue";
import ListNameCommandPage from "@/components/justNameCreatedPage/ListNameCommandPage.vue";
import { ref } from "vue";
import type { NameCommand } from "@/models/ApiResult";
import { useManagementCommandStore } from "@/stores/managementStores/managementCommandStore";
import { useManagementDtoStore } from "@/stores/managementStores/managementDtoStore";
import type { GeneralDropdownType } from "@/models/types";
import { LookupDto } from "@/models/ApiResult";
import type { ApiResult } from "@/models/ApiResult";
import { storeToRefs } from "pinia";
import UpdateNameCommandPageDialog from "@/components/justNameCreatedPage/UpdateNameCommandPageDialog.vue";
import { catchError } from "@/core/helpers/generalResponse";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import SearchInput from "@/components/formInput/readyInput/SearchInput.vue";

const { positionList, loading } = storeToRefs(useManagementDtoStore())
const buttonLoading = ref(false);
const updateDialog = ref(false);
const selectedItem = ref(new LookupDto())
positionList.value = new Array<LookupDto>();

useManagementDtoStore().getPositionList({
    pageNumber: 1,
    pageSize: 1000,
});

const createItem = (command: NameCommand) => {
    buttonLoading.value = true;
    useManagementCommandStore().createPosition(command).then((res: ApiResult<string>) => {
        positionList.value.unshift({
            id: res.data,
            name: command.name
        })
    }).catch((error) => {
        return catchError(error, () => createItem(command));
    }).finally(() => {
        buttonLoading.value = false;
    })
}

const updateItem = (command: NameCommand) => {
    buttonLoading.value = true;
    useManagementCommandStore().updatePosition(selectedItem.value.id, command).then((res: ApiResult<string>) => {
        const index = positionList.value.findIndex((a: LookupDto) => a.id == selectedItem.value.id);
        if (index != -1) {
            positionList.value[index] = { id: selectedItem.value.id, name: command.name }
        }
    }).catch((error) => {
        return catchError(error, () => updateItem(command));
    }).finally(() => {
        buttonLoading.value = false;
        updateDialog.value = false;
    })
}

const searchValue = ref('')
const searchFunc = (searchName: string) => {
    searchValue.value = searchName
}

const deleteFunc = (data: LookupDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useManagementCommandStore().deletePosition(data.id).then(() => {
        positionList.value = positionList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: LookupDto) => {
            updateDialog.value = true;
            selectedItem.value = item;
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