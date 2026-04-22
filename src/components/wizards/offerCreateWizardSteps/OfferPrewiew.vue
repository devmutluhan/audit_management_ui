<template>
    <v-card border="false" class="fill-height">
        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <CustomerInfoCard :createOfferCommand="createOfferCommand" />
                </v-col>
                <v-col cols="12" md="6">
                    <OfferInfoCard :createOfferCommand="createOfferCommand" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <OfferContentInfoCard :createOfferCommand="createOfferCommand" />
                </v-col>
            </v-row>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="6" md="3" lg="2">
                    <GeneralButton color="cancelButtonColor" prependIcon="mdi-arrow-left-circle-outline"
                        title="general.back" @click="emit('clickBack')" variant="outlined" size="x-large" block>
                    </GeneralButton>
                </v-col>
                <v-col cols="6" md="3" lg="2">
                    <GeneralButton prependIcon="mdi-content-save-outline" title="general.save" @click="createOffer"
                        :loading="loading" size="x-large" block>
                    </GeneralButton>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import CustomerInfoCard from '@/components/cards/offerCards/CustomerInfoCard.vue';
import OfferInfoCard from '@/components/cards/offerCards/OfferInfoCard.vue';
import OfferContentInfoCard from '@/components/cards/offerCards/OfferContentInfoCard.vue';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { storeToRefs } from 'pinia';
import { mappingModel } from '@/core/helpers/generalUtils';
import { CreateOfferCommand, CreateOfferRequest, OfferItemCommand } from '@/models/entities/crm/CrmOfferCommands';
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import GeneralButton from '@/components/formInput/generalInputs/GeneralButton.vue';
const router = useRouter();
const { createOfferCommand } = storeToRefs(useOfferStore());
const loading = ref(false);
const emit = defineEmits(['clickNext', 'clickBack']);

const createOffer = () => {
    loading.value = true;
    const createCommand = mappingModel(new CreateOfferCommand(), createOfferCommand.value) as CreateOfferCommand;
    createCommand.items = createOfferCommand.value.items.map((element: OfferItemDto) => {
        element['serviceId'] = element.service.id
        element['serviceGroupId'] = element.serviceGroup.id
        element['positionId'] = element.position?.id ?? null
        element['oivRate'] = element.oivRate ?? 0
        element['otvRate'] = element.otvRate ?? 0
        return mappingModel(new OfferItemCommand(), element) as OfferItemCommand;
    });

    useOfferStore().createOffer(createCommand).then((res) => {
        router.push({ name: 'offer-detail', params: { id: res.data } });
        sessionStorage.removeItem('create-offer-info');
        setTimeout(() => {
            createOfferCommand.value = new CreateOfferRequest();
        }, 1000)
    }).catch((error) => {
        return catchError(error, () => { createOffer() });
    }).finally(() => {
        loading.value = false;
    })
}

</script>