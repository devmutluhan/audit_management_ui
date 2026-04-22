<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.manager') }}</p>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row class="d-flex align-center" v-if="employeeDetail.currentExperience?.manager">
                        <v-col cols="auto">
                            <ImageCard :firstValue="employeeDetail.currentExperience?.manager?.firstName"
                                :avatarText="employeeDetail.currentExperience?.manager?.avatar"
                                :secondValue="employeeDetail.currentExperience?.manager?.lastName" />
                        </v-col>
                        <v-col cols="auto">
                            <p class="mb-1 font-weight-medium text-blue-accent-3">
                                {{ employeeDetail.currentExperience?.manager.firstName + ' ' +
                                    employeeDetail.currentExperience?.manager.lastName }}
                            </p>
                            <p class="mb-0">
                                {{ employeeDetail.currentExperience?.manager.positionName ?? '-' }}
                            </p>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col class="py-6">
                            {{ $t('list.hasNotAssignedManager') }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import ImageCard from '@/components/cards/ImageCard.vue';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});
</script>