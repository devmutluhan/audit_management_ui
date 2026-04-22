<template>
    <v-form ref="customerOfferInfoRef">
        <v-row>
            <v-col :cols="offerCreateCardCols">
                <CustomerInformation></CustomerInformation>
            </v-col>
            <v-col :cols="offerCreateCardCols">
                <OfferInformation></OfferInformation>
            </v-col>
            <v-col cols="12">
                <v-row class="d-flex align-center justify-center">
                    <v-col cols="6" md="3" lg="2">
                        <GeneralButton color="cancelButtonColor" prependIcon="mdi-arrow-left-circle-outline"
                            title="general.back" @click="emit('clickBack')" variant="outlined" size="x-large" block>
                        </GeneralButton>
                    </v-col>
                    <v-col cols="6" md="3" lg="2">
                        <GeneralButton appendIcon="mdi-arrow-right-circle-outline" title="general.next"
                            @click="clickNext" size="x-large" block>
                        </GeneralButton>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { offerCreateCardCols } from '@/core/helpers/contentWidth';
import CustomerInformation from './CustomerInformation.vue';
import OfferInformation from './OfferInformation.vue';
import { ref } from 'vue';
import GeneralButton from '@/components/formInput/generalInputs/GeneralButton.vue';
const emit = defineEmits(['clickNext', 'clickBack']);

const customerOfferInfoRef = ref(null as any);

const clickNext = () => {
    customerOfferInfoRef.value.validate().then((res: any) => {
        if (res.valid) {
            emit('clickNext')
        }
    })
}

</script>