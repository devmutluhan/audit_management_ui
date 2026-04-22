<template>
    <v-card :border="false">
        <v-card-text v-if="!loading">
            <v-row class="d-flex align-center">
                <v-col cols="auto" class="pr-0 cursor-pointer" @click="emits('currentStep')">
                    <v-icon color="pageTitleColor" size="35">mdi-chevron-left</v-icon>
                </v-col>
                <v-col cols="auto" class="pl-1 cursor-pointer text-subtitle-1 font-weight-bold text-pageTitleColor"
                    @click="emits('currentStep')">
                    <p class="text-h6 font-weight-bold text-pageTitleColor ma-0">{{ selectedCategory.name }}</p>
                    <p class="text-subtitle-2 ma-0 text-breadcrumbsColor">{{ selectedCategory.description }}</p>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <PageTitleCreateButton title="general.addDocumentDefinition" v-bind="activatorProps">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <AddDocumentChildDialog :dialogClose="() => { isActive.value = false }"
                                @createItem="initTableData.unshift($event)" @goBack="emits('currentStep')" />
                        </template>
                    </VDialogContent>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="6">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-row v-if="initTableData.length > 0">
                        <v-col cols="12" sm="6" md="4" lg="2" v-for="definition in initTableData" :key="definition.id">
                            <v-card class="h-100">
                                <v-card-text>
                                    <v-row>
                                        <v-col>
                                            <span v-if="definition.isRequired"
                                                class="d-inline-flex align-center text-error text-caption font-weight-bold text-no-wrap px-2">
                                                <v-icon start icon="mdi-asterisk" size="x-small" class="mr-1"></v-icon>
                                                {{ $t('general.requiredDocument') }}
                                            </span>
                                            <span v-if="definition.hasExpiration"
                                                class="d-inline-flex align-center text-warning text-caption font-weight-bold text-no-wrap px-2">
                                                <v-icon start icon="mdi-clock-outline" size="x-small"
                                                    class="mr-1"></v-icon>
                                                {{ $t('general.hasExpiration') }}
                                            </span>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col cols="auto" class="px-0">
                                            <GeneralDropdown :data="definition" :menuItems="menuItems" />
                                        </v-col>
                                    </v-row>
                                    <v-row class="d-flex justify-center">
                                        <v-col cols="12" align="center">
                                            <v-icon src="/media/files/folder-document.svg" color="cancelButtonColor"
                                                size="80">mdi-file-document-outline</v-icon>
                                        </v-col>
                                        <v-col cols="12" align="center">
                                            <p class="ma-0 text-h6 font-weight-bold text-warning">
                                                {{ definition.name }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <NoDataCard></NoDataCard>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
        <VDialogContent v-model="updateDefinitionDialog">
            <UpdateDocumentChildDialog :selectedItem="selectedDefinitionItem"
                :dialogClose="() => { updateDefinitionDialog = false }" />
        </VDialogContent>
    </v-card>
</template>

<script setup lang="ts">
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { clientFilter } from '@/core/helpers/generalUtils';
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { DocumentCategoryDto, DocumentDefinitionDto } from '@/models/entities/humanResource/DocumentModels';
import type { GeneralDropdownType } from '@/models/types';
import { useDocumentStore } from '@/stores/humanResourcesStores/documentStore';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NoDataCard from '@/components/list/cards/NoDataCard.vue';
import AddDocumentChildDialog from '@/components/dialogs/humanResources/AddDocumentChildDialog.vue';
import UpdateDocumentChildDialog from '@/components/dialogs/humanResources/UpdateDocumentChildDialog.vue';
import PageTitleCreateButton from '@/components/formInput/generalInputs/PageTitleCreateButton.vue';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const emits = defineEmits(['currentStep'])
const route = useRoute();

const { categoryList, definitionList, loading } = storeToRefs(useDocumentStore());
const selectedCategory = ref(new DocumentCategoryDto());

watch(() => route.query.id, (newValue) => {
    if (newValue) {
        getDefinitions();
    }
})

watch(() => categoryList.value, (newValue) => {
    if (newValue) {
        selectedCategory.value = categoryList.value.find((a) => a.id == route.query.id?.toString()) ?? new DocumentCategoryDto()
    }
}, { deep: true })

const getDefinitions = () => {
    if (route.query.id) {
        selectedCategory.value = categoryList.value.find((a) => a.id == route.query.id?.toString()) ?? new DocumentCategoryDto()
        useDocumentStore().getDocumentDefinitions(route.query.id.toString());
    } else {
        emits('currentStep')
    }
}

onMounted(() => {
    getDefinitions();
    initTableData.value = definitionList.value;
})

watch(() => definitionList.value.length, () => {
    initTableData.value = definitionList.value
})

const initTableData = ref(new Array<DocumentDefinitionDto>())
const selectedDefinitionItem = ref(new DocumentDefinitionDto());
const updateDefinitionDialog = ref(false);
const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(definitionList.value, 'name', searchName);
    } else {
        initTableData.value = definitionList.value
    }
}

const deleteDefinitionFunc = (data: DocumentDefinitionDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';

    useDocumentStore().deleteDefinition(data.id).then(() => {
        definitionList.value = definitionList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteDefinitionFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (data: DocumentDefinitionDto) => {
            selectedDefinitionItem.value = data;
            updateDefinitionDialog.value = true;
        },
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteDefinitionFunc,
        },
    },
]);
</script>