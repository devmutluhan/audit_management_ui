<template>
    <v-card class="fill-height">
        <v-toolbar class="d-flex align-center">
            <v-col class="pr-0 pr-sm-4" cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.employeeAssignments') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="pl-0 pl-sm-4" cols="auto">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="flat" prepend-icon="mdi-plus">
                            {{ $t('general.assignmentEmployees') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AssignTrainingToEmployeesDialog :selectedTrainingId="route.params.id.toString()"
                            :dialogClose="() => { isActive.value = false }" @createItem="isChange()" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col>
                    <Datatable :data="trainingAssignmentsList?.items ?? []" :header="tableHeader" :loading="loading"
                        :enable-items-per-page-dropdown="true" :currentPage="trainingAssignmentsList.pageNumber"
                        :total="trainingAssignmentsList.totalCount" :notPageChange="!hasUnsavedChanges"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)">
                        <template v-slot:avatarUrl="{ row: data }">
                            <ImageCard :first-value="data.employee.firstName" :second-value="data.employee.lastName"
                                color="red" :avatarText="data.employee.avatarUrl" rounded="circle" />
                        </template>
                        <template v-slot:employee="{ row: data }">
                            <span class="text-body-1">
                                {{ data.employee.fullName }}
                            </span> <br>
                            <span class="text-body-2">
                                {{ data.employee.positionName ?? '--' }}
                            </span>
                        </template>
                        <template v-slot:rating="{ row: data }">
                            <v-rating v-model="data.rating" color="warning" active-color="warning" hover
                                density="compact" size="small" clearable></v-rating>
                        </template>
                        <template v-slot:status="{ row: data }">
                            <SingleSelectInput v-model="data.status" hide-details
                                :items="enumToArray(TrainingStatusEnum)" />
                        </template>
                        <template v-slot:description="{ row: data }">
                            <TextField v-model="data.description" hide-details />
                        </template>
                        <template v-slot:completedDate="{ row: data }">
                            <DateInput v-model="data.completedDate" hide-details />
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :menuItems="menuItems" :data="data"></GeneralDropdown>
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
            <v-row class="mt-4">
                <v-col class="d-flex justify-center">
                    <v-btn color="warning" variant="tonal" class="mr-4" size="x-large" prepend-icon="mdi-restore"
                        :disabled="!hasUnsavedChanges" @click="resetChanges">
                        {{ $t('form.resetChanges') }}
                    </v-btn>

                    <v-btn color="primary" size="x-large" prepend-icon="mdi-content-save" :loading="isSaving"
                        :disabled="!hasUnsavedChanges" @click="saveAssignment">
                        {{ $t('form.saveChanges') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { useTrainingStore } from '@/stores/humanResourcesStores/trainingStore';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { activeFilters } from "@/core/data/readyFilterColumnObject";

import {
    TrainingAssignmentsDto,
    UpdateAssignmentsCommand,
    UpdateAssignmentsCommandItem,
    type GetTrainingDto
} from '@/models/entities/humanResource/TrainingModels';
import ImageCard from '../ImageCard.vue';
import type { ActiveFiltersType, GeneralDropdownType } from '@/models/types';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { TrainingStatusEnum } from '@/models/custom/EnumTypes';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { filterQuery } from '@/core/helpers/generalUtils';
import { catchError } from '@/core/helpers/generalResponse';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import AssignTrainingToEmployeesDialog from '@/components/dialogs/humanResources/AssignTrainingToEmployeesDialog.vue';

const props = defineProps({
    trainingDetail: {
        type: Object as PropType<GetTrainingDto>,
        required: true
    }
})

const route = useRoute();
const trainingStore = useTrainingStore();
const { trainingAssignmentsList, loading } = storeToRefs(trainingStore);
const updateTrainingAssignCommand = ref(new UpdateAssignmentsCommand())
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
const isSaving = ref(false);

const originalDataMap = ref<Record<string, TrainingAssignmentsDto>>({});

initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;
initListQuery.value.trainingId = route.params.id.toString();

const tableHeader = ref([
    { columnName: '', columnLabel: "avatarUrl", columnWidth: 30 },
    { columnName: 'list.employeeName', columnLabel: "employee", columnWidth: 30 },
    { columnName: 'form.rating', columnLabel: "rating", sortEnabled: true, columnWidth: 175 },
    { columnName: 'form.status', columnLabel: "status", sortEnabled: true, columnWidth: 175 },
    { columnName: 'form.description', columnLabel: "description", sortEnabled: true, columnWidth: 175 },
    { columnName: 'form.completedDate', columnLabel: "completedDate", sortEnabled: true, columnWidth: 175 },
    { columnName: 'general.actions', columnLabel: "actions", columnWidth: 135 },
]);

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            title: 'general.delete',
            buttonLoading: false,
            action: (data: TrainingAssignmentsDto) => deleteAssignment(data)
        }
    }
])

