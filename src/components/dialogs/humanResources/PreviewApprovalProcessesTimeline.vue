<template>
    <v-card class="w-100 pa-0" :border="false">
        <v-divider></v-divider>
        <v-timeline side="end" v-if="items">
            <v-timeline-item v-for="(item, index) in approvalTimeline" :key="index" size="small">
                <template v-slot:icon>
                    <ImageCard :firstValue="item.employee.firstName" :secondValue="item.employee.lastName"
                        :avatarText="item.employee.avatarUrl" size="50" fontSize="40px" />
                </template>
                <template v-slot:opposite>
                    <v-chip :color="getChipTextAndColor(item.status, item.order)?.color">
                        {{ getChipTextAndColor(item.status, item.order)?.text }}
                    </v-chip>
                </template>
                <v-card :border="false">
                    <v-card-text>
                        <v-row class="d-flex align-center">
                            <v-col cols="12" class="pb-0 font-weight-bold text-body-1">
                                {{ item.employee.fullName }}
                            </v-col>
                            <v-col cols="12" class="pt-0 ">
                                {{ item.employee.positionName }}
                                <p class="ma-0 text-body-2">
                                    {{ formatterDateFromHours(item.actionDate) }}
                                </p>
                                <p class="ma-0 text-body-1 text-error">
                                    {{ item.reason ?? '' }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-card>
</template>

<script lang="ts" setup>
import ImageCard from '@/components/cards/ImageCard.vue';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import { getChipColor } from '@/core/helpers/generalUtils';
import i18n from '@/core/plugins/i18n';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import type { ApproverDto } from '@/models/entities/approvalProcess/ApprovalProcessDtos';
import type { ApprovalStepHistoryDto } from '@/models/entities/crm/CrmOfferDtos';
import type { EmployeeLeaveListDto } from '@/models/entities/humanResource/LeaveDtos';
import { computed, type PropType } from 'vue';

const props = defineProps({
    items: {
        type: Array<ApproverDto>,
        required: true,
    },
    histories: {
        type: Array<ApprovalStepHistoryDto>,
        required: true
    },
    leave: {
        type: Object as PropType<EmployeeLeaveListDto>,
        required: true
    }
});


const approvalTimeline = computed(() => {
    const histories = [...props.histories];
    const steps = props.items;

    if (!histories.length) return histories;

    // İptal edildi, geri gönderildi veya reddedildi ise histories'e ekleme işlemi yapılmıyor.
    if (props.leave.status == ApprovementStatusEnum.SendBack ||
        props.leave.status == ApprovementStatusEnum.Rejected ||
        props.leave.status == ApprovementStatusEnum.Cancelled) {
        return histories;
    }

    // Son oluşturan kişinin index i bulunuyor (Geri gönderilince tekrar oluşma ihtimali var)
    let lastCreatorIndex = 0;
    histories.forEach((a, index) => {
        if (a.order == -1) {
            lastCreatorIndex = index
        }
    });

    // Son oluşturan kişiden sonra kaç kişinin onayından geçmiş
    const nextApproverLength = histories.slice(lastCreatorIndex + 1, histories.length).length
    // Son oluşturan kişiden sonra kaç kişi varsa steplerden o kadar kişi ayrılıyor
    const nextWaitingSteps = steps.slice(nextApproverLength, steps.length);
    // Onayı beklenen kişiler histories e ekleniyor.
    if (nextWaitingSteps.length > 0) {
        nextWaitingSteps.forEach((a) => {
            histories.push({
                order: a.order,
                employee: a.approver,
                actionDate: '',
                status: ApprovementStatusEnum.Waiting,
                reason: null,
                approverRiskLevel: null,
                selectedRiskStatus: null
            });
        });
    }

    return histories;
});


const t = i18n.global.t;
const getChipTextAndColor = (status: number, order: number) => {
    if (order == -1)
        return {
            color: '',
            text: t('list.createdBy')
        }
    else
        return {
            color: getChipColor(status),
            text: enumToArray(ApprovementStatusEnum).find((a) => a.value == status)?.title ?? ''
        };
}

</script>