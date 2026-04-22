<template>
    <tr class="bg-lastRowColor" v-if="tableData.length > 0" style="height: 60px;">
        <td class="pa-4 fw-semibold">
            {{ $t('list.total') }} :
        </td>
        <td class="pa-4 fw-semibold">
            <!-- Quantity -->
            <!-- {{ getTotalQuantity(tableData) + ' ' + $t('enums.Hour') }} -->
        </td>
        <td class="pa-4 fw-semibold">
            <!-- UnitPrice -->
            <!-- <Tooltip descriptionText="list.totalUnitPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalUnitPrice(tableData), currencyCode) }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- Net Price (SubTotal) -->
            <!-- <Tooltip descriptionText="list.totalNetPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalNetPrice(tableData), currencyCode) }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- KDV -->
            <!-- <Tooltip descriptionText="list.totalVatPrice" color="#BBDEFB"></Tooltip> -->
            <p class="ma-0" v-if="tableData.some((a) => a.tevkifatFormula)">
                {{ 'Tevkifat ' + $t('list.excludeHaric') }}: {{
                    formatterPriceForCurrencyName(getTotalVatPrice(tableData),
                        currencyCode) }} <br />
                {{ 'Tevkifat ' + $t('list.include') }}:
                {{ formatterPriceForCurrencyName(getTotalVatPrice(tableData) - getTotalTevkifatPrice(tableData),
                    currencyCode) }}
            </p>
            <p class="ma-0" v-else>
                {{ formatterPriceForCurrencyName(getTotalVatPrice(tableData), currencyCode) }}
            </p>
        </td>
        <td class="pa-4 fw-semibold">
            <!-- Total Price -->
            <!-- <Tooltip descriptionText="list.totalUnitPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalPriceForArray(tableData), currencyCode) }}
        </td>
        <td v-if="headers.some((a) => a.key == 'status')" class="pa-4 pl-6 fw-semibold">
            <!-- Status -->
            {{ calculateConvertAgreementStatus().filter((a) => a.convertedAgreementId).length + ' / ' +
                calculateConvertAgreementStatus().length }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- ÖTV -->
            <!-- <Tooltip descriptionText="list.totalOtvPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalOtvPrice(tableData), currencyCode) }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- ÖİV -->
            <!-- <Tooltip descriptionText="list.totalOivPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalOivPrice(tableData), currencyCode) }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- Tevkifat -->
            <!-- <Tooltip descriptionText="list.totalTevkifatPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalTevkifatPrice(tableData), currencyCode) }}
        </td>
        <td class="pa-4 fw-semibold">
            <!-- DiscountRate -->
            <!-- <Tooltip descriptionText="list.totalDiscountPrice" color="#BBDEFB"></Tooltip> -->
            {{ formatterPriceForCurrencyName(getTotalDiscountPrice(tableData), currencyCode) }}
        </td>
        <td v-if="headers.some((a) => a.key == 'actions')">
            <!-- Actions -->
        </td>
    </tr>
    <tr v-else>
        <td :colspan="headers.length + 4" class="dataTables_empty">
            <v-row class="d-flex justify-left">
                <v-col cols="12" align="center">
                    <v-alert type="info" color="alertIconColor" variant="outlined">
                        {{ $t('general.noData') }}
                    </v-alert>
                </v-col>
            </v-row>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { getTotalPriceForArray, getTotalNetPrice, getTotalQuantity, getTotalUnitPrice, getTotalOtvPrice, getTotalOivPrice, getTotalTevkifatPrice, getTotalDiscountPrice, getTotalVatPrice } from '@/core/helpers/crmUtils'
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import Tooltip from '@/components/formInput/Tooltip.vue';

const props = defineProps({
    tableData: { type: Array<OfferItemDto>, required: true },
    headers: { type: Array<any>, required: true },
    currencyCode: { type: String, required: true, default: 'TRY' }
})


const calculateConvertAgreementStatus = () => {
    let resultServices = new Array<OfferItemDto>();
    props.tableData.forEach((a) => {
        if (!resultServices.some((b) => b.service.id == a.service.id)) {
            resultServices.push(a)
        }
    });
    return resultServices;
}

</script>