const createSnapshot = () => {
    originalDataMap.value = {};
    if (trainingAssignmentsList.value?.items) {
        trainingAssignmentsList.value.items.forEach(item => {
            originalDataMap.value[item.id] = JSON.parse(JSON.stringify(item));
        });
    }
};

const hasChanged = (original: TrainingAssignmentsDto, current: TrainingAssignmentsDto): boolean => {
    if (!original || !current) return false;

    return original.status !== current.status ||
        original.rating !== current.rating ||
        original.description !== current.description ||
        original.completedDate !== current.completedDate;
};

const hasUnsavedChanges = computed(() => {
    const items = trainingAssignmentsList.value?.items ?? [];
    return items.some(item => {
        const original = originalDataMap.value[item.id];
        return original && hasChanged(original, item);
    });
});

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>()
    listQuery.value = filterQuery(filters, initListQuery.value);

    useTrainingStore().getTrainingAssignments(listQuery.value).then(() => {
        createSnapshot();
    });
}

const saveAssignment = () => {
    updateTrainingAssignCommand.value = new UpdateAssignmentsCommand();
    const currentItems = trainingAssignmentsList.value?.items ?? [];

    currentItems.forEach(currentItem => {
        const originalItem = originalDataMap.value[currentItem.id];

        if (originalItem && hasChanged(originalItem, currentItem)) {
            const commandItem = new UpdateAssignmentsCommandItem();
            commandItem.id = currentItem.id;
            commandItem.trainingStatus = currentItem.status as unknown as TrainingStatusEnum;
            commandItem.completedDate = currentItem.completedDate;
            commandItem.rating = currentItem.rating;
            commandItem.description = currentItem.description;

            updateTrainingAssignCommand.value.assignments.push(commandItem);
        }
    });

    if (updateTrainingAssignCommand.value.assignments.length === 0) {
        return;
    }

    isSaving.value = true;
    useTrainingStore().updateTrainingAssignments(route.params.id.toString(), updateTrainingAssignCommand.value).then((res) => {
        createSnapshot();
    }).catch((error) => {
        return catchError(error, () => { saveAssignment() })
    }).finally(() => {
        isSaving.value = false;
    })
};

const resetChanges = () => {
    if (!trainingAssignmentsList.value?.items) return;

    trainingAssignmentsList.value.items.forEach(item => {
        const original = originalDataMap.value[item.id];
        if (original) {
            item.status = original.status;
            item.rating = original.rating;
            item.description = original.description;
            item.completedDate = original.completedDate;
        }
    });
};

const deleteAssignment = (data: TrainingAssignmentsDto) => {
    menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = true : '';
    useTrainingStore().deleteTrainingAssignments(route.params.id.toString(), data.id).then((res) => {
        if (trainingAssignmentsList.value && trainingAssignmentsList.value.items) {
            trainingAssignmentsList.value.items = trainingAssignmentsList.value.items.filter(item => item.id !== data.id);

            if (trainingAssignmentsList.value.totalCount > 0) {
                trainingAssignmentsList.value.totalCount--;
            }
            delete originalDataMap.value[data.id];
        }
    }).catch((error) => {
        return catchError(error, () => { deleteAssignment(data) })
    }).finally(() => {
        menuItems.value[0].confirmModalValue ? menuItems.value[0].confirmModalValue.buttonLoading = false : '';
    })
};

onBeforeRouteLeave((to, from, next) => {
    if (hasUnsavedChanges.value) {
        const answer = window.confirm('Kaydedilmemiş değişiklikleriniz var. Sayfadan ayrılmak istediğinize emin misiniz? Değişiklikler kaybolacak.');
        if (answer) {
            next();
        } else {
            next(false);
        }
    } else {
        next();
    }
});

onMounted(() => {
    isChange();
});
</script>