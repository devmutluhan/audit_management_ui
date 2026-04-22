<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerContent') }}</p>
                <p v-if="validate.value && validate.description" style="color:rgb(var(--v-theme-error))"> {{
                    $t(validate.description) }} </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" v-if="isUpdated && !updateButton">
                <v-btn @click="updateButton = true; emit('updateButton', true)" variant="outlined"
                    prepend-icon="mdi-pencil" class="text-capitalize">
                    {{ $t('general.update') }}
                </v-btn>
            </v-col>
            <v-col cols="auto" v-if="isUpdated && updateButton">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" @click="validate.value = false" color="addButtonColor"
                            variant="flat" height="48">
                            {{ $t('general.addService') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddOfferItemDialog :dialogClose="() => { isActive.value = false }"
                            @createItem="addServices($event)"
                            :selectedServiceIds="offerItemList.map((a) => a.service.id)" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <OfferTable :editable="isUpdated && updateButton" :tableData="offerItemList" :headers="initHeaders"
                        :isSelectable="selectable" @updateTableData="offerItemList = $event"
                        :currencyCode="offerDetail.defaultCurrency.code"
                        :selectedItems="selectedItemsForConvertAgreement"
                        @updateSelectedItem="updateSelectedItem($event)" />
                </v-col>
            </v-row>
            <v-row v-if="updateButton" class="d-flex justify-center">
                <v-col cols="auto">
                    <v-btn size="x-large" color="warning"
                        @click="updateButton = false; emit('updateButton', false); offerItemList = JSON.parse(JSON.stringify(offerDetail.items));">
                        {{ $t('general.reset') }}
                    </v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn size="x-large" @click="updateOfferItems()">
                        {{ $t('general.update') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { OfferDetailDto, type OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { ref, type PropType } from 'vue';
import OfferTable from '@/components/kt-datatable/specialTables/OfferTable.vue';
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { computed } from 'vue';
import { watch } from 'vue';
import AddOfferItemDialog from "@/components/dialogs/crm/AddOfferItemDialog.vue"
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import type { OfferItemCommand } from '@/models/entities/crm/CrmOfferCommands';
import { storeToRefs } from 'pinia';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
const route = useRoute();

const validate = ref({
    value: false,
    description: ''
});

const { selectedItemsForConvertAgreement } = storeToRefs(useOfferStore());

const emit = defineEmits(['updateButton']);
const updateButton = ref(false);
const buttonLoading = ref(false)
const props = defineProps({
    offerDetail: {
        type: Object as PropType<OfferDetailDto>,
        required: true,
        default: new OfferDetailDto()
    },
    isUpdated: {
        type: Boolean,
        required: false,
        default: false
    }
})

const offerItemList = ref(new Array<OfferItemDto>());
const isEqual = ref(true)

const headers = ref([
    {
        title: 'list.title',
        key: "serviceName",
        sortable: true,
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        title: 'list.unitQuantity',
        key: "quantity",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.unitPrice',
        key: "unitPriceExclTax",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.netPrice',
        key: "netPrice",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.vat',
        key: "vatRate",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.totalPrice',
        key: "totalPrice",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.status',
        key: "status",
        sortable: true,
        columnWidth: 175,
    },
    {
        title: 'list.otv',
        key: "otvRate",
        sortable: true,
        columnWidth: 175
    },
    {
        title: 'list.oiv',
        key: "oivRate",
        sortable: true,
        columnWidth: 175
    },
    {
        title: 'list.tevkifat',
        key: "tevkifatFormula",
        sortable: true,
        columnWidth: 175
    },
    {
        title: 'list.discount',
        key: "discountRate",
        sortable: true,
        columnWidth: 175
    },
    {
        title: 'list.actions',
        key: 'actions',
        sortable: false,
        columnWidth: 175
    }
]);
const initHeaders = ref([] as any);

const selectable = computed(() => {
    return props.offerDetail.requestApproval.status == ApprovementStatusEnum.Approved;;
})

watch(() => props.offerDetail, (newValue) => {
    if (newValue.id) {
        offerItemList.value = JSON.parse(JSON.stringify(newValue.items));

        // Teklif durumu onaylanmış ise hizmetleri seçili getiriyoruz sözleşmeye çevirmek için
        newValue.items.forEach((a) => {
            if (!selectedItemsForConvertAgreement.value.some((b) => b.service.id == a.service.id) && !a.convertedAgreementId) {
                selectedItemsForConvertAgreement.value.push(a)
            }
        })

        if (props.offerDetail.requestApproval.status == ApprovementStatusEnum.Draft || props.offerDetail.requestApproval.status == ApprovementStatusEnum.SendBack) {
            initHeaders.value = headers.value.filter((a) => a.key !== 'status')
        } else if (props.offerDetail.requestApproval.status == ApprovementStatusEnum.Approved) {
            initHeaders.value = headers.value.filter((a) => a.key !== 'actions')
        } else if (props.offerDetail.requestApproval.status == ApprovementStatusEnum.Cancelled || props.offerDetail.requestApproval.status == ApprovementStatusEnum.Rejected || props.offerDetail.requestApproval.status == ApprovementStatusEnum.Waiting) {
            initHeaders.value = headers.value.filter((a) => a.key !== 'actions' && a.key !== 'status')
        } else {
            initHeaders.value = headers.value
        }
    }
})

watch(() => offerItemList.value, (newValue) => {
    isEqual.value = JSON.stringify(newValue) === JSON.stringify(props.offerDetail.items);
}, { deep: true })

const updateSelectedItem = (item: OfferItemDto) => {
    const index = selectedItemsForConvertAgreement.value.findIndex((a) => a.service.id == item.service.id);
    if (index != -1) {
        selectedItemsForConvertAgreement.value.splice(index, 1);
    } else {
        selectedItemsForConvertAgreement.value.push(item);
    }
}

const addServices = (data: Array<OfferItemDto>) => {
    data.forEach((a: OfferItemDto) => {
        const index = offerItemList.value.findIndex((x) => x.service.id == a.service.id && x.serviceGroup.id == a.serviceGroup.id);
        if (index == -1) {
            offerItemList.value.unshift(a);
        } else {
            offerItemList.value[index].quantity += 1;
        }
    })
}

const updateOfferItems = () => {
    buttonLoading.value = true;
    const updateOfferCommand = offerItemList.value.map((a) => {
        return {
            id: a.id,
            serviceGroupId: a.serviceGroup.id,
            serviceId: a.service.id,
            positionId: a.position?.id ?? null,
            quantity: a.quantity,
            vatRate: a.vatRate,
            oivRate: a.oivRate ?? 0,
            otvRate: a.otvRate ?? 0,
            subTotal: a.subTotal,
            tevkifatFormula: a.tevkifatFormula
        } as OfferItemCommand
    });

    if (itemValidations()) {
        useOfferStore().updateOfferItems(updateOfferCommand, route.params.id.toString()).then((res) => {
            updateButton.value = false;
            emit('updateButton', false);
            validate.value = {
                value: false,
                description: ''
            }
        }).catch((error) => {
            return catchError(error, () => { updateOfferItems() })
        }).finally(() => {
            buttonLoading.value = false
        })
    }
}

const itemValidations = (): Boolean => {
    let result = false
    const isKdvValid = offerItemList.value.some((a) => !a.vatRate);
    const isUnitPriceValid = offerItemList.value.some((a) => !a.unitPriceExclTax);
    const isQuantityValid = offerItemList.value.some((a) => !a.quantity);

    if (isUnitPriceValid) {
        validate.value = {
            value: true,
            description: 'form.requiredItemUnitPrice'
        }
    } else if (isQuantityValid) {
        validate.value = {
            value: true,
            description: 'form.requiredItemQuantity'
        }
    } else if (isKdvValid) {
        validate.value = {
            value: true,
            description: 'form.requiredItemVat'
        }
    } else {
        result = true
    }

    return result
}
</script>