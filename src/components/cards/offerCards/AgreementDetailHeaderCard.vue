<template>
    <v-card>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="auto pr-0 pr-md-4">
                    <v-avatar :rounded="true" :size="140">
                        <v-img :src="getAssetPath('media/auth/img-24.jpg')" cover></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4">
                    <p class="text-h6 font-weight-bold mb-1">
                        {{ agreementDetail.title }}
                        <v-chip class="font-weight-bold text-body-2 ml-4"
                            :color="agreementDetail.isExpenseIncluded ? 'success' : 'error'">
                            {{ $t('form.expense') }}: {{ agreementDetail.isExpenseIncluded ? $t('list.include')
                                :
                                $t('list.exclude') }}
                        </v-chip>
                    </p>
                    <p class="text-body-1 text-blue-accent-3 font-weight-bold mb-1">
                        {{ agreementDetail.agreementCode }}
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.subTotal') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(agreementDetail.subTotal,
                                agreementDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.totalAmount') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(agreementDetail.finalTotal,
                                agreementDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.expenseLimit') }} :
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(agreementDetail.expenseLimit,
                                agreementDetail.defaultCurrency.code) }}</span>
                    </p>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="pl-0 pl-sm-4" cols="auto"
                    v-if="agreementDetail.requestApproval.status !== ApprovementStatusEnum.Approved">
                    <v-chip class="font-weight-bold" :color="getChipColor(agreementDetail.requestApproval.status)">
                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                            agreementDetail.requestApproval.status)?.title}}
                    </v-chip>
                    <p class="text-error ma-0">
                        {{ agreementDetail.requestApproval.cancellationMessage }}
                    </p>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4"
                    v-if="agreementDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                    <GeneralDropdown :menuItems="menuItems"></GeneralDropdown>
                </v-col>
            </v-row>
        </v-card-text>
        <VDialogContent v-model="updateDialog">
            <UpdateAgreementInformationDialog :dialog-close="() => { updateDialog = false }"
                :selected-item="agreementDetail" />
        </VDialogContent>
    </v-card>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import { getAssetPath } from '@/core/helpers/assets';
import UpdateAgreementInformationDialog from '@/components/dialogs/crm/UpdateAgreementInformationDialog.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { AgreementDetailDto } from '@/models/entities/crm/CrmAgreementDtos';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import type { GeneralDropdownType } from '@/models/types';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const emit = defineEmits(['cancelAgreement', 'convertToProject', 'updateAgreement'])
const props = defineProps({
    agreementDetail: {
        type: Object as PropType<AgreementDetailDto>,
        required: true,
        default: new AgreementDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

const updateDialog = ref(false)
const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: () => updateDialog.value = true
    },
    {
        title: "general.convertToProject",
        action: () => emit('convertToProject')
    },
    {
        title: "general.toCancel",
        action: () => emit('cancelAgreement')
    }
]);

</script>