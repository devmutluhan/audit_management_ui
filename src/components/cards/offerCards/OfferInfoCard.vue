<template>
    <v-card height="230px">
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerInformation') }}</p>
            </v-col>
            <v-col v-if="createOfferCommand.currencyCode != 'TRY'">
                <p class="ma-0">{{ $t('form.currencyCode') + ': ' + createOfferCommand.currencyCode }}</p>
                <p class="ma-0">
                    {{ $t('form.exchangeRateAgreement') + ': ' }} {{ createOfferCommand.exchangeRateAgreement ?
                        createOfferCommand.exchangeRateAgreement : '-' }}
                </p>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col>
                    <p class="mb-1"> {{ $t('form.documentDate') }} : </p>
                    <p class="mb-1 font-weight-medium">
                        {{ createOfferCommand.documentDate }}
                    </p>
                </v-col>
                <v-col>
                    <p class="mb-1">{{ $t('form.isExpenseIncluded') }} :</p>
                    <v-chip :color="createOfferCommand.isExpenseIncluded ? 'success' : 'error'">
                        {{ createOfferCommand.isExpenseIncluded ? $t('list.include') : $t('list.exclude') }}
                    </v-chip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="mb-1">{{ $t('form.description') }} :</p>
                    <p class="mb-1 font-weight-medium">
                        {{ createOfferCommand.description }}
                    </p>
                </v-col>
                <v-col v-if="createOfferCommand.salesRepresentative">
                    <p class="mb-1">{{ $t('form.salesRepresentative') }} :</p>
                    <p class="mb-0 font-weight-medium text-blue-accent-3">
                        {{ createOfferCommand.salesRepresentative.firstName + ' ' +
                            createOfferCommand.salesRepresentative.lastName }}
                    </p>
                    <p class="mb-0 font-weight-medium text-truncate"
                        v-if="createOfferCommand.salesRepresentative.position">
                        {{
                            createOfferCommand.salesRepresentative.position }}
                    </p>
                    <p class="mb-0 font-weight-medium text-truncate"
                        v-if="createOfferCommand.salesRepresentative.workEmail">
                        {{
                            createOfferCommand.salesRepresentative.workEmail }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { CreateOfferRequest } from '@/models/entities/crm/CrmOfferCommands';
import NoDataCard from '@/components/list/cards/NoDataCard.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import type { PropType } from 'vue';


const props = defineProps({
    createOfferCommand: {
        type: Object as PropType<CreateOfferRequest>,
        required: true,
        default: new CreateOfferRequest()
    },
})

</script>