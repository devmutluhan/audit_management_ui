<template>
    <v-container fluid class="pa-0">
        <v-row>
            <v-col cols="12">
                <OfferDetailHeaderCard :offerDetail="offerDetail" :isUpdated="isUpdated"
                    :sendApprovalButtonVisible="sendApprovalButtonVisible"
                    :convertToAgreementButtonVisible="convertToAgreementButtonVisible"
                    :toCancelButtonVisible="toCancelButtonVisible" :isView="isView"
                    @convertToAgreement="convertToAgreementDialog = true" @sendForApproval="sendApproveOffer"
                    @cancelOffer="cancelOffer" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <OfferInfoDetailCard :offerDetail="offerDetail" :isUpdated="isUpdated" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <OfferContentInfoDetailCard :offerDetail="offerDetail" :isUpdated="isUpdated"
                    @update-button="updateButtonItem = $event" />
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center" v-if="!isView">
            <v-col cols="auto" v-if="sendApprovalButtonVisible">
                <v-btn color="confirmButtonColor" size="x-large" :loading="loading" @click="sendApproveOffer();">
                    {{ $t('general.sendForApproval') }}
                </v-btn>
            </v-col>
            <v-col cols="auto" v-if="convertToAgreementButtonVisible">
                <v-btn color="confirmButtonColor" size="x-large" @click="convertToAgreementDialog = true">
                    {{ $t('general.convertToAgreement') }}
                </v-btn>
                <VDialogContent v-model="convertToAgreementDialog">
                    <ConvertToAgreementDialog :dialogClose="() => { convertToAgreementDialog = false }"
                        :selected-offer="offerDetail" :selected-services="selectedItemsForConvertAgreement" />
                </VDialogContent>
            </v-col>
            <v-col cols="auto" v-if="toCancelButtonVisible">
                <v-btn color="error" size="x-large" @click="cancelOffer" :disabled="loading">
                    {{ $t('general.toCancel') }}
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center" v-else>
            <v-col cols="auto">
                <v-btn size="x-large" color="approveButtonColor" :loading="loading" :disabled="loading"
                    @click="approveOffer">
                    {{ $t('general.approve') }}
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn size="x-large" color="warning" @click="sendbackOffer" :disabled="loading">
                    {{ $t('general.sendBack') }}
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn size="x-large" color="rejectButtonColor" @click="rejectOffer" :disabled="loading">
                    {{ $t('general.reject') }}
                </v-btn>
            </v-col>
        </v-row>
        <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
    </v-container>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useOfferStore } from "@/stores/crmStores/offerStore";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { storeToRefs } from "pinia";
import OfferContentInfoDetailCard from '@/components/cards/offerCards/OfferContentInfoDetailCard.vue';
import OfferInfoDetailCard from '@/components/cards/offerCards/OfferInfoDetailCard.vue';
import { OfferDetailDto, OfferItemDto } from "@/models/entities/crm/CrmOfferDtos";
import { ref, onMounted, computed } from "vue";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { catchError } from "@/core/helpers/generalResponse";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { ConfirmModalType } from "@/models/types";
import ConvertToAgreementDialog from "@/components/dialogs/crm/ConvertToAgreementDialog.vue";
import OfferDetailHeaderCard from "@/components/cards/offerCards/OfferDetailHeaderCard.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";

const { offerDetail, loading, selectedItemsForConvertAgreement } = storeToRefs(useOfferStore());
selectedItemsForConvertAgreement.value = new Array<OfferItemDto>()
const convertToAgreementDialog = ref(false)
const updateButtonItem = ref(false)
const confirmDialog = ref(false)
const confirmModalValue = ref(new ConfirmModalType())
useOfferStore().getOfferDetail(route.params.id.toString());

const isView = ref(false)
onMounted(() => {
    offerDetail.value = new OfferDetailDto();
    if (route.query.isView) {
        isView.value = route.query.isView == 'true' ? true : false
    }
})

const isUpdated = computed(() => {
    if (offerDetail.value.id)
        return (offerDetail.value.requestApproval.status == ApprovementStatusEnum.Draft || offerDetail.value.requestApproval.status == ApprovementStatusEnum.SendBack) && offerDetail.value.manageOffer
    else
        return false
})

const cancelButtonValid = computed(() => {
    if (offerDetail.value.id) {
        return offerDetail.value.requestApproval.status == ApprovementStatusEnum.Draft ||
            offerDetail.value.requestApproval.status == ApprovementStatusEnum.SendBack ||
            (offerDetail.value.requestApproval.status == ApprovementStatusEnum.Approved &&
                offerDetail.value.items.every(item => item.convertedAgreementId === null))
    }
    else
        return false
})

const sendApproveOffer = () => {
    loading.value = true
    useOfferStore().sendApproveOffer(route.params.id.toString()).then((res) => {
        // offerDetail.value.requestApproval.status = res.data.status;
        useOfferStore().getOfferDetail(route.params.id.toString());
    }).catch((error) => {
        return catchError(error, () => { sendApproveOffer() })
    }).finally(() => {
        loading.value = false
    })
}

const approveOffer = () => {
    loading.value = true
    // TODO risk statüs seçtirilecek
    useOfferStore().approveOffer(route.params.id.toString(), { selectedRiskStatus: null }).then((res) => {
        router.push({ name: 'offer-request' })
    }).catch((error) => {
        return catchError(error, () => { approveOffer() })
    }).finally(() => {
        loading.value = false
    })
}

const rejectOffer = () => {
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
            useOfferStore().rejectOffer(route.params.id.toString(), reason).then(() => {
                confirmDialog.value = false
                router.push({ name: 'offer-request' })
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true
            });
        }
    }
}

const cancelOffer = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.toCancel',
        isDescriptionField: true,
        text: "general.cancelDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            useOfferStore().cancelOffer(route.params.id.toString(), reason).then(() => {
                confirmDialog.value = false;
                offerDetail.value.requestApproval.status = ApprovementStatusEnum.Cancelled;
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

const sendbackOffer = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        title: 'general.sendback',
        buttonLoading: false,
        isDescriptionField: true,
        text: "general.sendbackDescription",
        descriptionField: "",
        action: () => {
            const reason = confirmModalValue.value.descriptionField ? confirmModalValue.value.descriptionField : '';
            confirmModalValue.value.buttonLoading = true
            useOfferStore().sendbackOffer(route.params.id.toString(), reason).then(() => {
                confirmDialog.value = false
                router.push({ name: 'offer-request' })
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true
            });
        }
    }
}

const sendApprovalButtonVisible = computed(() => {
    return isUpdated.value && !updateButtonItem.value && offerDetail.value.manageOffer
});
const convertToAgreementButtonVisible = computed(() => {
    return offerDetail.value.requestApproval.status == ApprovementStatusEnum.Approved && hasClaimOrModules(['CanConvertToAgreement']) && offerDetail.value.manageOffer && offerDetail.value.items.some((a) => !a.convertedAgreementId)
})
const toCancelButtonVisible = computed(() => {
    return cancelButtonValid.value && !updateButtonItem.value && offerDetail.value.manageOffer
})
</script>