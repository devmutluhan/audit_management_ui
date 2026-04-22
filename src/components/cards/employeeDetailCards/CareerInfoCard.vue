<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-text>
                    <v-row class="d-flex align-center">
                        <v-col class="text-h5 text-sm-h3">
                            {{ employeeDetail.firstName + " " + employeeDetail.lastName }}
                        </v-col>
                        <v-col cols="auto" align="center">
                            <ImageCard :firstValue="employeeDetail.firstName" :secondValue="employeeDetail.lastName"
                                :avatarText="employeeDetail.avatarUrl" size="110" fontSize="40px" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.officalStartDate') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{ employeeDetail.employmentStartDate ?
                                            formatterDate(employeeDetail.employmentStartDate) : '--' }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.contractType') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{enumToArray(ContractTypeEnum).find((z: any) => z.value ==
                                            employeeDetail.contractType)?.title ?? '--'}}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.workingHours') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{ calculateWorkHours() ?? '--' }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.contractEndDate') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.contractEndDate ?
                                        formatterDate(employeeDetail.contractEndDate) :
                                        '--' }}
                                    </p>
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
                        <v-col>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('form.department') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{
                                        employeeDetail.currentExperience?.department ?? '--'
                                        }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="mb-1">{{ $t('form.position') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{
                                        employeeDetail.currentExperience?.position ?? '--'
                                        }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.positionStartDate') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{
                                        employeeDetail.currentExperience?.positionStartDate ?
                                            formatterDate(employeeDetail.currentExperience?.positionStartDate) : '--'
                                    }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="mb-1">{{ $t('list.workingType') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{enumToArray(EmploymentTypeEnum).find((z: any) => z.value ==
                                            employeeDetail.currentExperience?.employmentType)?.title ?? '--'}}
                                    </p>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row v-if="route.name != 'profile-info'">
                        <v-col cols="12" class="py-0">
                            <v-divider></v-divider>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="12" class="pt-0" align="end"
                            @click="router.push({ name: 'employee-career', params: { id: route.params.id } })">
                            <p class="mb-1 text-body-1 text-toolbarButton">
                                <strong> {{ $t('list.career') }} ></strong>
                            </p>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { enumToArray } from '@/core/helpers/enumToArray';
import { EmploymentTypeEnum, ContractTypeEnum } from '@/models/custom/EnumTypes';

import { useRoute, useRouter } from 'vue-router';
import ImageCard from '@/components/cards/ImageCard.vue';
import { formatterDate } from '@/core/helpers/dateUtils';
import i18n from '@/core/plugins/i18n';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});
const t = i18n.global.t
const route = useRoute();
const router = useRouter();

const calculateWorkHours = () => {
    if (!props.employeeDetail.employmentStartDate) {
        return ''
    }
    const employementDate = new Date(props.employeeDetail.employmentStartDate);
    const today = new Date();
    const yilFarki = today.getFullYear() - employementDate.getFullYear();
    const ayFarki = Math.abs(today.getMonth() - employementDate.getMonth());
    const gunFarki = Math.abs(today.getDate() - employementDate.getDate());
    var result = ""

    if (gunFarki < 60 && ayFarki < 2 && yilFarki == 0) {
        result = gunFarki + ' ' + t('enums.Day');
    } else if (ayFarki > 2 && yilFarki < 1) {
        result = ayFarki + ' ' + t('enums.Month');
    } else {
        result = yilFarki + ' ' + t('enums.Year') + ' ' + ayFarki + ' ' + t('enums.Month')
    }

    return result;
}

</script>