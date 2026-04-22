<template>
    <v-row>
        <v-col>
            <v-row>
                <!-- İzne Esas Hakediş Tarihi -->
                <v-col lg="4" md="6" cols="12">
                    <v-card height="150px">
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto" class="pr-1">
                                    <p class="text-h6 font-weight-bold mb-0">
                                        {{ $t('list.accrualDate') }}
                                    </p>
                                </v-col>
                                <v-col class="px-0">
                                    <v-icon>mdi-chat-question-outline</v-icon>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="auto" class="px-0">
                                    <v-btn variant="text" color="toolbarButton" icon="mdi-pencil-outline"></v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pt-2">
                                    <p class="text-h4"> {{ formatterDate(employeeLeaveSummaryDetail.accrualDate) }} </p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <!-- Sonraki İzin Hakediş Tarihi -->
                <v-col lg="4" md="6" cols="12">
                    <v-card height="150px">
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto" class="pr-1">
                                    <p class="text-h6 font-weight-bold mb-0">
                                        {{ $t('list.nextAccrualDate') }}
                                    </p>
                                </v-col>
                                <v-col class="px-0">
                                    <v-icon>mdi-chat-question-outline</v-icon>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pt-2">
                                    <p class="text-h4">{{ formatterDate(employeeLeaveSummaryDetail.nextAccrualDate) }}
                                    </p>
                                    <p class="text-body-1"> {{ $t('list.unusedUnpaidLeaves') }} {{
                                        employeeLeaveSummaryDetail.unusedUnpaidLeaves }} {{ $t('form.day') }}
                                    </p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
                <!-- İzne Esas Kıdem -->
                <v-col lg="4" md="6" cols="12">
                    <v-card height="150px">
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="auto" class="pr-1">
                                    <p class="text-h6 font-weight-bold mb-0">
                                        {{ $t('list.seniorityForLeave') }}
                                    </p>
                                </v-col>
                                <v-col class="px-0">
                                    <v-icon>mdi-chat-question-outline</v-icon>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="pt-2">
                                    <p class="text-h4">
                                        <span v-if="employeeLeaveSummaryDetail.workYear?.years">
                                            {{ employeeLeaveSummaryDetail.workYear?.years + ' ' + $t('enums.Year') + ' '
                                            }}
                                        </span>
                                        <span v-if="employeeLeaveSummaryDetail.workYear?.months">
                                            {{ employeeLeaveSummaryDetail.workYear?.months + ' ' + $t('enums.Month') +
                                                ' ' }}
                                        </span>
                                        <span v-if="employeeLeaveSummaryDetail.workYear?.days">
                                            {{ employeeLeaveSummaryDetail.workYear?.days + ' ' + $t('enums.Day') }}
                                        </span>
                                    </p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Kullanılabilir İzin Bakiyesi -->
            <v-row>
                <v-col>
                    <AvailableVacationBalanceCard :employeeLeaveSummaryDetail="employeeLeaveSummaryDetail">
                    </AvailableVacationBalanceCard>
                </v-col>
            </v-row>

            <v-row>
                <v-col lg="4" sm="6" cols="12" v-for="card in cards" :key="card.title">
                    <v-card>
                        <v-card-title> {{ card.title }} </v-card-title>
                        <v-card-text class="text-h4 py-6" :class="'text-' + card.color">
                            {{ employeeLeaveSummaryDetail[card.prop] }} {{ $t('form.day') }} </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { formatterDate } from '@/core/helpers/dateUtils';
import i18n from '@/core/plugins/i18n';
import { useLeaveStore } from '@/stores/humanResourcesStores/leaveStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue'
import AvailableVacationBalanceCard from './AvailableVacationBalanceCard.vue';
const t = i18n.global.t;

const { employeeLeaveSummaryDetail } = storeToRefs(useLeaveStore())

const cards = ref([
    {
        title: t('list.totalAccrual'),
        color: "success",
        prop: "total"
    },
    {
        title: t('list.totalUsedAccrual'),
        color: "error",
        prop: "used"
    },
    {
        title: t('list.futureLeaves'),
        color: "warning",
        prop: "futureLeaves"
    },
    {
        title: t('list.currentEarned'),
        color: "info",
        prop: "currentEarned"
    },
    {
        title: t('list.currentUsed'),
        color: "info",
        prop: "currentUsed"
    },
    {
        title: t('list.nextPeriodLeaves'),
        color: "info",
        prop: "nextPeriodLeaves"
    },
    {
        title: t("list.carriedOver"),
        color: "info",
        prop: "carriedOver"
    },
    {
        title: t('list.lastCarriedOver'),
        color: "info",
        prop: "lastCarriedOver"
    },
    {
        title: t('list.loss'),
        color: "info",
        prop: "loss"
    },
])


</script>