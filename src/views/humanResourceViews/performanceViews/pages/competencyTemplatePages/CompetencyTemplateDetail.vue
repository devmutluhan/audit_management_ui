<template>
    <v-container fluid class="h-100 pa-6">
        <v-card :border="false" v-if="loading || !competencyTemplateDetail"
            class="h-100 d-flex align-center justify-center w-100 fill-height bg-transparent">
            <v-progress-circular indeterminate color="deep-purple" size="64"></v-progress-circular>
        </v-card>

        <div v-else>
            <div class="d-flex justify-space-between align-start mb-8">
                <div>
                    <div class="d-flex align-center mb-1">
                        <h1 class="text-h4 font-weight-bold mr-4">
                            {{ competencyTemplateDetail.title }}
                        </h1>

                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-chip v-bind="props"
                                    :color="competencyTemplateDetail.status === PerformanceTemplateStatus.Active ? 'success' :
                                        competencyTemplateDetail.status === PerformanceTemplateStatus.Archived ? 'grey' : 'warning'"
                                    variant="flat" label size="small" class="font-weight-bold text-uppercase">
                                    {{
                                        competencyTemplateDetail.status === PerformanceTemplateStatus.Active ?
                                            $t('enums.Active') :
                                            competencyTemplateDetail.status === PerformanceTemplateStatus.Archived ?
                                                $t('enums.Archived') :
                                                $t('enums.Draft')
                                    }}
                                </v-chip>
                            </template>

                            <v-card color="dropdownCard" v-if="filterMenuItems().length > 0">
                                <v-card-text>
                                    <v-list>
                                        <v-list-item class="bg-dropdownCard" v-for="(item, index) in filterMenuItems()"
                                            :key="index" :value="index" @click="item.action ? item.action() : null">
                                            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-menu>
                    </div>
                    <div class="text-subtitle-1 mt-1" style="max-width: 800px;">
                        {{ competencyTemplateDetail.description || '--' }}
                    </div>
                </div>

                <v-btn v-if="competencyTemplateDetail.status == PerformanceTemplateStatus.Draft" color="deep-purple"
                    size="large" variant="flat" class="text-none px-6" rounded="lg" prepend-icon="mdi-pencil"
                    @click="router.push({ name: 'competency-template-update', params: { id: route.params.id } })">
                    {{ $t('general.edit') }}
                </v-btn>
            </div>

            <v-row class="mb-8">
                <v-col cols="12" md="4">
                    <v-card class="py-4 px-2 h-100 d-flex align-center" rounded="xl" border>
                        <v-avatar color="deep-purple-lighten-5" size="56" class="ml-4 mr-4">
                            <v-icon size="32" color="deep-purple">mdi-account-school</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-caption text-grey font-weight-bold text-uppercase">
                                {{ $t('form.templateType') }}
                            </div>
                            <div class="text-h6 font-weight-black">
                                {{ $t('form.competencyBased') }}
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card class="py-4 px-2 h-100 d-flex align-center" rounded="xl" border>
                        <v-avatar color="blue-lighten-5" size="56" class="ml-4 mr-4">
                            <v-icon size="32" color="blue">mdi-folder-multiple</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-caption font-weight-bold text-grey text-uppercase">{{
                                $t('form.competencyGroup') }}
                            </div>
                            <div class="text-h6 font-weight-black">
                                {{ competencyTemplateDetail.groups?.length || 0 }} {{ $t('enums.Piece') }}
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="4">
                    <v-card class="py-4 px-2 h-100 d-flex align-center" rounded="xl" border>
                        <v-avatar color="teal-lighten-5" size="56" class="ml-4 mr-4">
                            <v-icon size="32" color="teal">mdi-playlist-check</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-caption font-weight-bold text-grey text-uppercase">
                                {{ $t('form.totalCompetency') }}
                            </div>
                            <div class="text-h6 font-weight-black text-teal">
                                {{ totalCompetencies }} {{ $t('enums.Piece') }}
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <h2 class="text-h6 font-weight-bold text-grey-darken-2 mb-4 d-flex align-center">
                <v-icon class="mr-2" color="deep-purple">mdi-view-grid-outline</v-icon>
                {{ $t('general.details') }}
            </h2>

            <v-row>
                <v-col cols="12" md="6" v-for="(group, gIndex) in competencyTemplateDetail.groups" :key="group.id">
                    <v-card class="h-100 d-flex flex-column border-card" rounded="xl">
                        <div class="pa-5 d-flex justify-space-between align-start bg-competencyColor">
                            <div class="d-flex align-start">
                                <v-sheet color="deep-purple" width="4" height="32"
                                    class="mr-4 rounded-pill mt-1"></v-sheet>
                                <div>
                                    <div class="text-overline text-deep-purple font-weight-bold mb-0">
                                        {{ $t('general.group') }} #{{ gIndex + 1 }}
                                    </div>
                                    <div class="text-h6 font-weight-bold text-grey-darken-3" style="line-height: 1.2;">
                                        {{ group.groupName }}
                                    </div>
                                </div>
                            </div>
                            <div class="text-center ml-2">
                                <v-chip color="deep-purple" variant="flat" size="small" class="font-weight-bold">
                                    {{enumToArray(RaterRelationTypeEnum).find((a) => a.value ==
                                        group.relationType)?.title}}
                                </v-chip>
                            </div>
                        </div>

                        <v-divider></v-divider>

                        <v-card-text class="flex-grow-1 pa-4">
                            <div v-if="group.competencies?.length > 0">
                                <div class="d-flex flex-column gap-3">
                                    <div v-for="(comp, cIndex) in group.competencies" :key="comp.id"
                                        class="pa-4 rounded-lg border-dashed">

                                        <div class="d-flex justify-space-between align-start mb-2">
                                            <span class="text-subtitle-1 font-weight-bold  pr-2">
                                                {{ comp.name }}
                                            </span>

                                            <div
                                                class="d-flex align-center px-2 py-1 rounded border text-caption font-weight-bold text-no-wrap">
                                                <span class="">{{ $t('form.score') }}:</span>
                                                <span class="mx-1 text-deep-purple">{{ comp.minScore }}</span>
                                                <v-icon size="x-small" color="grey">mdi-arrow-right</v-icon>
                                                <span class="mx-1 text-deep-purple">{{ comp.maxScore }}</span>
                                            </div>
                                        </div>

                                        <div class="text-body-2 ">
                                            {{ comp.description ?? '--' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-6">
                                <v-icon size="large" class="mb-2">mdi-playlist-remove</v-icon>
                                <div class="text-caption">
                                    {{ $t('form.noDataGroupCompetency') }}
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ConfirmModalType, GeneralDropdownType } from '@/models/types';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { RaterRelationTypeEnum, PerformanceTemplateStatus } from '@/models/custom/EnumTypes';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { catchError } from '@/core/helpers/generalResponse';
import { enumToArray } from '@/core/helpers/enumToArray';

// --- Setup ---
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { competencyTemplateDetail } = storeToRefs(usePerformanceDtoStore());
const loading = ref(true);

// --- Lifecycle ---
onMounted(() => {
    getCompetencyTemplateDetail();
});

const getCompetencyTemplateDetail = () => {
    loading.value = true;
    usePerformanceDtoStore().getCompetencyTemplateDetail(route.params.id.toString())
        .finally(() => {
            loading.value = false;
        });
}

// --- Computed Properties ---
const totalCompetencies = computed(() => {
    if (!competencyTemplateDetail.value?.groups) return 0;
    return competencyTemplateDetail.value.groups.reduce((acc, group) => acc + (group.competencies?.length || 0), 0);
});

const confirmModalValue = ref(new ConfirmModalType());
const confirmDialog = ref(false);
const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.archive",
        action: () => {
            confirmDialog.value = true;
            confirmModalValue.value = {
                text: "general.archiveDescription",
                buttonLoading: false,
                action: () => {
                    confirmModalValue.value.buttonLoading = true
                    usePerformanceCommandStore().archiveCompetencyTemplate(competencyTemplateDetail.value.id).then(() => {
                        competencyTemplateDetail.value.status = PerformanceTemplateStatus.Archived;
                        confirmDialog.value = false;
                    }).catch((error) => {
                        return catchError(error, () => { confirmModalValue.value.action })
                    }).finally(() => {
                        confirmModalValue.value.buttonLoading = false
                    });
                }
            }
        }
    },
    {
        id: 2,
        title: "general.activate",
        action: () => {
            confirmDialog.value = true;
            confirmModalValue.value = {
                text: "general.activateDescription",
                buttonLoading: false,
                action: () => {
                    confirmModalValue.value.buttonLoading = true
                    usePerformanceCommandStore().activateCompetencyTemplate(competencyTemplateDetail.value.id).then(() => {
                        competencyTemplateDetail.value.status = PerformanceTemplateStatus.Active;
                        confirmDialog.value = false;
                    }).catch((error) => {
                        return catchError(error, () => { confirmModalValue.value.action })
                    }).finally(() => {
                        confirmModalValue.value.buttonLoading = false
                    });
                }
            }
        }
    }
]);

const filterMenuItems = (): GeneralDropdownType[] => {
    if (competencyTemplateDetail.value.status == PerformanceTemplateStatus.Draft) {
        return menuItems.value;
    } else {
        return new Array<GeneralDropdownType>();
    }
}
</script>

<style scoped>
.gap-3 {
    gap: 12px;
}

.border-dashed {
    border: 1px dashed #e0e0e0;
    transition: all 0.2s ease;
}
</style>