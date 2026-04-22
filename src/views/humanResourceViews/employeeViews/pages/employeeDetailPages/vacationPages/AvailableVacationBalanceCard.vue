<template>
    <v-card class="rounded-lg">
        <div
            class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center py-3 px-4 bg-cardToolbar text-white w-100">
            <div class="d-flex align-center mb-2 mb-sm-0">
                <span class="text-subtitle-1 text-sm-h6 font-weight-bold">
                    {{ $t('list.availableVacationBalance') }} / {{ $t('list.annualVacation') }}
                </span>
            </div>

            <div class="text-start text-sm-end">
                <span class="text-caption font-weight-bold d-block">
                    {{ $t("list.currentEntitlementPeriod") }}
                </span>
                <span class="text-body-2">
                    {{ formatterDate(employeeLeaveSummaryDetail.currentAccrualPeriod?.start) }} -
                    {{ formatterDate(employeeLeaveSummaryDetail.currentAccrualPeriod?.end) }}
                </span>
            </div>
        </div>

        <v-card-text class="pt-6">
            <v-row no-gutters>
                <v-col cols="12" class="text-center mb-4">
                    <p class="text-red font-weight-bold mb-2 transition-swing"
                        :class="$vuetify.display.xs ? 'text-h4' : 'text-h3'">
                        %{{ usagePercentage }}
                    </p>
                    <v-progress-linear :model-value="usagePercentage" color="red" height="10" rounded
                        striped></v-progress-linear>
                </v-col>

                <v-col cols="12">
                    <div class="d-flex justify-space-between align-center px-2 py-3 bg-cardToolbar rounded">
                        <div class="d-flex flex-column align-start">
                            <span class="text-caption text-grey-darken-1">{{ $t('list.used') }}</span>
                            <span class="text-h6 font-weight-medium">{{ employeeLeaveSummaryDetail.used || 0 }}</span>
                        </div>

                        <v-divider vertical class="mx-2"></v-divider>

                        <div class="d-flex flex-column align-end">
                            <span class="text-caption text-grey-darken-1">{{ $t('list.remainder') }}</span>
                            <span class="text-h6 font-weight-medium">{{ employeeLeaveSummaryDetail.unused || 0 }}</span>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatterDate } from "@/core/helpers/dateUtils";
import type { LeaveBalanceDto } from "@/models/entities/humanResource/LeaveDtos";
import type { PropType } from "vue";

const props = defineProps({
    employeeLeaveSummaryDetail: {
        type: Object as PropType<LeaveBalanceDto>,
        required: true
    }
});

// Yüzdelik hesaplamayı computed property'ye taşıdık
const usagePercentage = computed(() => {
    const total = props.employeeLeaveSummaryDetail.total || 0;
    const used = props.employeeLeaveSummaryDetail.used || 0;

    if (total === 0) return 0;

    const percentage = (used / total) * 100;
    return Math.round(percentage);
});
</script>

<style scoped>
/* Eğer bg-cardToolbar global bir class değilse buraya rengi ekleyebilirsiniz */
.bg-cardToolbar {
    background-color: #1976D2;
    /* Örnek renk, temanıza göre değişebilir */
}
</style>