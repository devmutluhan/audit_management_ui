<template>
    <v-card class="fill-height" :style="validate.value ? { border: '1px solid red' } : ''">
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerContent') }}</p>
                <p v-if="validate.value && validate.description" style="color:rgb(var(--v-theme-error))"> {{
                    $t(validate.description) }} </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <VDialogContent width="900">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" @click="validate.value = false" color="addButtonColor"
                            variant="flat" height="48">
                            {{ $t('general.addService') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddOfferItemDialog :dialogClose="() => { isActive.value = false }"
                            @createItem="addServices($event)"
                            :selectedServiceIds="createOfferCommand.items.map((a) => a.service.id)" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-form ref="offerContentRef">
                <v-row>
                    <v-col cols="12">
                        <v-text-field class="d-none" id="textInputNone" v-model="createOfferCommand.items"
                            :rules="arrayRules">
                        </v-text-field>
                        <OfferTable :tableData="createOfferCommand.items" :headers="headers"
                            @updateTableData="createOfferCommand.items = $event"
                            :currencyCode="createOfferCommand.currencyCode">
                        </OfferTable>
                    </v-col>
                </v-row>
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
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import OfferTable from '@/components/kt-datatable/specialTables/OfferTable.vue';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import AddOfferItemDialog from "@/components/dialogs/crm/AddOfferItemDialog.vue"
import { storeToRefs } from 'pinia';
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { ref, watch } from 'vue';
import { useFormValidationStore } from '@/stores/formValidation';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import GeneralButton from '@/components/formInput/generalInputs/GeneralButton.vue';
const { arrayRules } = storeToRefs(useFormValidationStore());

const { createOfferCommand } = storeToRefs(useOfferStore());
const validate = ref({
    value: false,
    description: ''
});
const isClickNextButton = ref(false)
const emit = defineEmits(['clickNext', 'clickBack']);

const addServices = (data: Array<OfferItemDto>) => {
    data.forEach((a: OfferItemDto) => {
        const index = createOfferCommand.value.items.findIndex((x) => x.service.id == a.service.id && x.serviceGroup.id == a.serviceGroup.id);
        if (index == -1) {
            createOfferCommand.value.items.unshift(a);
        } else {
            createOfferCommand.value.items[index].quantity += 1;
        }
    })
}

const offerContentRef = ref(null as any);

const clickNext = () => {
    isClickNextButton.value = true;
    offerContentRef.value.validate().then((res: any) => {
        if (res.valid && itemValidations()) {
            emit('clickNext')
        }
    })
}

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
        key: "actions",
        sortable: false,
        columnWidth: 175,
    },
])

watch(() => offerContentRef.value?.errors, () => {
    if (isClickNextButton.value) {
        if (offerContentRef.value.errors.some((x: any) => x.id == 'textInputNone') && createOfferCommand.value.items.length == 0) {
            validate.value = {
                value: true,
                description: 'form.requiredServiceItem'
            }
        } else {
            validate.value = {
                value: false,
                description: ''
            }
        }
    }
}, { deep: true });

const itemValidations = (): Boolean => {
    let result = false
    const isKdvValid = createOfferCommand.value.items.some((a) => !a.vatRate);
    const isUnitPriceValid = createOfferCommand.value.items.some((a) => !a.unitPriceExclTax);
    const isQuantityValid = createOfferCommand.value.items.some((a) => !a.quantity);

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