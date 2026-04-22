<template>
    <v-container fluid class="pa-0 fill-height">
        <v-row>
            <v-col>
                <TrainingHeaderCard :trainingDetail="trainingDetail" />
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col>
                <TrainingAssignmentsCard :trainingDetail="trainingDetail" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTrainingStore } from '@/stores/humanResourcesStores/trainingStore';
import TrainingHeaderCard from '@/components/cards/trainingDetailCards/TrainingHeaderCard.vue';
import TrainingAssignmentsCard from '@/components/cards/trainingDetailCards/TrainingAssignmentsCard.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { trainingDetail } = storeToRefs(useTrainingStore());
useTrainingStore().getTrainingDetail({ id: route.params.id.toString(), pageSize: 100, pageNumber: 1 });

</script>