<template>
    <v-container fluid class="pa-0">
        <v-card class="pa-6" rounded="xl" v-if="periodReviewList.length == 0">
            <v-card-text v-if="!revieweeLoading">
                <v-row>
                    <v-col cols="12" align="center">
                        <v-avatar color="primary" size="80" variant="tonal" class="mb-4">
                            <v-icon icon="mdi-file-document-plus-outline" size="40" color="primary"></v-icon>
                        </v-avatar>
                    </v-col>
                    <v-col cols="12" class="py-0" align="center">
                        <p class="text-h5 font-weight-bold mb-2">
                            {{ $t('form.notAddedToPerformanceReviewTitle') }}
                        </p>
                        <p class="text-body-1 text-medium-emphasis mb-6">
                            {{ $t('form.notAddedToPerformanceReviewDesc') }}
                        </p>
                    </v-col>
                    <v-col cols="12" class="pt-0" align="center">
                        <v-btn color="primary" size="large" prepend-icon="mdi-plus"
                            @click="selectRevieweeDialog = true">
                            {{ $t('general.addPerformanceReview') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text v-else>
                <v-col cols="12">
                    <v-row>
                        <v-col cols="12" align="center">
                            <v-progress-circular :size="120" :width="13" color="purple"
                                indeterminate></v-progress-circular>
                        </v-col>
                    </v-row>
                </v-col>
            </v-card-text>
        </v-card>

        <v-card v-else rounded="xl">
            <v-toolbar class="d-flex align-center py-4 px-2" color="transparent" height="auto">
                <v-col cols="12">
                    <v-row class="d-flex align-center">
                        <v-col cols="12" sm="7">
                            <p class="text-h5 font-weight-bold mb-2 text-rowTextColor">
                                {{ $t('list.periodReviewList') }}
                                <v-chip size="small" color="primary" variant="flat" class="ml-2">
                                    {{ periodReviewList.length + ' ' + $t('enums.Piece') }}
                                </v-chip>
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" v-if="isUpdated">
                            <v-btn v-if="selectedIds.length > 0" class="mr-2" @click="removeRevieweesFunc()"
                                color="error" variant="outlined">
                                <v-icon color="error">mdi-delete-outline</v-icon>
                            </v-btn>
                            <v-btn @click="selectRevieweeDialog = true" variant="outlined" prepend-icon="mdi-plus">
                                {{ $t('general.addPerformanceReview') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-toolbar>
            <v-divider class="py-0 my-0"></v-divider>
            <v-card-text style="overflow: auto;" :style="isMobileDevice() ? { height: '70vh' } : { height: '60vh' }">
                <v-row>
                    <v-col cols="12">
                        <Datatable class="mt-4" :data="periodReviewList" :header="tableHeader" :checkboxEnabled="true"
                            :total="periodReviewList.length" @onItemsSelect="selectedIds = $event;"
                            :infiniteScroll="true" :currentlySelectedItems="selectedIds"
                            :enable-items-per-page-dropdown="true">
                            <template v-slot:reviewee="{ row: data }">
                                <div class="font-weight-medium text-body-2">{{ data.reviewee?.name }}</div>
                            </template>
                            <template v-slot:competency="{ row: data }">
                                <div class="text-body-2 text-medium-emphasis">
                                    {{ data.competency?.title ?? '--' }}
                                </div>
                            </template>
                            <template v-slot:manager="{ row: data }">
                                <div class="text-body-2 text-medium-emphasis">
                                    <v-icon icon="mdi-account-tie" size="small" class="mr-1"></v-icon>
                                    {{ data.manager?.name ?? '--' }}
                                </div>
                            </template>
                            <template v-slot:status="{ row: data }">
                                <v-chip v-if="!isUpdated" :color="getStatusColor(data.status)" size="small"
                                    variant="flat" class="font-weight-medium">
                                    {{enumToArray(ReviewStatusEnum).find((a) => a.value == data.status)?.title}}
                                </v-chip>
                                <v-chip v-else :color="getUpdatedChip(data).color" size="small" variant="flat"
                                    class="font-weight-medium">
                                    {{ $t(getUpdatedChip(data).text) }}
                                </v-chip>
                            </template>
                            <template v-slot:weight="{ row: data }">
                                <div class="d-flex flex-column gap-1">
                                    <div class="d-flex align-center text-caption text-blue-grey">
                                        <v-icon icon="mdi-target" size="x-small" class="mr-1"></v-icon>
                                        %{{ data.goalScoreWeight * 100 }} {{ ' ' + $t('form.goal') }}
                                    </div>
                                    <div class="d-flex align-center text-caption text-brown">
                                        <v-icon icon="mdi-star-circle-outline" size="x-small" class="mr-1"></v-icon>
                                        %{{ data.competencyScoreWeight * 100 }} {{ ' ' + $t('form.competency') }}
                                    </div>
                                </div>
                            </template>
                            <template v-slot:finalScore="{ row: data }">
                                <div style="width: 100px">
                                    <div class="d-flex justify-space-between text-caption mb-1">
                                        <strong>{{ data.finalScore ?? 0 }}</strong>
                                        <span class="text-grey">/ 100</span>
                                    </div>
                                    <v-progress-linear :model-value="data.finalScore"
                                        :color="getScoreColor(data.finalScore)" height="6" rounded></v-progress-linear>
                                </div>
                            </template>
                            <template v-slot:finalizedDate="{ row: data }">
                                <div v-if="data.finalizedDate" class="text-caption text-grey-darken-1">
                                    {{ formatterDate(data.finalizedDate) }}
                                </div>
                                <div v-else class="text-caption text-disabled font-italic">
                                    --
                                </div>
                            </template>
                            <template v-slot:actions="{ row: data }">
                                <GeneralDropdown :data="data" :menuItems="menuItems" />
                            </template>
                        </Datatable>
                    </v-col>
                </v-row>
            </v-card-text>
            <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
        </v-card>

        <v-col v-if="isUpdated">
            <v-row class="d-flex justify-center" v-if="periodReviewList.length > 0 && isContinueButtonVisible">
                <v-col cols="12" md="4">
                    <v-btn @click="emit('currentStep', 2)" size="x-large" block
                        :disabled="periodReviewList.length == 0">
                        {{ $t('general.continue') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="d-flex justify-center" v-if="periodReviewList.length > 0 && !isContinueButtonVisible">
                <v-col cols="12" md="4">
                    <v-btn @click="startGoalSetting()" size="x-large" color="confirmButtonColor" block>
                        {{ $t('general.startGoalSetting') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>

        <VDialogContent v-model="selectRevieweeDialog" width="1200">
            <AssignRevieweeWizardDialog :dialogClose="() => { selectRevieweeDialog = false }"
                :initialEmployeeList="initialEmployeeList" :periodReviewList="periodReviewList"
                @assignReviewees="assignReviewees($event)" />
        </VDialogContent>

    </v-container>
</template>

<script setup lang="ts">
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import type { EvaluationTemplateDto, ReviewSummaryDto } from '@/models/entities/humanResource/PerformanceDtos';
import { PeriodStatusType, ReviewStatusEnum } from '@/models/custom/EnumTypes';
import { computed, type PropType, ref } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { formatterDate } from '@/core/helpers/dateUtils';
import { ConfirmModalType, GeneralDropdownType } from '@/models/types';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { RemoveRevieweesCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { usePerformanceCommandStore } from '@/stores/humanResourcesStores/performanceCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import type { LookupDto, PaginatedList } from '@/models/ApiResult';
import AssignRevieweeWizardDialog from '@/components/cards/performanceDetailCards/AssignRevieweeWizardDialog.vue';
import type { EmployeeListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { isMobileDevice } from '@/assets/ts/_utils';

const emit = defineEmits(['currentStep']);
const selectRevieweeDialog = ref(false);
const { periodReviewList, periodDetail } = storeToRefs(usePerformanceDtoStore())

const props = defineProps({
    isUpdated: {
        type: Boolean,
        required: true
    },
    initialEmployeeList: {
        type: Object as PropType<PaginatedList<EmployeeListDto>>,
        required: true
    },
    revieweeLoading: {
        type: Boolean,
        required: true
    }
});

const route = useRoute();

const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType());
const selectedIds = ref(new Array<string>());

const removeRevieweesFunc = () => {
    let revieweeIds = periodReviewList.value.filter((a) => selectedIds.value.includes(a.id)).map((b) => b.reviewee.id);
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'list.removeSelectedEmployee',
        text: "list.removeSelectedEmployeeDesc",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            const command = new RemoveRevieweesCommand()
            command.revieweeIds = revieweeIds;
            usePerformanceCommandStore().removeReviewees(route.params.id.toString(), command).then(() => {
                periodReviewList.value = periodReviewList.value.filter((a) => !revieweeIds.includes(a.reviewee.id));
                confirmDialog.value = false;
                selectedIds.value = new Array<string>();
            }).catch((error) => {
                return catchError(error, () => { removeRevieweesFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            });
        }
    }
}

const assignReviewees = (event: { reviewees: Array<{ manager: LookupDto, reviewee: LookupDto }>, template: EvaluationTemplateDto }) => {
    const reviewees = event.reviewees.map((a, index) => {
        return {
            id: 'deneme' + index,
            reviewee: a.reviewee,
            manager: a.manager,
            status: ReviewStatusEnum.Draft,
            finalScore: 0,
            finalizedDate: "",
            goalScoreWeight: event.template.goalWeight,
            competencyScoreWeight: event.template.competencyWeight,
            goal: null,
            competency: null,
        } as ReviewSummaryDto
    })
    periodReviewList.value = periodReviewList.value.concat(reviewees);
}

const startGoalSetting = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.startGoalSetting',
        text: "general.startGoalSettingDesc",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            usePerformanceCommandStore().startPerformancePeriod(route.params.id.toString()).then((res) => {
                periodDetail.value.status = PeriodStatusType.GoalSetting;
            }).catch((error) => {
                return catchError(error, () => { startGoalSetting() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            })
        }
    }
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.delete",
        action: (item: ReviewSummaryDto) => {
            selectedIds.value = [item.id];
            removeRevieweesFunc();
        }
    }
]);

const isContinueButtonVisible = computed(() => {
    return periodReviewList.value.some((a) => a.competencyScoreWeight > 0 && !a.competency);
})

const defaultTableHeader = [
    {
        columnName: 'list.reviewee',
        columnLabel: "reviewee",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.manager',
        columnLabel: "manager",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.competencyTitle',
        columnLabel: "competency",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.status',
        columnLabel: "status",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.weight',
        columnLabel: "weight",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.finalScore',
        columnLabel: "finalScore",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.finalizedDate',
        columnLabel: "finalizedDate",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.actions',
        columnLabel: 'actions',
        sortEnabled: false,
        columnWidth: 175
    }
]

const tableHeader = computed(() => {
    let columnLabels = new Array<String>()
    if (props.isUpdated)
        columnLabels = ['reviewee', 'manager', 'competency', 'status', 'weight', 'actions']
    else
        columnLabels = ['reviewee', 'manager', 'competency', 'status', 'weight', 'finalScore', 'finalizedDate', 'actions']

    return defaultTableHeader.filter((a) => columnLabels.includes(a.columnLabel))
});

const getStatusColor = (status: ReviewStatusEnum) => {
    switch (status) {
        case ReviewStatusEnum.Draft: return 'grey';
        case ReviewStatusEnum.Evaluation: return 'info'; // Mavi
        case ReviewStatusEnum.ManagerReview: return 'warning'; // Turuncu
        case ReviewStatusEnum.HRReview: return 'purple'; // Mor
        case ReviewStatusEnum.Finalized: return 'success'; // Yeşil
        default: return 'grey';
    }
};

const getUpdatedChip = (data: ReviewSummaryDto): { color: string, text: string } => {
    if (data.competencyScoreWeight == 0 && data.goalScoreWeight == 1) {
        return { color: 'success', text: 'general.ready' }
    } else if (data.competencyScoreWeight > 0 && data.competency) {
        return { color: 'success', text: 'general.ready' }
    } else {
        return { color: 'warning', text: 'general.inProgress' }
    }
};

const getScoreColor = (score: number) => {
    if (score * 100 < 50) return 'error';
    if (score * 100 < 75) return 'warning';
    return 'success';
};

</script>

<style scoped></style>