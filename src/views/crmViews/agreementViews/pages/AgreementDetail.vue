<template>
    <v-row fluid class="pa-0">
        <v-col cols="12">
            <AgreementDetailHeaderCard :agreementDetail="agreementDetail"
                @convert-to-project="convertToProjectDialog = true" @cancel-agreement="cancelAgreement"
                :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12" md="8">
            <AgreementInfoDetailCard :agreementDetail="agreementDetail" :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12" md="4">
            <AgreementEmployeesCard :agreementDetail="agreementDetail" :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12">
            <AgreementContentInfoDetailCard :agreementDetail="agreementDetail" />
        </v-col>
        <v-col cols="12"
            v-if="agreementDetail.manageAgreement && agreementDetail.requestApproval.status == ApprovementStatusEnum.Approved && !agreementDetail.convertedProjectId">
            <v-row class="d-flex justify-center">
                <v-col cols="auto" v-if="hasClaimOrModules(['CanConvertToProject'])">
                    <v-btn color="confirmButtonColor" size="x-large" @click="convertToProjectDialog = true">
                        {{ $t('general.convertToProject') }}
                    </v-btn>
                    <VDialogContent v-model="convertToProjectDialog">
                        <ConvertToProjectDialog :dialogClose="() => { convertToProjectDialog = false }"
                            :selected-agreement="agreementDetail" />
                    </VDialogContent>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="error" size="x-large" @click="cancelAgreement">
                        {{ $t('general.toCancel') }}
                    </v-btn>
                </v-col>
            </v-row>
            <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AgreementInfoDetailCard from '@/components/cards/offerCards/AgreementInfoDetailCard.vue';
import AgreementDetailHeaderCard from '@/components/cards/offerCards/AgreementDetailHeaderCard.vue';
import AgreementContentInfoDetailCard from '@/components/cards/offerCards/AgreementContentInfoDetailCard.vue';
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { useAgreementStore } from '@/stores/crmStores/agreementStore';
import type { GeneralDropdownType } from "@/models/types";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { ConfirmModalType } from '@/models/types';
import { useRoute } from 'vue-router';
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { catchError } from '@/core/helpers/generalResponse';
import AgreementEmployeesCard from '@/components/cards/offerCards/AgreementEmployeesCard.vue';
import ConvertToProjectDialog from '@/components/dialogs/crm/ConvertToProjectDialog.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const route = useRoute();

const { agreementDetail } = storeToRefs(useAgreementStore());
useAgreementStore().getAgreementDetail(route.params.id.toString());

const convertToProjectDialog = ref(false)
const confirmDialog = ref(false)
const confirmModalValue = ref(new ConfirmModalType())

const isUpdated = computed(() => {
    return !agreementDetail.value.convertedProjectId && agreementDetail.value.manageAgreement;
})

const cancelAgreement = () => {
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
            useAgreementStore().cancelAgreement(route.params.id.toString(), reason).then(() => {
                confirmDialog.value = false;
                agreementDetail.value.requestApproval.status = ApprovementStatusEnum.Cancelled;
                agreementDetail.value.requestApproval.cancellationMessage = reason;
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

</script>