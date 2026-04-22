<template>
    <DialogContent :title="isUpdated ? 'general.updateTaxOffice' : 'general.createTaxOffice'" :buttons="buttons"
        :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateTaxOfficeRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="updateTaxOfficeCommand.code" label="form.taxOfficeCode" hideDetails />
                    </v-col>

                    <v-col cols="12">
                        <TextField v-model="updateTaxOfficeCommand.name" label="form.taxOfficeName" hideDetails
                            @keyup.enter="clickSubmit()" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { CreateTaxOfficeCommand, UpdateTaxOfficeCommand } from '@/models/entities/general/GeneralCommands';
import { catchError } from '@/core/helpers/generalResponse';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';
import type { ApiResult } from '@/models/ApiResult';
import { mappingModel } from '@/core/helpers/generalUtils';
import type { TaxOfficeDto } from '@/models/entities/general/GeneralDtos';

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

const updateTaxOfficeCommand = ref(new UpdateTaxOfficeCommand());

const taxStore = useTaxStore();
const { taxOfficeList } = storeToRefs(taxStore);
const updateTaxOfficeRef = ref(null as any);

const clickSubmit = () => {
    buttons.value[1].loading = true;
    if (!props.isUpdated) {
        createTaxOffice()
    } else {
        updateTaxOffice()
    }
}

const createTaxOffice = () => {
    updateTaxOfficeRef.value.validate().then((res: any) => {
        if (res.valid) {
            const createTaxOfficeCommand = mappingModel(new CreateTaxOfficeCommand(), updateTaxOfficeCommand.value)
            taxStore.createTaxOffice(createTaxOfficeCommand).then((res: ApiResult<string>) => {
                taxOfficeList.value.push({
                    id: res.data,
                    name: updateTaxOfficeCommand.value.name,
                    code: updateTaxOfficeCommand.value.code
                })
                props.dialogClose();
                updateTaxOfficeCommand.value = new UpdateTaxOfficeCommand();
            }).catch((error) => {
                return catchError(error, () => createTaxOffice());
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    })
}

const updateTaxOffice = () => {
    updateTaxOfficeRef.value.validate().then((res: any) => {
        if (res.valid) {
            taxStore.updateTaxOffice(updateTaxOfficeCommand.value).then((res: ApiResult<string>) => {
                const index = taxOfficeList.value.findIndex((x: TaxOfficeDto) => x.id == updateTaxOfficeCommand.value.id);
                if (index != -1) {
                    taxOfficeList.value[index] = updateTaxOfficeCommand.value;
                }
                props.dialogClose();
                updateTaxOfficeCommand.value = new UpdateTaxOfficeCommand();
            }).catch((error) => {
                return catchError(error, () => updateTaxOffice());
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
        updateTaxOfficeCommand.value.id = props.updateItem.id;
        updateTaxOfficeCommand.value.name = props.updateItem.name;
        updateTaxOfficeCommand.value.code = props.updateItem.code;
    }
})
</script>