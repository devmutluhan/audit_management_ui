<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col class="pr-0 pr-sm-4" cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.projectInformation') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.customerName') }}:</p>
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <p v-bind="props" class="mb-1 font-weight-bold text-body-1">
                                {{ projectDetail.customer.name }}
                            </p>
                        </template>
                        <v-row>
                            <v-col>
                                <v-card border="false">
                                    <v-card-text>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('form.customerAddress') }}: </p>
                                            <p class="mb-1 font-weight-bold text-body-2" v-if="projectDetail.address">
                                                {{ projectDetail.address.countryName }} /
                                                {{ projectDetail.address.city }} <br>
                                                {{ projectDetail.address.street }} <br>
                                            </p>
                                            <p class="mb-1 font-weight-medium" v-else>
                                                --
                                            </p>
                                        </v-col>
                                        <v-divider></v-divider>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('general.customerRepresentative') }}:</p>
                                            <v-row class="font-weight-bold text-body-2">
                                                <v-col cols="12" v-if="projectDetail.representative">
                                                    <p class="mb-0 text-blue-accent-3">
                                                        {{ projectDetail.representative.fullName }}
                                                    </p>
                                                    <p class="mb-0 text-truncate">
                                                        {{ projectDetail.representative.email }} </p>
                                                </v-col>
                                                <v-col cols="12" v-else>
                                                    <p class="mb-0">
                                                        --
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-tooltip>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 font-weight-bold text-body-1"> {{ $t('form.projectDate') }}:</p>
                    <p class="mb-1 text-body-1">
                        {{ $t('form.start') }}: {{ formatterDate(projectDetail.actualStartDate) }}
                    </p>
                    <p class="mb-1 text-body-1">
                        {{ $t('form.end') }}: {{ formatterDate(projectDetail.actualEndDate) }}
                    </p>
                </v-col>
                <v-col cols="6" md="4" v-if="projectDetail.salesRepresentative">
                    <p class="mb-1 text-body-1">{{ $t('form.salesRepresentative') }}:</p>
                    <p class="mb-0 font-weight-bold text-body-1">
                        {{ projectDetail.salesRepresentative.firstName + ' ' +
                            projectDetail.salesRepresentative.lastName }}
                    </p>
                </v-col>
                <v-col cols="6" md="4" class="text-body-1">
                    <p class="mb-1">{{ $t('form.currencyCode') }}:
                        <span class="font-weight-bold">
                            {{ projectDetail.defaultCurrency.code }}
                        </span>
                    </p>
                    <p class="mb-1">
                        {{ $t('form.exchangeRateAgreement') }}:
                        <span class="font-weight-bold">
                            {{ projectDetail.exchangeRateAgreement ?
                                projectDetail.exchangeRateAgreement : '-' }}
                        </span>
                    </p>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.manager') }}:</p>
                    <p class="mb-1 font-weight-medium text-body-2 text-blue-accent-3">
                        {{ projectDetail.manager.firstName + ' ' + projectDetail.manager.lastName }}
                    </p>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.partner') }}:</p>
                    <p class="mb-1 font-weight-medium text-body-2 text-blue-accent-3">
                        {{ projectDetail.partner.firstName + ' ' + projectDetail.partner.lastName }}
                    </p>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.description') }}:</p>
                    <p class="mb-1 font-weight-medium text-body-2">
                        {{ projectDetail.description }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { formatterDate } from '@/core/helpers/dateUtils';
import { ProjectDetailDto } from '@/models/entities/crm/CrmProjectDtos';

const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true,
        default: new ProjectDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

</script>