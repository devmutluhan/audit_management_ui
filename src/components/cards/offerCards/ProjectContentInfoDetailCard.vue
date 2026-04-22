<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('form.projectContent') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-btn variant="outlined"
                    @click="router.push({ name: 'agreement-detail', params: { id: projectDetail.convertedAgreementId } })">
                    {{ $t('list.viewAgreement') }}
                </v-btn>
            </v-col>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <OfferTable :editable="false" :tableData="projectDetail.items" :headers="headers"
                        :currencyCode="projectDetail.defaultCurrency.code" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import OfferTable from '@/components/kt-datatable/specialTables/OfferTable.vue';
import { ProjectDetailDto } from '@/models/entities/crm/CrmProjectDtos';

import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
    projectDetail: {
        type: Object as PropType<ProjectDetailDto>,
        required: true,
        default: new ProjectDetailDto()
    }
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
]);

</script>