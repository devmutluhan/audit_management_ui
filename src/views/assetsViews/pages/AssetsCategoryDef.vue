<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc"></SearchInput>
            </v-col> -->
            <PageTitleTeleport>
                <template v-slot:component>
                    <CreatedNameCommandPage :createFunc="createAssetsCategory" :loading="buttonLoading" />
                </template>
            </PageTitleTeleport>
            <ListNameCommandPage :tableData="assetCategories.items ?? []" :menuItems="menuItems" :loading="loading"
                :searchValue="searchValue" />
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import CreatedNameCommandPage from "@/components/justNameCreatedPage/CreatedNameCommandPage.vue";
import ListNameCommandPage from "@/components/justNameCreatedPage/ListNameCommandPage.vue";
import { ref } from "vue";
import type { ApiResult, NameCommand, PaginatedList } from "@/models/ApiResult";
import type { GeneralDropdownType } from "@/models/types";
import type { LookupDto } from "@/models/ApiResult";
import { storeToRefs } from "pinia";
import { catchError } from "@/core/helpers/generalResponse";
import { useAssetsStore } from "@/stores/assetsStores/assetsStore";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import SearchInput from "@/components/formInput/readyInput/SearchInput.vue";

const { assetCategories, loading } = storeToRefs(useAssetsStore())

const buttonLoading = ref(false);
useAssetsStore().getAssetsCategories({ pageSize: 100, pageNumber: 1 });
assetCategories.value = {} as PaginatedList<LookupDto>

const createAssetsCategory = (command: NameCommand) => {
    buttonLoading.value = true;
    useAssetsStore().createAssetCategory(command).then((res: ApiResult<string>) => {
        assetCategories.value.items?.unshift({
            id: res.data,
            name: command.name
        });
    }).catch((error) => {
        return catchError(error, () => createAssetsCategory(command));
    }).finally(() => {
        buttonLoading.value = false;
    });
}

const searchValue = ref("");
const searchFunc = (searchName: string) => {
    searchValue.value = searchName;
}

const deleteFunc = (data: LookupDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useAssetsStore().deleteAssetCategory(data.id).then(() => {
        assetCategories.value.items = assetCategories.value.items?.filter(x => x.id !== data.id) ?? [];
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
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