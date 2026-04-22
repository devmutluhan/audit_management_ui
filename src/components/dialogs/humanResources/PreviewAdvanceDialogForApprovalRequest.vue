<template>
    <DialogContent title="general.requestAdvance" :dialogClose="dialogClose" :buttons="filterButtons"
        titleIcon="mdi-cash">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
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
                                    <v-chip class="font-weight-bold" :color="getChipColor(selectedItem.status)">
                                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                            selectedItem.status)?.title}}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.isPaidStatus') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0"
                                    :class="selectedItem.isPaid ? 'text-priceTextColor' : 'text-error'">
                                    {{ selectedItem.isPaid ? $t('list.paid') : $t('list.notPaid') }}
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
                                    {{ formatterDate(selectedItem.createdAt) }}
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
                                    {{ formatterDateFromHours(selectedItem.createdAt) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="py-0">
                                    {{ $t('form.totalAmount') }}
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col class="text-right py-0 text-priceTextColor">
                                    {{ formatterPriceForCurrencyName(selectedItem.amount, selectedItem.currency) }}
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { formatterDate, formatterDateFromHours } from '@/core/helpers/dateUtils';
import { enumToArray } from '@/core/helpers/enumToArray';
import { ConfirmModalType } from '@/models/types';
import { catchError } from '@/core/helpers/generalResponse';
import type { AdvanceApprovalRequestListDto } from '@/models/entities/humanResource/PaymentModels';
import { usePaymentStore } from '@/stores/humanResourcesStores/paymentStore';

const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType());

const emit = defineEmits(['advance']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<AdvanceApprovalRequestListDto>,
        required: true
    }
});

const filterButtons = computed(() => {
    if (props.selectedItem.status == ApprovementStatusEnum.Approved || props.selectedItem.status == ApprovementStatusEnum.Cancelled) {
        return buttons.value.filter((a) => a.type == 'close');
    } else if (props.selectedItem.status == ApprovementStatusEnum.Waiting) {
        return buttons.value
    }
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'approve',
        click: () => approveFunc(),
        loading: false
    },
    {
        type: 'reject',
        click: () => rejectFunc(),
        loading: false
    },
    {
        type: 'sendBack',
        click: () => sendBackFunc(),
        loading: false
    }
]);

const approveFunc = () => {
    buttons.value[1].loading = true;
    usePaymentStore().approveAdvance(props.selectedItem.id).then(() => {
        props.dialogClose();
        emit('advance', props.selectedItem.id);
    }).catch((error) => {
        return catchError(error, () => { approveFunc() })
    }).finally(() => {
        buttons.value[1].loading = false;
    });
}

const rejectFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.reject',
        isDescriptionField: true,
        text: "general.rejectDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            usePaymentStore().rejectAdvance(props.selectedItem.id, reason).then(() => {
                confirmDialog.value = false;
                props.dialogClose();
                emit('advance', props.selectedItem.id);
            }).catch((error) => {
                return catchError(error, () => { rejectFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            });
        }
    }
}

const sendBackFunc = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.sendBack',
        isDescriptionField: true,
        text: "general.sendbackDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            usePaymentStore().sendbackAdvance(props.selectedItem.id, reason).then(() => {
                props.dialogClose();
                confirmDialog.value = false;
                emit('advance', props.selectedItem.id);
            }).catch((error) => {
                return catchError(error, () => { sendBackFunc() })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false;
            });
        }
    }
}

</script>