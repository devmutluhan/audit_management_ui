<template>
    <DialogContent title="general.addPositionCost" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addPositionPriceForm">
                <v-row class="d-flex align-center" v-if="commandModel.prices.length > 0">
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="commandModel.prices[0].currencyCode" label="form.currencyCode"
                            isRequired item-title="code" item-value="code" :items="[]" disabled />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput v-model="commandModel.prices[0].validityDate" label="form.validityDate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.prices[0].costPrice" label="form.costPrice" isRequired isPrice
                            :suffix="commandModel.prices[0].currencyCode" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.prices[0].sellPrice" label="form.salesPrice" isRequired isPrice
                            :suffix="commandModel.prices[0].currencyCode" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { CreatePositionPriceCommand } from '@/models/entities/crm/CrmServiceCommands';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import { onMounted } from 'vue';
import moment from 'moment';
import type { PropType } from 'vue';
import type { PositionPricesDto } from '@/models/entities/crm/CrmServiceDtos';

const commandModel = ref(new CreatePositionPriceCommand())
const emit = defineEmits(['createItem']);
const loading = ref(false)

const addPositionPriceForm = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: Object as PropType<PositionPricesDto>,
        required: true
    }
});

onMounted(() => {
    if (props.selectedItem) {
        const date = moment(new Date()).add('year', 1).format('YYYY-MM-DD');
        commandModel.value.positionId = props.selectedItem.positionId;
        commandModel.value.prices.push({
            currencyCode: props.selectedItem.currency.code,
            costPrice: null,
            sellPrice: null,
            validityDate: date
        })
    }
})

const addPositionPrice = () => {
    addPositionPriceForm.value.validate().then((res: any) => {
        if (res.valid) {
            loading.value = true;
            useCrmServiceStore().createPositionPrice(commandModel.value).then((res: any) => {
                props.dialogClose();
                emit('createItem', {
                    positionId: commandModel.value.positionId,
                    positionName: props.selectedItem.positionName,
                    isPassive: false,
                    isValid: true,
                    costPrice: commandModel.value.prices[0].costPrice,
                    sellPrice: commandModel.value.prices[0].sellPrice,
                    validityDate: commandModel.value.prices[0].validityDate,
                    currency: { symbol: '', code: commandModel.value.prices[0].currencyCode }
                })
            }).catch((error) => {
                return catchError(error, () => { addPositionPrice() })
            }).finally(() => {
                loading.value = false;
            })
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: addPositionPrice,
        loading: false
    }
])

</script>