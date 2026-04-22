<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col class="pr-0 pr-sm-4" cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.agreementInformation') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="pl-0 pl-sm-4" cols="auto"
                v-if="agreementDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-pencil"
                            class="text-capitalize">
                            {{ $t('general.update') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <UpdateAgreementInformationDialog :dialog-close="() => { isActive.value = false }"
                            :selected-item="agreementDetail" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.customerName') }}:</p>
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <p v-bind="props" class="mb-1 font-weight-bold text-body-1">
                                {{ agreementDetail.customer.name }}
                            </p>
                        </template>
                        <v-row>
                            <v-col>
                                <v-card border="false">
                                    <v-card-text>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('form.customerAddress') }}: </p>
                                            <p class="mb-1 font-weight-bold text-body-2" v-if="agreementDetail.address">
                                                {{ agreementDetail.address.countryName }} /
                                                {{ agreementDetail.address.city }} <br>
                                                {{ agreementDetail.address.street }} <br>
                                            </p>
                                            <p class="mb-1 font-weight-medium" v-else>
                                                --
                                            </p>
                                        </v-col>
                                        <v-divider></v-divider>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('general.customerRepresentative') }}:</p>
                                            <v-row class="font-weight-bold text-body-2">
                                                <v-col cols="12" v-if="agreementDetail.representative">
                                                    <p class="mb-0 text-blue-accent-3">
                                                        {{ agreementDetail.representative.fullName }}
                                                    </p>
                                                    <p class="mb-0 text-truncate">
                                                        {{ agreementDetail.representative.email }} </p>
                                                </v-col>
                                                <v-col cols="12" v-else>
                                                    <p class="mb-0">
                                                        --
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-tooltip>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 font-weight-bold text-body-1"> {{ $t('form.agreementDate') }}:</p>
                    <p class="mb-1 text-body-1">
                        {{ $t('form.start') }}: {{ formatterDate(agreementDetail.startDate) }}
                    </p>
                    <p class="mb-1 text-body-1">
                        {{ $t('form.end') }}: {{ formatterDate(agreementDetail.endDate) }}
                    </p>
                </v-col>
                <v-col cols="6" md="4" v-if="agreementDetail.salesRepresentative">
                    <p class="mb-1 text-body-1">{{ $t('form.salesRepresentative') }}:</p>
                    <p class="mb-0 font-weight-bold text-body-1 text-blue-accent-3">
                        {{ agreementDetail.salesRepresentative.firstName + ' ' +
                            agreementDetail.salesRepresentative.lastName }}
                    </p>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.document') }}:</p>
                    <v-icon color="primary" size="32" class="mr-4" @click="downloadFile()">mdi-download</v-icon>
                    <v-icon color="success" size="32" @click="previewFile()">mdi-eye</v-icon>
                </v-col>
                <v-col cols="6" md="4" class="text-body-1">
                    <p class="mb-1">{{ $t('form.currencyCode') }}:
                        <span class="font-weight-bold">
                            {{ agreementDetail.defaultCurrency.code }}
                        </span>
                    </p>
                    <p class="mb-1">
                        {{ $t('form.exchangeRateAgreement') }}:
                        <span class="font-weight-bold">
                            {{ agreementDetail.exchangeRateAgreement ?
                                agreementDetail.exchangeRateAgreement : '-' }}
                        </span>
                    </p>
                </v-col>
                <v-col cols="6" md="4">
                    <p class="mb-1 text-body-1">{{ $t('form.description') }}:</p>
                    <p class="mb-1 font-weight-medium text-body-2">
                        {{ agreementDetail.description }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { formatterDate } from '@/core/helpers/dateUtils';
import { getFileUrl } from '@/core/helpers/assets';
import UpdateAgreementInformationDialog from '@/components/dialogs/crm/UpdateAgreementInformationDialog.vue';
import { AgreementDetailDto } from '@/models/entities/crm/CrmAgreementDtos';
import { ApprovementStatusEnum, FileCategoryEnum } from '@/models/custom/EnumTypes';
import axios from 'axios';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

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
});


const downloadFile = async () => {
    const queryParams = {
        fileUrl: props.agreementDetail.agreementDocumentUrl,
        category: FileCategoryEnum.Contract,
        decrypt: false
    };

    try {
        const response = await axios.get(import.meta.env.VITE_APP_API_URL + '/fileStorage/download', {
            params: queryParams,
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Dosya adını Content-Disposition başlığından çıkar
        const contentDisposition = response.headers['content-disposition'];
        let filename = props.agreementDetail.agreementCode;

        if (contentDisposition && contentDisposition.includes('filename=')) {
            const match = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;\n"']+)/i);
            if (match && match[1]) {
                filename = decodeURIComponent(match[1]);
            }
        }

        // Blob'u indir
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Dosya indirilemedi:', error);
    }
};

const previewFile = () => {
    const url = getFileUrl(props.agreementDetail.agreementDocumentUrl);
    if (!url) {
        return;
    }

    window.open(url, '_blank');
};

</script>