<template>
    <v-row>
        <v-col cols="12">
            <PerformanceDetailHeaderCard :performanceDetail="periodDetail" :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12">
            <RouterView :isUpdated="isUpdated">
            </RouterView>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePerformanceDtoStore } from '@/stores/humanResourcesStores/performanceDtoStore';
import PerformanceDetailHeaderCard from '@/components/cards/employeeDetailCards/PerformanceDetailHeaderCard.vue';
import { PeriodStatusType } from "@/models/custom/EnumTypes";

const route = useRoute();

const { periodDetail } = storeToRefs(usePerformanceDtoStore());
usePerformanceDtoStore().getPeriodDetail(route.params.id.toString());

const isUpdated = computed(() => {
    return periodDetail.value.status == PeriodStatusType.Planning;
})

</script>