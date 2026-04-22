<template>
    <v-card :border="false">
        <PageTitleTeleport>
            <template v-slot:component>
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <PageTitleCreateButton title="general.createDocumentCategory" v-bind="activatorProps">
                        </PageTitleCreateButton>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddDocumentCategoryDialog :dialogClose="() => { isActive.value = false }"
                            @createItem="initTableData.unshift($event)" />
                    </template>
                </VDialogContent>
            </template>
        </PageTitleTeleport>
        <v-card-text v-if="!loading">
            <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col>
            <v-row v-if="initTableData.length > 0">
                <v-col cols="12" sm="6" md="4" lg="2" v-for="category in initTableData" :key="category.id">
                    <v-card @click="emits('currentStep', category)">
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-chip :color="category.isActive ? 'success' : 'error'" class="font-weight-bold">
                                        {{ category.isActive ? $t('general.isActive') : $t('general.passive') }}
                                    </v-chip>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" class="px-0">
                                    <GeneralDropdown :data="category" :menuItems="menuItems" />
                                </v-col>
                            </v-row>
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-img src="/media/files/folder-document.svg" height="80"></v-img>
                                </v-col>
                                <v-col cols="12" align="center">
                                    <p class="ma-0 text-h6 font-weight-bold text-warning">{{ category.name }}</p>
                                    <p class="ma-0 text-body-1 text-headerTextColor">{{ category.description }}</p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <NoDataCard></NoDataCard>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
    </v-card>
    <VDialogContent v-model="updateDialog">
        <UpdateDocumentCategoryDialog :selectedItem="selectedItem" :dialogClose="() => { updateDialog = false }" />
    </VDialogContent>
</template>

<script lang="ts" setup>

import { ref, watch } from "vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from "@/models/types";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';

import { catchError } from "@/core/helpers/generalResponse";
import { storeToRefs } from "pinia";
import { clientFilter } from "@/core/helpers/generalUtils";
import { onMounted } from "vue";
import AddDocumentCategoryDialog from "@/components/dialogs/humanResources/AddDocumentCategoryDialog.vue";
import UpdateDocumentCategoryDialog from "@/components/dialogs/humanResources/UpdateDocumentCategoryDialog.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { useDocumentStore } from "@/stores/humanResourcesStores/documentStore";
import { DocumentCategoryDto } from "@/models/entities/humanResource/DocumentModels";
import NoDataCard from "@/components/list/cards/NoDataCard.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

const { categoryList, loading } = storeToRefs(useDocumentStore());
const emits = defineEmits(['currentStep'])

useDocumentStore().getDocumentCategories()

const selectedItem = ref(new DocumentCategoryDto());
const updateDialog = ref(false);

const initTableData = ref(new Array<DocumentCategoryDto>())

onMounted(() => {
    initTableData.value = categoryList.value;
})

watch(() => categoryList.value.length, () => {
    initTableData.value = categoryList.value
})

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(categoryList.value, 'name', searchName);
    } else {
        initTableData.value = categoryList.value
    }
}

const deleteFunc = (data: DocumentCategoryDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useDocumentStore().deleteCategory(data.id).then(() => {
        categoryList.value = categoryList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: DocumentCategoryDto) => {
            selectedItem.value = item
            updateDialog.value = true
        },
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