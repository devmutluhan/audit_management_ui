<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.emergency') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="route.name != 'profile-info'">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="text" icon="mdi-pencil-outline">
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <UpdateEmployeeEmergencyContact :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row class="d-flex align-center">
                        <v-col cols="12">
                            <v-row class="d-flex align-center">
                                <v-col cols="12">
                                    <p class="mb-1"> {{ $t('list.emergencyContact') }}</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12">
                            <p class="mb-1"> {{ $t('list.fullName') }} </p>
                            <p class="mb-0 font-weight-medium">
                                {{ employeeDetail.emergencyPersonFullName ?? '--' }}
                            </p>
                        </v-col>
                        <v-col cols="12">
                            <p class="mb-1"> {{ $t('list.phoneNumber') }} </p>
                            <p class="mb-0 font-weight-medium">
                                {{ employeeDetail.emergencyPersonPhone ?? '--' }}
                            </p>
                        </v-col>
                        <v-col cols="12">
                            <p class="mb-1"> {{ $t('list.degreeOfCloseness') }} </p>
                            <p class="mb-0 font-weight-medium">
                                {{ employeeDetail.emergencyClosenessDegree ?? '--' }}
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import UpdateEmployeeEmergencyContact from '@/components/dialogs/humanResources/UpdateEmployeeEmergencyContact.vue';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { useRoute } from 'vue-router';
const route = useRoute();

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});

</script>