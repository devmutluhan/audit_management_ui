<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.offerContent') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="text-body-2 font-weight-bold" v-if="createOfferCommand.riskFormAnswers">
                <span>{{ $t('form.riskStatus') }} : </span>
                <v-chip :color="riskChipColor">
                    {{enumToArray(CustomerRiskLevel).find((a) => a.value ==
                        createOfferCommand.riskFormAnswers?.customerRiskStatus)?.title}}
                </v-chip>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <OfferTable :editable="false" :tableData="createOfferCommand.items" :headers="headers"
                        :currencyCode="createOfferCommand.currencyCode" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { CreateOfferRequest } from '@/models/entities/crm/CrmOfferCommands';
import { computed, ref, type PropType } from 'vue';
import OfferTable from '@/components/kt-datatable/specialTables/OfferTable.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { CustomerRiskLevel } from '@/models/custom/EnumTypes';


const props = defineProps({
    createOfferCommand: {
        type: Object as PropType<CreateOfferRequest>,
        required: true,
        default: new CreateOfferRequest()
    },
})

const riskChipColor = computed(() => {
    return props.createOfferCommand.riskFormAnswers?.customerRiskStatus == CustomerRiskLevel.Low ? 'success' :
        props.createOfferCommand.riskFormAnswers?.customerRiskStatus == CustomerRiskLevel.Mid ? 'info' :
            props.createOfferCommand.riskFormAnswers?.customerRiskStatus == CustomerRiskLevel.High ? 'error' : ''
})

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
    }
])
</script>