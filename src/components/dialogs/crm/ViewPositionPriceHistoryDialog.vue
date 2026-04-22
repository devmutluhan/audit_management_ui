<template>
    <DialogContent title="general.viewPositionPriceHistory" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-eye">
        <template v-slot:dialogBody>
            <v-row>
                <v-col class="text-h6 font-weight-bold">
                    {{ props.selectedItem.positionName + ' (' + props.selectedItem.currency.code + ') ' }}
                </v-col>
            </v-row>
            <v-row class="d-flex align-center" v-if="positionPriceHistory.length > 0">
                <v-col cols="12" v-for="(item, index) in positionPriceHistory" :key="index">
                    <v-card>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" class="py-2 text-body-1">
                                    <span class="font-weight-bold">{{ $t('list.costPrice') }} :</span>
                                    {{ formatterPriceForCurrencyName(item.costPrice,
                                        props.selectedItem.currency.code) }}
                                </v-col>
                                <v-col cols="12" class="py-2 text-body-1">
                                    <span class="font-weight-bold">{{ $t('list.salePrice') }} :</span>
                                    {{ formatterPriceForCurrencyName(item.sellPrice,
                                        props.selectedItem.currency.code) }}
                                </v-col>
                                <v-col cols="12" class="py-2 text-body-1">
                                    <span class="font-weight-bold">{{ $t('list.createdBy') }} :</span>
                                    {{ item.createdByName }}
                                </v-col>
                                <v-col cols="12" class="py-2 text-body-1">
                                    <span class="font-weight-bold">{{ $t('form.createdAt') }} :</span>
                                    {{ formatterDateFromHours(item.createdAt) }}
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else class="d-flex align-center">
                <v-col cols="12">
                    <NoDataCard />
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { storeToRefs } from 'pinia';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { onMounted } from 'vue';
import { formatterDateFromHours } from '@/core/helpers/dateUtils';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import NoDataCard from '@/components/list/cards/NoDataCard.vue';

const { positionPriceHistory } = storeToRefs(useCrmServiceStore());
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    }
});

onMounted(() => {
    if (props.selectedItem.id)
        useCrmServiceStore().getPositionPriceHistoryList(props.selectedItem.id)
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    }
]);

</script>