<template>
    <v-card height="230px">
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.customerInformation') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text v-if="createOfferCommand.customer">
            <v-row>
                <v-col>
                    <p class="mb-1">{{ $t('form.customerName') }}</p>
                    <p class="mb-1 font-weight-medium">{{ createOfferCommand.customer.name }}</p>
                </v-col>
                <v-col>
                    <p class="mb-1">{{ $t('form.termTime') }}</p>
                    <p class="mb-1 font-weight-medium">
                        {{ createOfferCommand.termTime }}
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <p class="mb-1">{{ $t('form.customerAddress') }}</p>
                    <p class="mb-1 font-weight-medium" v-if="createOfferCommand.address">
                        {{ createOfferCommand.address.countryName }} /
                        {{ createOfferCommand.address.city }} <br>
                        {{ createOfferCommand.address.street }} <br>
                    </p>
                    <p class="mb-1 font-weight-medium" v-else>
                        --
                    </p>
                </v-col>
                <v-col>
                    <p class="mb-1">{{ $t('general.customerRepresentative') }} :</p>
                    <v-row>
                        <v-col cols="12" v-if="createOfferCommand.representative">
                            <p class="mb-0 font-weight-medium text-blue-accent-3">
                                {{ createOfferCommand.representative.fullName }}
                            </p>
                            <p class="mb-0 font-weight-medium text-truncate">
                                {{ createOfferCommand.representative.email }} </p>
                        </v-col>
                        <v-col cols="12" v-else>
                            <p class="mb-0 font-weight-medium text-blue-accent-3">
                                --
                            </p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <NoDataCard />
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