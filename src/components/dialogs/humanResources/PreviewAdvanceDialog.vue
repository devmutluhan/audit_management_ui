<template>
    <DialogContent title="general.requestAdvance" :dialogClose="dialogClose" titleIcon="mdi-cash"
        :buttons="filterButtons">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center" v-if="selectedItem">
                <v-col cols="11">
                    <v-row v-if="selectedItem.employee">
                        <v-col cols="auto pr-0 pr-md-4 hidden-xs">
                            <ImageCard :first-value="selectedItem.employee.firstName"
                                :avatar-text="selectedItem.employee.avatarUrl" size="60"
                                :second-value="selectedItem.employee.lastName" fontSize="20px" />
                        </v-col>
                        <v-col cols="12" sm="9">
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-card color="cardToolbar">
                                        <v-card-text class="text-h5">
                                            <span class="text-primary font-weight-bold">
                                                {{ selectedItem.employee.fullName }}
                                            </span>
                                            {{ $t('list.requestForAdvance') }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="auto">
                                    <v-chip class="font-weight-bold"
                                        :color="getChipColor(selectedItem.approvementStatus)">
                                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            selectedItem.approvementStatus)?.title}}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.description') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ advanceDetail.description }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.isPaidStatus') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0"
                                    :class="advanceDetail.isPaid ? 'text-priceTextColor' : 'text-error'">
                                    {{ advanceDetail.isPaid ? $t('list.paid') : $t('list.notPaid') }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('list.startsAt') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ formatterDate(advanceDetail.createdAt) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row v-if="advanceDetail.creator">
                                <v-col class="py-0">
                                    {{ $t('list.creator') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ advanceDetail.creator?.fullName ?? '--' }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.createdAt') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0">
                                    {{ formatterDateFromHours(advanceDetail.createdAt) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.amount') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0 text-priceTextColor">
                                    {{ formatterPriceForCurrencyName(advanceDetail.amount, advanceDetail.currency) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12"
                    v-if="advanceDetail.requestApproval && advanceDetail.requestApproval.approvalSteps.length > 0">
                    <v-row v-if="advanceDetail.requestApproval?.status != ApprovementStatusEnum.Draft">
                        <v-col cols="12" class="text-center text-primary font-weight-bold pb-0">
                            {{ $t('form.approvalProcess') }}
                        </v-col>
                        <v-col cols="12">
                            <PreviewExpenseApprovalProcessesTimeline :requestApproval="advanceDetail.requestApproval" />
                        </v-col>
                    </v-row>
                </v-col>
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import PreviewExpenseApprovalProcessesTimeline from "@/components/dialogs/humanResources/PreviewExpenseApprovalProcessesTimeline.vue";
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import { formatterDate, formatterDateFromHours } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import { storeToRefs } from 'pinia';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { catchError } from '@/core/helpers/generalResponse';
import { usePaymentStore } from '@/stores/humanResourcesStores/paymentStore';
import type { AdvanceListDto } from '@/models/entities/humanResource/PaymentModels';
import { ConfirmModalType } from '@/models/types';

const { advanceDetail } = storeToRefs(usePaymentStore());

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<AdvanceListDto> as any,
        required: true
    }
});

onMounted(() => {
    usePaymentStore().getAdvanceDetail(props.selectedItem.id)
})

const sendApproveFunc = () => {
    buttons.value[1].loading = true
    usePaymentStore().sendAdvance(props.selectedItem.id).then((res: any) => {
        props.selectedItem.approvementStatus = res.data.status
        props.dialogClose();
    }).catch((error) => {
        return catchError(error, () => sendApproveFunc())
    }).finally(() => {
        buttons.value[1].loading = true
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'sendApprove',
        click: () => sendApproveFunc(),
        loading: false
    },
    {
        type: 'cancel',
        click: () => toCancelFunc(),
        loading: false
    }
]);

const filterButtons = computed(() => {
    const status = props.selectedItem.approvementStatus;
    if (status == ApprovementStatusEnum.Draft || status == ApprovementStatusEnum.SendBack || status == ApprovementStatusEnum.Approved) {
        if (status == ApprovementStatusEnum.Approved || status == ApprovementStatusEnum.SendBack)
            return buttons.value
        else
            return buttons.value.filter((a) => a.type != 'cancel')
    } else {
        return buttons.value.filter((a) => a.type == 'close');
    }
})

const confirmModalValue = ref(new ConfirmModalType());
const confirmDialog = ref(false);

const toCancelFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        text: "general.cancelDescription",
        buttonLoading: false,
        isDescriptionField: true,
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ?? '';
            confirmModalValue.value.buttonLoading = true
            usePaymentStore().cancelAdvance(props.selectedItem.id, reason).then(() => {
                props.selectedItem.approvementStatus = ApprovementStatusEnum.Cancelled;
                confirmDialog.value = true;
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false
            });
        }
    }
}

</script>