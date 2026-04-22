<template>
    <DialogContent :title="isUpdated ? 'general.updateTax' : 'general.createTax'" :buttons="buttons"
        :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateTaxRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="updateTaxCommand.name" label="form.title" hideDetails />
                    </v-col>

                    <v-col cols="12">
                        <SingleAutocompleteInput v-model="updateTaxCommand.taxType" label="form.taxType" hideDetails
                            :items="taxTypes" item-title="title" item-value="value" />
                    </v-col>

                    <v-col cols="12">
                        <TextField v-model="updateTaxCommand.rate" label="form.taxRate" hideDetails isNumber />
                    </v-col>

                    <v-col cols="12" v-if="updateTaxCommand.taxType === TaxTypeEnum.Tevkifat">
                        <TextField v-model="updateTaxCommand.formula" label="form.formula" hideDetails
                            @keyup.enter="clickSubmit()" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { CreateTaxCommand, UpdateTaxCommand } from '@/models/entities/general/GeneralCommands';
import { catchError } from '@/core/helpers/generalResponse';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';
import type { ApiResult } from '@/models/ApiResult';
import { mappingModel } from '@/core/helpers/generalUtils';
import type { TaxDto } from '@/models/entities/general/GeneralDtos';
import { TaxTypeEnum } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';

const emit = defineEmits(['createItem']);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    updateItem: {
        type: Object as any,
        default: null
    },
    isUpdated: {
        type: Boolean,
        default: false
    }
});

const taxTypes = computed(() => {
    return enumToArray(TaxTypeEnum);
});

const updateTaxCommand = ref(new UpdateTaxCommand());

const taxStore = useTaxStore();
const { taxList } = storeToRefs(taxStore);
const updateTaxRef = ref(null as any);

const clickSubmit = () => {
    buttons.value[1].loading = true;
    if (!props.isUpdated) {
        createTax()
    } else {
        updateTax()
    }
}


const createTax = () => {
    updateTaxRef.value.validate().then((res: any) => {
        if (res.valid) {
            if (updateTaxCommand.value.taxType != TaxTypeEnum.Tevkifat) {
                updateTaxCommand.value.formula = ''
            }
            const createTaxOfficeCommand = mappingModel(new CreateTaxCommand(), updateTaxCommand.value)
            taxStore.createTax(createTaxOfficeCommand).then((res: ApiResult<string>) => {
                taxList.value.unshift({
                    id: res.data,
                    name: updateTaxCommand.value.name,
                    taxType: updateTaxCommand.value.taxType ?? TaxTypeEnum.Kdv,
                    rate: updateTaxCommand.value.rate ?? '',
                    formula: updateTaxCommand.value.formula
                });
                props.dialogClose();
                updateTaxCommand.value = new UpdateTaxCommand();
            }).catch((error) => {
                return catchError(error, () => createTax());
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    })
}

const updateTax = () => {
    updateTaxRef.value.validate().then((res: any) => {
        if (res.valid) {
            if (updateTaxCommand.value.taxType != TaxTypeEnum.Tevkifat) {
                updateTaxCommand.value.formula = ''
            }
            taxStore.updateTax(updateTaxCommand.value).then((res: ApiResult<string>) => {
                const index = taxList.value.findIndex((x: TaxDto) => x.id == updateTaxCommand.value.id);
                if (index != -1) {
                    taxList.value[index] = updateTaxCommand.value;
                }
                props.dialogClose();
                updateTaxCommand.value = new UpdateTaxCommand();
            }).catch((error) => {
                return catchError(error, () => updateTax());
            }).finally(() => {
                buttons.value[1].loading = false;
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
        click: clickSubmit,
        loading: false
    }
])

onMounted(() => {
    if (props.isUpdated) {
        updateTaxCommand.value.id = props.updateItem.id;
        updateTaxCommand.value.name = props.updateItem.name;
        updateTaxCommand.value.formula = props.updateItem.formula;
        updateTaxCommand.value.rate = props.updateItem.rate;
        updateTaxCommand.value.taxType = props.updateItem.taxType;
    }
})
</script>