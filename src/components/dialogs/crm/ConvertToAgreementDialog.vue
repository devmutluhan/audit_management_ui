<template>
    <DialogContent title="general.convertToAgreement" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="convertToAgreementForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <v-row>
                            <v-col cols="12" v-for="(item, index) in filteredServiceGroup()" :key="index">
                                <v-row class="text-body-2 d-flex align-center">
                                    <v-col class="px-0" cols="auto">
                                        <v-chip color="success" class="text-body-1 font-weight-bold">
                                            {{ item.serviceGroup.title }} :
                                        </v-chip>
                                    </v-col>
                                    <v-col>
                                        <span>
                                            {{filteredServiceForGroup(item.serviceGroup.id).
                                                map((a) => a.service.title).join(', ')}}
                                        </span>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-card>
                            <v-card-text>
                                <v-row class="text-body-1 d-flex align-center">
                                    <v-col cols="auto" class="font-weight-bold">
                                        {{ $t('list.netPrice') }}:
                                        <br>
                                        {{ $t('form.totalVatAmount') }}:
                                        <br>
                                        <span v-if="getTotalOtvPrice(selectedItems)">
                                            {{ $t('form.totalOtvAmount') }}:
                                            <br>
                                        </span>
                                        <span v-if="getTotalOivPrice(selectedItems)">
                                            {{ $t('form.totalOivAmount') }}:
                                            <br>
                                        </span>
                                        <span v-if="getTotalTevkifatPrice(selectedItems)">
                                            {{ $t('form.totalTevkifatAmount') }}:
                                            <br>
                                        </span>
                                        {{ $t('form.totalDiscount') }}:
                                        <br>
                                        {{ $t('form.agreementAmount') }}:
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="auto" align="end">
                                        {{ formatterPriceForCurrencyName(getTotalNetPrice(selectedItems),
                                            selectedOffer.defaultCurrency.code) }} <br>
                                        {{ formatterPriceForCurrencyName(getTotalVatPrice(selectedItems),
                                            selectedOffer.defaultCurrency.code) }} <br>
                                        <span v-if="getTotalOtvPrice(selectedItems)">
                                            {{ formatterPriceForCurrencyName(getTotalOtvPrice(selectedItems),
                                                selectedOffer.defaultCurrency.code) }} <br>
                                        </span>
                                        <span v-if="getTotalOivPrice(selectedItems)">
                                            {{ formatterPriceForCurrencyName(getTotalOivPrice(selectedItems),
                                                selectedOffer.defaultCurrency.code) }} <br>
                                        </span>
                                        <span v-if="getTotalTevkifatPrice(selectedItems)">
                                            {{ formatterPriceForCurrencyName(getTotalTevkifatPrice(selectedItems),
                                                selectedOffer.defaultCurrency.code) }} <br>
                                        </span>
                                        {{ formatterPriceForCurrencyName(getTotalDiscountPrice(selectedItems),
                                            selectedOffer.defaultCurrency.code) }} <br>
                                        {{ formatterPriceForCurrencyName(getTotalPriceForArray(selectedItems),
                                            selectedOffer.defaultCurrency.code) }}
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                        <TextField v-model="commandModel.title" label="form.title" isRequired>
                        </TextField>
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.expenseLimit" label="form.expenseLimit" isNumber>
                        </TextField>
                    </v-col>
                    <v-col cols="12" md="6">
                        <FileInput @response="selectedFile = $event[0]" label="form.document" isNumber
                            :file-category="FileCategoryEnum.Contract" isRequired>
                        </FileInput>
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput label="form.startDate" v-model="commandModel.startDate" isRequired />
                    </v-col>
                    <v-col cols="12" md="6">
                        <DateInput label="form.endDate" v-model="commandModel.endDate" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { ConvertToAgreementCommand } from '@/models/entities/crm/CrmAgreementCommands';
import { useAgreementStore } from '@/stores/crmStores/agreementStore';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import FileInput from '@/components/formInput/generalInputs/FileInput.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import type { OfferDetailDto, OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { getTotalDiscountPrice, getTotalNetPrice, getTotalOivPrice, getTotalOtvPrice, getTotalPriceForArray, getTotalTevkifatPrice, getTotalVatPrice } from '@/core/helpers/crmUtils';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import { onMounted } from 'vue';
import { nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { FileCategoryEnum } from '@/models/custom/EnumTypes';
import { GeneralFileResponse } from '@/models/ApiResult';

const commandModel = ref(new ConvertToAgreementCommand());
const selectedFile = ref(new GeneralFileResponse())
const emit = defineEmits(['createItem']);
const convertToAgreementForm = ref(null as any);
const router = useRouter();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedServices: {
        type: Array<OfferItemDto>,
        required: true
    },
    selectedOffer: {
        type: Object as PropType<OfferDetailDto>,
        required: true
    }
});

const convertToAgreement = () => {
    convertToAgreementForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            // todo: fileUrl
            commandModel.value.agreementDocumentFileId = selectedFile.value.fileId;
            commandModel.value.offerId = props.selectedOffer.id;
            commandModel.value.convertedServiceIds = props.selectedServices.map((a) => a.service.id)
            useAgreementStore().convertToAgreement(commandModel.value).then((response: any) => {
                props.dialogClose();
                router.push({ name: 'agreement-detail', params: { id: response.data } });
            }).catch((error) => {
                return catchError(error, () => convertToAgreement())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: convertToAgreement,
        loading: false
    }
])

const selectedItems = ref(new Array<OfferItemDto>());

onMounted(() => {
    nextTick(() => {
        props.selectedOffer.items.forEach((a) => {
            if (props.selectedServices.some((b) => a.service.id == b.service.id))
                selectedItems.value.push(a)
        })
    })
})

const filteredServiceGroup = () => {
    const result = new Array<OfferItemDto>();

    props.selectedServices.forEach((a) => {
        if (!result.some((b) => b.serviceGroup.id == a.serviceGroup.id)) {
            result.push(a);
        }
    })
    return result
}

const filteredServiceForGroup = (serviceGroupId: string) => {
    return props.selectedServices.filter((a) => a.serviceGroup.id == serviceGroupId)
}

</script>