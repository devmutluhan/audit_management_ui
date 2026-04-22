<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.citizenship') }}</p>
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
                                <UpdateEmployeeCitizenship :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.birthDate') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.birthDate ?
                                        formatterDate(employeeDetail.birthDate) : '--' }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.gender') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{employeeDetail.gender != null ? enumToArray(GenderEnum).find((a) =>
                                            a.value == employeeDetail.gender)?.title : '--'}}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.degreeOfDisability') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{employeeDetail.levelOfDisability != null ?
                                            enumToArray(LevelOfDisability).find((a) =>
                                                a.value == employeeDetail.levelOfDisability)?.title : '--'}} </p>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <p class="mb-1">{{ $t('list.nationality') }}</p>
                            <p class="mb-1 font-weight-medium"> {{ employeeDetail.nationality ?
                                employeeDetail.nationality.name : '--'
                                }} </p>
                        </v-col>
                        <v-col cols="10" sm="5">
                            <p class="mb-1">{{ $t('list.identityNumber') }}</p>
                            <p class="mb-1 font-weight-medium"> {{ employeeDetail.identityNumber ?? '--' }} </p>
                        </v-col>
                        <v-col cols="1">
                            <v-btn variant="text" icon="mdi-content-copy"
                                @click="copyText(employeeDetail.identityNumber)">
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" v-if="employeeDetail.gender != GenderEnum.Female">
                            <p class="mb-1">{{ $t('list.militaryStatus') }}</p>
                            <p class="mb-1 font-weight-medium">
                                {{employeeDetail.militaryStatus != null ?
                                    enumToArray(MilitaryServiceStatus).find((a) =>
                                        a.value == employeeDetail.militaryStatus)?.title : '--'}}
                            </p>
                        </v-col>
                        <v-col cols="12" sm="6" v-if="employeeDetail.militaryStatus == MilitaryServiceStatus.Delayed">
                            <p class="mb-1">{{ $t('list.militaryDelayDate') }}</p>
                            <p class="mb-1 font-weight-medium">
                                {{ employeeDetail.militaryDelayDate ?
                                    formatterDate(employeeDetail.militaryDelayDate) : '--' }}
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import UpdateEmployeeCitizenship from '@/components/dialogs/humanResources/UpdateEmployeeCitizenship.vue';
import { GenderEnum, LevelOfDisability, MilitaryServiceStatus } from '@/models/custom/EnumTypes';
import { copyText } from '@/core/helpers/generalUtils';
import { formatterDate } from '@/core/helpers/dateUtils';
import { useRoute } from 'vue-router';
import { enumToArray } from '@/core/helpers/enumToArray';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
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