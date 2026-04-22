<template>
    <v-card class="w-100 pa-0" :border="false" v-if="requestApproval">
        <v-timeline side="end">
            <v-timeline-item v-for="(item, index) in approvalTimeline" :key="index" size="small">
                <template v-slot:icon>
                    <ImageCard :avatarText="item.employee.avatarUrl ?? ''" :full-name="item.employee.fullName" />
                </template>
                <template v-slot:opposite>
                    <v-chip :color="getChipTextAndColor(item.status, item.order)?.color">
                        {{ getChipTextAndColor(item.status, item.order)?.text }}
                    </v-chip>
                </template>
                <v-card :border="false" v-if="item.employee">
                    <v-card-text>
                        <v-row class="d-flex align-center">
                            <v-col cols="12" class="font-weight-bold text-body-1">
                                {{ item.employee.fullName }}
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
                <v-divider class="position-absolute w-100"
                    v-if="item.status == ApprovementStatusEnum.SendBack && item.order != -1"></v-divider>
            </v-timeline-item>
        </v-timeline>
    </v-card>
</template>

<script lang="ts" setup>
import ImageCard from "@/components/cards/ImageCard.vue";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { enumToArray } from "@/core/helpers/enumToArray";
import { getChipColor } from "@/core/helpers/generalUtils";
import i18n from "@/core/plugins/i18n";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import type { RequestApprovalDto } from "@/models/entities/crm/CrmOfferDtos";
import { computed, type PropType } from "vue";

const props = defineProps({
    requestApproval: {
        type: Object as PropType<RequestApprovalDto>,
        required: true,
    },
});

const approvalTimeline = computed(() => {
    const histories = [...props.requestApproval.approvalStepHistories];
    const steps = props.requestApproval.approvalSteps;

    if (!histories.length) return histories;

    // İptal edildi, geri gönderildi veya reddedildi ise histories'e ekleme işlemi yapılmıyor.
    if (props.requestApproval.status == ApprovementStatusEnum.SendBack ||
        props.requestApproval.status == ApprovementStatusEnum.Rejected ||
        props.requestApproval.status == ApprovementStatusEnum.Cancelled) {
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