<template>
    <DialogContent title="general.addPositionCost" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="addPositionPriceForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12">
                                <SingleAutocompleteInput v-model="commandModel.positionId" label="form.position"
                                    :items="positionList" item-title="name" item-value="id" justId isRequired />
                            </v-col>
                            <v-col cols="12" class="px-0 pt-0">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" v-for="(item, index) in commandModel.prices" :key='index'>
                                <v-card>
                                    <v-card-text>
                                        <v-row>
                                            <v-col class="text-h6 font-weight-bold">
                                                {{ index + 1 }}. {{ $t('form.positionCost') }}
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-btn color="error" @click="commandModel.prices.splice(index, 1)">
                                                    {{ $t('general.delete') }}
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row class="d-flex align-center">
                                            <v-col cols="12" md="6">
                                                <SingleAutocompleteInput v-model="item.currencyCode"
                                                    label="form.currencyCode" isRequired item-title="code"
                                                    item-value="code" :items="currencies" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <DateInput v-model="item.validityDate" label="form.validityDate" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <TextField v-model="item.costPrice" label="form.costPrice" isRequired
                                                    isPrice :suffix="item.currencyCode" />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <TextField v-model="item.sellPrice" label="form.salesPrice" isRequired
                                                    isPrice :suffix="item.currencyCode" />
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12">
                                <AddButtonCard v-model="commandModel.prices" title="form.addCost"
                                    :validationRef="addPositionPriceForm" :addItemFunc="addStepFunction" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { CreatePositionPriceCommand } from '@/models/entities/crm/CrmServiceCommands';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { storeToRefs } from 'pinia';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';

const { currencies } = storeToRefs(useGeneralStore())
const { positionList } = storeToRefs(useManagementDtoStore())
useManagementDtoStore().getPositionList({ pageSize: 1000, pageNumber: 1 });
useGeneralStore().getCurrencies();

const commandModel = ref(new CreatePositionPriceCommand())
const emit = defineEmits(['createItem']);

const addPositionPriceForm = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addPositionPrice = () => {
    addPositionPriceForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true
            useCrmServiceStore().createPositionPrice(commandModel.value).then((res: any) => {
                props.dialogClose();
                const addedItems = commandModel.value.prices.map((a) => {
                    return {
                        positionId: commandModel.value.positionId,
                        positionName: positionList.value.find((x) => x.id == commandModel.value.positionId)?.name,
                        currency: { code: a.currencyCode, symbol: currencies.value.find((x) => x.code == a.currencyCode)?.symbol },
                        costPrice: a.costPrice,
                        isPassive: false,
                        isValid: true,
                        validityDate: a.validityDate,
                        sellPrice: a.sellPrice
                    }
                });
                emit('createItem', addedItems);
            }).catch((error) => {
                return catchError(error, () => { addPositionPrice() })
            }).finally(() => {
                buttons.value[1].loading = false
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

const addStepFunction = () => {
    commandModel.value.prices.push({
        currencyCode: "",
        costPrice: 0,
        sellPrice: 0,
        validityDate: null
    });
}
</script>