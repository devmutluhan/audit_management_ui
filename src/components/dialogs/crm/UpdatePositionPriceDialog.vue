<template>
    <DialogContent title="general.updatePositionCost" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="updatePositionPriceForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12" md="6">
                                <SingleAutocompleteInput v-model="commandModel.currencyCode" :disabled="true"
                                    label="form.currencyCode" isRequired item-title="code" item-value="code"
                                    :items="currencies" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <DateInput v-model="commandModel.validityDate" label="form.validityDate" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <TextField v-model="commandModel.costPrice" label="form.costPrice" isRequired />
                            </v-col>
                            <v-col cols="12" md="6">
                                <TextField v-model="commandModel.sellPrice" label="form.salesPrice" isRequired />
                            </v-col>
                            <v-col cols="12" md="6">
                                <SwitchInput v-model="commandModel.isPassive" label="general.setPassive" isRequired />
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
import { UpdatePositionPriceCommand } from '@/models/entities/crm/CrmServiceCommands';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { storeToRefs } from 'pinia';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { onMounted } from 'vue';

const { currencies } = storeToRefs(useGeneralStore());
useGeneralStore().getCurrencies();

const commandModel = ref(new UpdatePositionPriceCommand());
const emit = defineEmits(['createItem']);
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
const updatePositionPriceForm = ref(null as any);

const updatePositionPrice = () => {
    updatePositionPriceForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true
            useCrmServiceStore().updatePositionPrice(commandModel.value, props.selectedItem.positionId).then((res: any) => {
                props.dialogClose();
                props.selectedItem.costPrice = commandModel.value.costPrice;
                props.selectedItem.sellPrice = commandModel.value.sellPrice;
                props.selectedItem.isPassive = commandModel.value.isPassive;
                props.selectedItem.validityDate = commandModel.value.validityDate;

            }).catch((error) => {
                return catchError(error, () => { updatePositionPrice() })
            }).finally(() => {
                buttons.value[1].loading = false
            })
        }
    })
}

onMounted(() => {
    commandModel.value.costPrice = props.selectedItem.costPrice
    commandModel.value.sellPrice = props.selectedItem.sellPrice
    commandModel.value.isPassive = props.selectedItem.isPassive
    commandModel.value.validityDate = props.selectedItem.validityDate ?? null
    commandModel.value.currencyCode = props.selectedItem.currency.code
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: updatePositionPrice,
        loading: false
    }
]);

</script>