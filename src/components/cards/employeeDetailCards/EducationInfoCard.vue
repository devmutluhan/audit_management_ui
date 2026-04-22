<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.education') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="route.name != 'profile-info'">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-pencil-outline">
                                    {{ $t('general.edit') }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <UpdateEmployeeEducation :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.educationStatus') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{employeeDetail.educationStatus !=
                                        null ?
                                        enumToArray(EducationStatusTypeEnum).find((a) =>
                                            a.value == employeeDetail.educationStatus)?.title : '--'}}
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.lastLevelOfEducation') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{employeeDetail.educationLevel != null ?
                                        enumToArray(EducationLevel).find((a) =>
                                            a.value == employeeDetail.educationLevel)?.title : '--'
                                    }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <p class="mb-1">{{ $t('list.educationalInstitution') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.educationalInstitution
                                        ?? '--' }} </p>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</template>

<script lang="ts" setup>
import { enumToArray } from '@/core/helpers/enumToArray';
import UpdateEmployeeEducation from '@/components/dialogs/humanResources/UpdateEmployeeEducation.vue';
import { EducationLevel, EducationStatusTypeEnum } from '@/models/custom/EnumTypes';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { useRoute } from 'vue-router';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';
const route = useRoute();

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});

</script>