<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col class="pr-0 pr-sm-4" cols="3" sm="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerInformation') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="pl-0 pl-sm-4" cols="auto" v-if="isUpdated">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-pencil"
                            class="text-capitalize">
                            {{ $t('general.update') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <UpdateOfferInformationDialog :dialog-close="() => { isActive.value = false }"
                            :selected-item="offerDetail" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="6" md="3">
                    <p class="mb-1 text-body-1">{{ $t('form.customerName') }}:</p>
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                            <p v-bind="props" class="mb-1 font-weight-bold text-blue-accent-3 text-body-1">
                                {{ offerDetail.customer.name }}
                            </p>
                        </template>
                        <v-row>
                            <v-col>
                                <v-card border="false">
                                    <v-card-text>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('form.customerAddress') }}: </p>
                                            <p class="mb-1 font-weight-bold text-body-2" v-if="offerDetail.address">
                                                {{ offerDetail.address.countryName }} /
                                                {{ offerDetail.address.city }} <br>
                                                {{ offerDetail.address.street }} <br>
                                            </p>
                                            <p class="mb-1 font-weight-medium" v-else>
                                                --
                                            </p>
                                        </v-col>
                                        <v-divider></v-divider>
                                        <v-col cols="12" class="pa-0">
                                            <p class="mb-1 text-body-1">{{ $t('general.customerRepresentative') }}:</p>
                                            <v-row class="font-weight-bold text-body-2">
                                                <v-col cols="12" v-if="offerDetail.representative">
                                                    <p class="mb-0 text-blue-accent-3">
                                                        {{ offerDetail.representative.fullName }}
                                                    </p>
                                                    <p class="mb-0 text-truncate">
                                                        {{ offerDetail.representative.email }} </p>
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
                <v-col cols="6" md="3">
                    <p class="mb-1 text-body-1"> {{ $t('form.documentDate') }}:</p>
                    <p class="mb-1 font-weight-bold text-body-1">
                        {{ formatterDate(offerDetail.documentDate) }}
                    </p>
                </v-col>
                <v-col cols="6" md="3">
                    <p class="mb-1 text-body-1">{{ $t('form.termTime') }}:</p>
                    <p class="mb-1 font-weight-bold text-body-1">
                        {{ offerDetail.termTime }}
                    </p>
                </v-col>
                <v-col cols="6" md="3" class="text-body-1">
                    <p class="mb-1">{{ $t('form.currencyCode') }}:
                        <span class="font-weight-bold">
                            {{ offerDetail.defaultCurrency.code }}
                        </span>
                    </p>
                    <p class="mb-1">
                        {{ $t('form.exchangeRateAgreement') }}:
                        <span class="font-weight-bold">
                            {{ offerDetail.exchangeRateAgreement ?
                                offerDetail.exchangeRateAgreement : '-' }}
                        </span>
                    </p>
                </v-col>
                <v-col cols="6">
                    <p class="mb-1 text-body-1">{{ $t('form.description') }}:</p>
                    <p class="mb-1 font-weight-medium text-body-2">
                        {{ offerDetail.description }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { OfferDetailDto } from '@/models/entities/crm/CrmOfferDtos';
import type { PropType } from 'vue';
import { formatterDate } from '@/core/helpers/dateUtils';
import UpdateOfferInformationDialog from '@/components/dialogs/crm/UpdateOfferInformationDialog.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const props = defineProps({
    offerDetail: {
        type: Object as PropType<OfferDetailDto>,
        required: true,
        default: new OfferDetailDto()
    },
    isUpdated: {
        type: Boolean,
        required: false,
        default: false
    }
})

</script>