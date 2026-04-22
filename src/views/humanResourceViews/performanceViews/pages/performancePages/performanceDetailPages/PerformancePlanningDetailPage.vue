<template>
    <v-window class="w-100" v-model="step">
        <v-window-item :value="1">
            <PerformanceReviewsPage :isUpdated="isUpdated" @currentStep="step = $event"
                :initialEmployeeList="initialEmployeeList" :revieweeLoading="loading"></PerformanceReviewsPage>
        </v-window-item>
        <v-window-item :value="2">
            <CompetencyTemplateCard @currentStep="step = $event" :periodReviewList="periodReviewList"
                :periodCompetencyCommand="periodCompetencySectionCommand"></CompetencyTemplateCard>
        </v-window-item>
        <v-window-item :value="3">
            <AppointmentsCard @currentStep="step = $event" :periodReviewList="periodReviewList"
                :periodCompetencyCommand="periodCompetencySectionCommand" @createItem="getPeriodReviewees()"
                :initialEmployeeList="initialEmployeeList.items ?? []">
            </AppointmentsCard>
        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
import AppointmentsCard from '@/components/cards/performanceDetailCards/AppointmentsCard.vue';
import CompetencyTemplateCard from '@/components/cards/performanceDetailCards/CompetencyTemplateCard.vue';
import type { EmployeeListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { PeriodReviewCompetencySectionCommand } from '@/models/entities/humanResource/PerformanceCommands';
import { onMounted, ref, watch } from 'vue';
import PerformanceReviewsPage from './PerformanceReviewsPage.vue';
import { storeToRefs } from 'pinia';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import type { PaginatedList } from '@/models/ApiResult';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { catchError } from '@/core/helpers/generalResponse';
import { useRoute } from 'vue-router';

const emits = defineEmits(['setPeriodReviewees']);
const { periodReviewList } = storeToRefs(usePerformanceDtoStore())

const route = useRoute()
const loading = ref(false)
const getPeriodReviewees = () => {
    loading.value = true;
    usePerformanceDtoStore().getPeriodReview(route.params.id.toString()).catch((error) => {
        return catchError(error, () => { getPeriodReviewees() })
    }).finally(() => {
        loading.value = false
    })
}
getPeriodReviewees();

const props = defineProps({
    isUpdated: {
        type: Boolean,
        required: true
    }
});
const periodCompetencySectionCommand = ref(new PeriodReviewCompetencySectionCommand())
const step = ref(1);

onMounted(() => {
    getEmployeeList();
})

watch(() => props.isUpdated, () => {
    getEmployeeList()
})

const initialEmployeeList = ref({} as PaginatedList<EmployeeListDto>);

const getEmployeeList = () => {
    if (props.isUpdated) {
        let initListQuery = {} as any
        initListQuery.isTerminated = false;
        initListQuery.pageSize = 10000;
        initListQuery.pageNumber = 1;
        useEmployeeDtoStore().getEmployeeList(initListQuery).then((res) => {
            if (!initialEmployeeList.value.totalCount) {
                initialEmployeeList.value = res ?? {} as PaginatedList<EmployeeListDto>;
                initialEmployeeList.value.totalCount = res.totalCount
                initialEmployeeList.value.items = res.items
            }
        }).catch((error) => {
            return catchError(error, () => { getEmployeeList() })
        })
    }
}


</script>