<template>
    <Datatable :data="tableData?.items ?? []" :header="tableHeader" :enable-items-per-page-dropdown="true"
        :loading="loading" :currentPage="tableData.pageNumber" :total="tableData.totalCount"
        @on-items-per-page-change="emits('on-items-per-page-change', $event)"
        @page-change="emits('page-change', $event)">
        <template v-slot:status="{ row: data }">
            <v-chip :color="data.status == AssetStatusEnum.Available ? 'success' :
                data.status == AssetStatusEnum.Assigned ? 'primary' :
                    data.status == AssetStatusEnum.Retired ? 'error' : 'gray'" class="font-weight-bold">
                {{enumToArray(AssetStatusEnum).find((a) => a.value == data.status)?.title}}
            </v-chip>
        </template>
        <template v-slot:actions="{ row: data }" v-if="menuItems && hasClaimOrModules(['ManageAsset'])">
            <GeneralDropdown :data="data" :menuItems="filterMenuItems(data)">
            </GeneralDropdown>
        </template>
    </Datatable>
    <VDialogContent v-model="updateDialog">
        <template v-slot:default>
            <UpdateAssetsDialog :dialogClose="() => { updateDialog = false }" :selectedItem="selectedItem" />
        </template>
    </VDialogContent>
    <VDialogContent v-model="assignAssetDialog">
        <template v-slot:default>
            <AssignAssetsDialog :dialogClose="() => { assignAssetDialog = false }" :selectedItem="selectedItem" />
        </template>
    </VDialogContent>
    <v-dialog v-model="returnAssetDialog" width="800">
        <template v-slot:default>
            <ReturnAssetsDialog :dialogClose="() => { returnAssetDialog = false }" :selectedItem="selectedItem" />
        </template>
    </v-dialog>
    <v-dialog v-model="previewHistoryDialog" width="800">
        <template v-slot:default>
            <PreviewAssetsHistoryDialog :dialogClose="() => { previewHistoryDialog = false }"
                :selectedItem="selectedItem" />
        </template>
    </v-dialog>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { onMounted, ref } from "vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import type { PaginatedList } from "@/models/ApiResult";
import { mountComponentForFilter } from "@/core/data/readyFilterColumnObject";
import { useAssetsStore } from "@/stores/assetsStores/assetsStore";
import { AssetsDto } from "@/models/entities/assets/AssetsModels";
import { useRouter } from "vue-router";
import { catchError } from "@/core/helpers/generalResponse";
import UpdateAssetsDialog from "@/components/dialogs/assets/UpdateAssetsDialog.vue";
import AssignAssetsDialog from "@/components/dialogs/assets/AssignAssetsDialog.vue";
import { enumToArray } from "@/core/helpers/enumToArray";
import { AssetStatusEnum } from "@/models/custom/EnumTypes";
import ReturnAssetsDialog from "@/components/dialogs/assets/ReturnAssetsDialog.vue";
import PreviewAssetsHistoryDialog from "@/components/dialogs/assets/PreviewAssetsHistoryDialog.vue";

const router = useRouter();

const emits = defineEmits(['deleteAssets', 'on-items-per-page-change', 'page-change']);

const props = defineProps<{
    tableData: PaginatedList<AssetsDto>;
    loading: boolean;
}>();

const updateDialog = ref(false);
const assignAssetDialog = ref(false);
const returnAssetDialog = ref(false);
const previewHistoryDialog = ref(false);
const selectedItem = ref(new AssetsDto());

const deleteFunc = (data: AssetsDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useAssetsStore().deleteAssets(data.id).then(() => {
        emits('deleteAssets', data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        }
    },
    {
        id: 2,
        title: "general.update",
        action: (data: AssetsDto) => {
            selectedItem.value = data;
            updateDialog.value = true;
        }
    },
    {
        id: 3,
        title: "general.assignToAsset",
        action: (data: AssetsDto) => {
            selectedItem.value = data;
            assignAssetDialog.value = true;
        }
    },
    {
        id: 4,
        title: "general.returnToAsset",
        action: (data: AssetsDto) => {
            selectedItem.value = data;
            returnAssetDialog.value = true;
        }
    },
    {
        id: 5,
        title: "general.previewAssetsHistory",
        action: (data: AssetsDto) => {
            selectedItem.value = data;
            previewHistoryDialog.value = true;
        }
    },

]);

const filterMenuItems = (data: AssetsDto) => {
    if (data.status == AssetStatusEnum.Assigned) {
        return menuItems.value.filter((a) => a.id == 4 || a.id == 5 || a.id == 1);
    } else if (data.status == AssetStatusEnum.Available) {
        return menuItems.value.filter((a) => a.id != 4);
    } else {
        return menuItems.value.filter((a) => a.id == 1 || a.id == 2 || a.id == 5);
    }
}

onMounted(() => {
    mountComponentForFilter(tableHeader.value);
})

const tableHeader = ref([
    {
        columnName: 'list.serialNumber',
        columnLabel: "serialNumber",
        columnWidth: 175
    },
    {
        columnName: 'list.status',
        columnLabel: "status",
        columnWidth: 175
    },
    {
        columnName: 'form.category',
        columnLabel: "assetCategoryName",
        columnWidth: 175
    },
    {
        columnName: 'list.brand',
        columnLabel: "brand",
        columnWidth: 175
    },
    {
        columnName: 'list.model',
        columnLabel: "model",
        columnWidth: 175
    },
    {
        columnName: 'list.description',
        columnLabel: "description",
        columnWidth: 175
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
        visible: hasClaimOrModules(['ManageAsset'])
    }
]);

</script>