<template>
    <v-card>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="auto pr-0 pr-md-4">
                    <v-avatar :rounded="true" :size="140">
                        <v-img :src="trainingImage" cover></v-img>
                    </v-avatar>
                </v-col>

                <v-col cols="auto pr-0 pr-md-4">
                    <p class="text-h6 font-weight-bold mb-1">
                        {{ trainingDetail.name }}
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.instructorName') }}:
                        <span class="font-weight-bold">
                            {{ trainingDetail.instructorName }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.instructorCompany') }}:
                        <span class="font-weight-bold">
                            {{ trainingDetail.instructorCompany }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.startDate') }}:
                        <span class="font-weight-bold">
                            {{ formatterDateFromHours(trainingDetail.startDate) }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.endDate') }}:
                        <span class="font-weight-bold">
                            {{ formatterDateFromHours(trainingDetail.endDate) }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.location') }}:
                        <span class="font-weight-bold">
                            {{ trainingDetail.description }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.description') }}:
                        <span class="font-weight-bold">
                            {{ trainingDetail.description }}
                        </span>
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { themeMode } from '@/layouts/default-layout/config/helper';
import { getAssetPath } from '@/core/helpers/assets';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import type { GetTrainingDto } from '@/models/entities/humanResource/TrainingModels';

const props = defineProps({
    trainingDetail: {
        type: Object as PropType<GetTrainingDto>,
        required: true
    }
})

const trainingImage = computed(() => {
    if (themeMode.value !== 'dark') {
        return getAssetPath("media/auth/agency.png")
    } else {
        return getAssetPath("media/auth/agency-dark.png");
    }
})
</script>