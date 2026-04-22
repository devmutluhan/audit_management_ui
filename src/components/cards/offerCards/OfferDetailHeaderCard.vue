<template>
    <v-card>
        <v-card-text>
            <v-row class="d-flex align-center">
                <v-col cols="auto pr-0 pr-md-4">
                    <v-avatar :rounded="true" :size="140">
                        <v-img :src="offerImage" cover></v-img>
                    </v-avatar>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4">
                    <p class="text-h6 font-weight-bold mb-1">
                        {{ offerDetail.offerCode }}
                        <v-chip size="small" class="font-weight-bold text-body-2 ml-4"
                            :color="offerDetail.isExpenseIncluded ? 'success' : 'error'">
                            {{ $t('form.expense') }}: {{ offerDetail.isExpenseIncluded ? $t('list.include')
                                :
                                $t('list.exclude') }}
                        </v-chip>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.salesRepresentative') }}:
                        <span class=" font-weight-bold">
                            {{ offerDetail.salesRepresentative.firstName + ' ' +
                                offerDetail.salesRepresentative.lastName }}
                        </span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('list.subTotal') }}:
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(offerDetail.subTotal,
                                offerDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1">
                        {{ $t('form.totalAmount') }}:
                        <span class="text-warning font-weight-bold">{{
                            formatterPriceForCurrencyName(offerDetail.finalTotal,
                                offerDetail.defaultCurrency.code) }}</span>
                    </p>
                    <p class="text-body-1 mb-1" v-if="offerDetail.hasRiskLevel">
                        <v-btn @click="viewRiskFormDialog = true">{{ $t('list.viewRiskFormAnswers') }}</v-btn>
                    </p>
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="pl-0 pl-sm-4" cols="auto">
                    <VDialogContent>
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-chip v-bind="approvementStatus ? activatorProps : null" class="font-weight-bold"
                                :color="getChipColor(offerDetail.requestApproval.status)">
                                {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                                    offerDetail.requestApproval.status)?.title}}
                            </v-chip>
                            <p class="ma-0 mt-1 text-error"
                                v-if="offerDetail.requestApproval.status == ApprovementStatusEnum.Cancelled">
                                {{ offerDetail.requestApproval.cancellationMessage }}
                            </p>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <PreviewApprovalProcessOfferDialog :dialog-close="() => { isActive.value = false }"
                                :requestApproval="offerDetail.requestApproval" />
                        </template>
                    </VDialogContent>
                </v-col>
                <v-col cols="auto pr-0 pr-md-4" v-if="!isView && initialMenuItems.length > 0">
                    <GeneralDropdown :menuItems="initialMenuItems"></GeneralDropdown>
                </v-col>
            </v-row>
        </v-card-text>
        <VDialogContent v-model="updateDialog">
            <UpdateOfferInformationDialog :dialog-close="() => { updateDialog = false }" :selected-item="offerDetail" />
        </VDialogContent>
        <VDialogContent v-model="viewRiskFormDialog">
            <ViewOfferRiskFormDialog :dialog-close="() => { viewRiskFormDialog = false }" :offerId="offerDetail.id" />
        </VDialogContent>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { formatterPriceForCurrencyName, getChipColor } from '@/core/helpers/generalUtils';
import { getAssetPath } from '@/core/helpers/assets';
import { enumToArray } from '@/core/helpers/enumToArray';
import PreviewApprovalProcessOfferDialog from '@/components/dialogs/crm/PreviewApprovalProcessOfferDialog.vue'
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import UpdateOfferInformationDialog from '@/components/dialogs/crm/UpdateOfferInformationDialog.vue';
import type { GeneralDropdownType } from '@/models/types';
import { themeMode } from '@/layouts/default-layout/config/helper';
import { OfferDetailDto } from '@/models/entities/crm/CrmOfferDtos';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import ViewOfferRiskFormDialog from '@/components/dialogs/crm/ViewOfferRiskFormDialog.vue';

const emit = defineEmits(['cancelOffer', 'convertToAgreement', 'sendForApproval'])

const offerImage = computed(() => {
    if (themeMode.value !== 'dark') {
        return getAssetPath("media/auth/agency.png")
    } else {
        return getAssetPath("media/auth/agency-dark.png");
    }
})

const approvementStatus = computed(() => {
    return props.offerDetail.requestApproval.status != ApprovementStatusEnum.Draft && props.offerDetail.requestApproval.status != ApprovementStatusEnum.Cancelled
})

const props = defineProps({
    offerDetail: {
        type: Object as PropType<OfferDetailDto>,
        required: true,
        default: new OfferDetailDto()
    },
    isUpdated: {
        type: Boolean,
        required: true,
        default: true
    },
    sendApprovalButtonVisible: {
        type: Boolean,
        required: true,
        default: true
    },
    convertToAgreementButtonVisible: {
        type: Boolean,
        required: true,
        default: true
    },
    toCancelButtonVisible: {
        type: Boolean,
        required: true,
        default: true
    },
    isView: {
        type: Boolean,
        required: true,
        default: true
    },
})

const updateDialog = ref(false)
const viewRiskFormDialog = ref(false)
const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.update",
        action: () => updateDialog.value = true,
    },
    {
        id: 2,
        title: "general.convertToAgreement",
        action: () => emit('convertToAgreement'),
    },
    {
        id: 3,
        title: "general.sendForApproval",
        action: () => emit('sendForApproval'),
    },
    {
        id: 4,
        title: "general.toCancel",
        action: () => emit('cancelOffer'),
    },
]);

const initialMenuItems = computed(() => {
    let result = new Array<GeneralDropdownType>()

    if (props.isUpdated)
        result.push(menuItems.value[menuItems.value.findIndex((a) => a.id == 1)])

    if (props.convertToAgreementButtonVisible)
        result.push(menuItems.value[menuItems.value.findIndex((a) => a.id == 2)])

    if (props.sendApprovalButtonVisible)
        result.push(menuItems.value[menuItems.value.findIndex((a) => a.id == 3)])

    if (props.toCancelButtonVisible)
        result.push(menuItems.value[menuItems.value.findIndex((a) => a.id == 4)])

    return result
})

</script>