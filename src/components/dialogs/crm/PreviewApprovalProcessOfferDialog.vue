<template>
    <DialogContent title="general.previewApprovalProcess" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-eye">
        <template v-slot:dialogBody>
            <v-card class="w-100 pa-0 d-flex align-center justify-center overflow-auto" :border="false">
                <v-card-text>
                    <v-timeline side="end">
                        <v-timeline-item v-for="(item, index) in approvalTimeline" :key="index" size="small">
                            <template v-slot:icon>
                                <ImageCard :avatarText="item.employee.avatarUrl ?? ''"
                                    :full-name="item.employee.fullName" />
                            </template>
                            <template v-slot:opposite>
                                <v-chip :color="getChipTextAndColor(item.status, item.order)?.color">
                                    {{ getChipTextAndColor(item.status, item.order)?.text }}
                                </v-chip>
                            </template>
                            <v-card :border="false">
                                <v-card-text>
                                    <v-row class="d-flex align-center">
                                        <v-col cols="12" class="font-weight-bold text-body-1">
                                            {{ item.employee.fullName }}
                                            <p class="ma-0 text-body-2">
                                                {{ formatterDateFromHours(item.actionDate) }}
                                            </p>
                                            <p v-if="item.approverRiskLevel != null"
                                                class="ma-0 text-body-1 text-error">
                                                <span v-if="item.approverRiskLevel != item.selectedRiskStatus"
                                                    class="text-lowercase text-info">
                                                    {{enumToArray(CustomerRiskLevel).find((a) => a.value ==
                                                        item.approverRiskLevel)?.title + ' --> ' +
                                                        enumToArray(CustomerRiskLevel).find((a) => a.value ==
                                                            item.selectedRiskStatus)?.title}}
                                                </span>
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
                    <v-row v-if="props.requestApproval.riskApprovalSteps && riskApprovalSteps.length > 0">
                        <v-divider></v-divider>
                        <v-col cols="12">
                            <v-row class="d-flex justify-center text-center">
                                <v-col cols="auto" class="text-h6 font-weight-bold">
                                    {{ $t('form.riskProcessEmployee') }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-timeline side="end" direction="horizontal" v-if="riskApprovalSteps">
                                        <v-timeline-item size="small" v-for="(item, index) in riskApprovalSteps"
                                            :key="index">
                                            <template v-slot:icon>
                                                <ImageCard :avatarText="item.avatarUrl ?? ''"
                                                    :full-name="item.fullName" />
                                            </template>
                                            <template v-slot:opposite>
                                                <v-chip :color="getRiskStatusChipColor(index)?.color">
                                                    {{ getRiskStatusChipColor(index)?.text }}
                                                </v-chip>
                                            </template>
                                            <v-card :border="false">
                                                <v-card-text>
                                                    <v-row class="d-flex align-center">
                                                        <v-col cols="12" class="font-weight-bold text-body-1 py-0">
                                                            {{ item.fullName }}
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col
                                                            v-if="index == props.requestApproval.riskApprovalSteps.step && approvalTimeline.findIndex((a) => a.actionDate == '') == -1 && props.requestApproval.status == ApprovementStatusEnum.Waiting"
                                                            cols="12" class="font-weight-bold text-body-1">
                                                            <v-chip
                                                                :color="getChipTextAndColor(ApprovementStatusEnum.Waiting, 2)?.color">
                                                                {{
                                                                    getChipTextAndColor(ApprovementStatusEnum.Waiting,
                                                                        2)?.text
                                                                }}
                                                            </v-chip>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-timeline-item>
                                    </v-timeline>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import type { RequestApprovalDto } from '@/models/entities/crm/CrmOfferDtos';
import type { PropType } from 'vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ApprovementStatusEnum, CustomerRiskLevel } from '@/models/custom/EnumTypes';
import ImageCard from '@/components/cards/ImageCard.vue';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { getChipColor } from '@/core/helpers/generalUtils';
import i18n from '@/core/plugins/i18n';
import type { ApprovalEmployeeDto } from '@/models/entities/approvalProcess/ApprovalProcessDtos';

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    requestApproval: {
        type: Object as PropType<RequestApprovalDto>,
        required: true,
    },
});

const riskApprovalSteps = ref(new Array<ApprovalEmployeeDto>())

onMounted(() => {
    if (props.requestApproval.riskApprovalSteps) {
        riskApprovalSteps.value = [
            props.requestApproval.riskApprovalSteps.lowApprover,
            props.requestApproval.riskApprovalSteps.midApprover,
            props.requestApproval.riskApprovalSteps.highApprover
        ]
    }
})

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

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    }
])

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

const getRiskStatusChipColor = (riskLevel: CustomerRiskLevel) => {
    return {
        color: riskLevel == CustomerRiskLevel.Low ? 'success' : riskLevel == CustomerRiskLevel.Mid ? 'info' : 'error',
        text: enumToArray(CustomerRiskLevel).find((a) => a.value == riskLevel)?.title ?? ''
    };
}


</script>