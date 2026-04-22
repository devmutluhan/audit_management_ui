<template>
    <!-- 1.Kat => Service Group Katı-->
    <tr v-if="item.depth == 0" :class="item.depth % 2 == 1 ? 'bg-pairGroupRowColor' : 'bg-singleGroupRowColor'">
        <td @click="toggleGroup(item);" style="height: 55px;"
            class="pa-4 fw-semibold text-uppercase cursor-pointer text-groupRowTextColor">
            <v-icon>{{ isGroupOpen(item) ? '$expand' : '$next' }}</v-icon>
            {{ item.value }}
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!--ServiceGroup: Quantity -->
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!-- ServiceGroup: UnitPrice -->
            {{
                formatterPriceForCurrencyName(getTotalUnitPrice(filterServiceGroupItems(item.items[0].items[0].columns.serviceGroup.id)),
                    currencyCode)
            }}
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!-- ServiceGroup: NetPrice (SubTotal) -->
            {{
                formatterPriceForCurrencyName(getTotalNetPrice(filterServiceGroupItems(item.items[0].items[0].columns.serviceGroup.id)),
                    currencyCode)
            }}
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--ServiceGroup: Kdv -->
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--ServiceGroup: Total Price -->
            {{
                formatterPriceForCurrencyName(getTotalPriceForArray(filterServiceGroupItems(item.items[0].items[0].columns.serviceGroup.id)),
                    currencyCode)
            }}
        </td>
        <td v-if="headers.some((a) => a.key == 'status')" class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--ServiceGroup: Status -->
            {{ calculateConvertAgreementStatus(item.items[0].items[0].columns.serviceGroup.id).filter((a) =>
                a.convertedAgreementId).length + ' / ' +
                calculateConvertAgreementStatus(item.items[0].items[0].columns.serviceGroup.id).length }}
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--ServiceGroup: OTV -->
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!-- ServiceGroup: OİV -->
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--ServiceGroup: Tevkifat -->
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!-- ServiceGroup: DiscountRate -->
            <TextField
                v-if="editable && isConvertedAgreementItemForServiceGroup(item.items[0].items[0].columns.serviceGroup.id)"
                hide-details density="compact" isNumber v-model="item.serviceGroupDiscount" hide-border padding="pa-0"
                @update:model-value="updateDiscountForServiceGroup(item.items[0].items[0].columns.serviceGroup.id, $event)">
                <template v-slot:customSuffix>
                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                </template>
            </TextField>
            <span v-else></span>
        </td>
        <td v-if="headers.some((a) => a.key == 'actions')" colspan="1" @click="toggleGroup(item);" style="height: 55px;"
            class="pa-4 fw-semibold  cursor-pointer text-groupRowTextColor">
            <!-- ServiceGroup: Actions -->
            <GeneralDropdown :data="item.items[0].columns" v-if="groupBy.find((x) => x.key == item.key)?.groupMenuItems"
                :menuItems="groupBy.find((x) => x.key == item.key)?.groupMenuItems" />
        </td>
    </tr>
    <!-- 2.Kat => Service Katı -->
    <tr v-else-if="isGroupService(item.items[0].columns)"
        :class="item.depth % 2 == 1 ? 'bg-pairGroupRowColor' : 'bg-singleGroupRowColor'">
        <td @click="toggleGroup(item);" style="height: 55px;"
            class="fw-semibold text-uppercase cursor-pointer text-groupRowTextColor pl-12"
            :class="isSelectable ? '' : 'pa-4'">
            <v-checkbox v-if="checkboxVisible(item.items[0].columns.service.id)"
                :model-value="selectedItems.some((a) => a.service.id == item.items[0].columns.service.id)"
                @click.stop="" @update:modelValue="emit('updateSelectedItem', item.items[0].columns)" hide-details
                color="success">
                <template #label>
                    <v-icon>{{ isGroupOpen(item) ? '$expand' : '$next' }}</v-icon>
                    <span>{{ item.value }}</span>
                </template>
            </v-checkbox>
            <span v-else>
                <v-icon>{{ isGroupOpen(item) ? '$expand' : '$next' }}</v-icon>
                {{ item.value }}
            </span>
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!-- Service: Quantity -->
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!--Service: Unit Price -->
            {{
                formatterPriceForCurrencyName(getTotalUnitPrice(filterServiceItems(item.items[0].columns.service.id)),
                    currencyCode)
            }}
        </td>
        <td class="pa-4 fw-semibold text-groupRowTextColor">
            <!--Service: Net Price (Sub Total) -->
            {{
                formatterPriceForCurrencyName(getTotalNetPrice(filterServiceItems(item.items[0].columns.service.id)),
                    currencyCode)
            }}
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!-- Service: KDV -->
            <SingleSelectInput v-if="editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                hide-details density="compact" v-model="item.vatRate" placeholder="form.select" hideMenuIcon
                padding="pa-0"
                @update:model-value="filterServiceItems(item.items[0].columns.service.id).forEach((x) => !x.convertedAgreementId ? x.vatRate = $event : null)"
                :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Kdv)" item-value="rate" item-title="name"
                hide-border>
                <template v-slot:customSuffix>
                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                </template>
            </SingleSelectInput>
            <span v-else> {{ item.items[0].columns.vatRate ? '% ' +
                item.items[0].columns.vatRate : '-'
                }}</span>
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!-- Service: Total Price -->
            {{
                formatterPriceForCurrencyName(getTotalPriceForArray(filterServiceItems(item.items[0].columns.service.id)),
                    currencyCode)
            }}
        </td>
        <td v-if="headers.some((a) => a.key == 'status')" class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--Service: Status -->
            <v-chip v-if="!item.items[0].columns.convertedAgreementId" color="primary">
                {{ $t('list.waiting') }}
            </v-chip>
            <v-chip v-else color="success"
                @click="router.push({ name: 'agreement-detail', params: { id: item.items[0].columns.convertedAgreementId } })">
                {{ $t('list.convertAgreement') }}
            </v-chip>
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--Service: Ötv -->
            <SingleSelectInput v-if="editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                hide-details density="compact" v-model="item.otvRate" clearable padding="pa-0"
                @update:model-value="filterServiceItems(item.items[0].columns.service.id).forEach((x) => !x.convertedAgreementId ? x.otvRate = $event : null)"
                placeholder="form.select" hideMenuIcon :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Otv)"
                item-value="rate" item-title="name" hide-border>
                <template v-slot:customSuffix>
                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                </template>
            </SingleSelectInput>
            <span v-else> </span>
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--Service: Öiv -->
            <SingleSelectInput v-if="editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                hide-details density="compact" v-model="item.oivRate" clearable
                @update:model-value="filterServiceItems(item.items[0].columns.service.id).forEach((x) => !x.convertedAgreementId ? x.oivRate = $event : null)"
                padding="pa-0" placeholder="form.select" hideMenuIcon
                :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Oiv)" item-value="rate" item-title="name"
                hide-border>
                <template v-slot:customSuffix>
                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                </template>
            </SingleSelectInput>
            <span v-else> </span>
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--Service: Tevkifat -->
            <SingleSelectInput v-if="editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                hide-details density="compact" v-model="item.tevkifatFormula" clearable
                @update:model-value="filterServiceItems(item.items[0].columns.service.id).forEach((x) => !x.convertedAgreementId ? x.tevkifatFormula = $event : null)"
                placeholder="form.select" hideMenuIcon :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Tevkifat)"
                item-value="formula" padding="pa-0" item-title="name" hide-border></SingleSelectInput>
            <span v-else></span>
        </td>
        <td class="pa-4 fw-semibold  text-groupRowTextColor">
            <!--Service: DiscountRate -->
            <TextField v-if="editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                hide-details density="compact" isNumber v-model="item.discountRate" hide-border padding="pa-0"
                @update:model-value="updateDiscountForService(item.items[0].columns.service.id, $event)">
                <template v-slot:customSuffix>
                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                </template>
            </TextField>
            <span v-else></span>
        </td>
        <td v-if="headers.some((a) => a.key == 'actions')" colspan="1" @click="toggleGroup(item);" style="height: 55px;"
            class="pa-4 fw-semibold  cursor-pointer text-groupRowTextColor">
            <!--Service: Actions -->
            <GeneralDropdown :data="item.items[0].columns"
                v-if="groupBy.find((x) => x.key == item.key)?.groupMenuItems && editable && isConvertedAgreementItemForService(item.items[0].columns.service.id)"
                :menuItems="groupBy.find((x) => x.key == item.key)?.groupMenuItems" />
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { TaxDto } from '@/models/entities/general/GeneralDtos';
import { getTotalPriceForArray, getTotalNetPrice, getTotalUnitPrice } from '@/core/helpers/crmUtils'
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { TaxTypeEnum } from '@/models/custom/EnumTypes';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { useRouter } from 'vue-router';

const emit = defineEmits(['updateSelectedItem']);
const router = useRouter();

const props = defineProps({
    item: { type: null as any, required: true },
    tableData: { type: Array<OfferItemDto>, required: true },
    taxList: { type: Array<TaxDto>, required: true },
    groupBy: { type: Array<any>, required: true },
    toggleGroup: { type: null as any, required: true },
    isGroupOpen: { type: null as any, required: true },
    headers: { type: Array<any>, required: true },
    currencyCode: { type: String, required: true, default: 'TRY' },
    editable: { type: Boolean, required: false, default: true },
    isSelectable: { type: Boolean, required: false, default: false },
    selectedItems: { type: Array as () => Array<OfferItemDto>, required: false, default: new Array<OfferItemDto>() }
})

const checkboxVisible = (serviceId: string) => {
    return filterServiceItems(serviceId)[0].convertedAgreementId === null && props.isSelectable
}

const calculateConvertAgreementStatus = (serviceGroupId: string) => {
    let resultServices = new Array<OfferItemDto>();
    filterServiceGroupItems(serviceGroupId).forEach((a) => {
        if (!resultServices.some((b) => b.service.id == a.service.id)) {
            resultServices.push(a)
        }
    });
    return resultServices;
}

const filterServiceGroupItems = (serviceGroupId: string) => {
    return props.tableData.filter((x) => x.serviceGroup.id == serviceGroupId);
}

const filterServiceItems = (serviceId: string) => {
    return props.tableData.filter((x) => x.service.id == serviceId);
}

const updateDiscountForServiceGroup = (serviceGroupId: string, event: string) => {
    props.tableData.forEach((x) => {
        if (!x.convertedAgreementId) {
            if (x.serviceGroup.id == serviceGroupId && event) {
                x.discountRate = Number(event);
                if (x.unitPriceExclTax) {
                    x.subTotal = x.unitPriceExclTax - x.unitPriceExclTax * (x.discountRate / 100)
                }
            } else {
                x.discountRate = null;
                x.subTotal = x.unitPriceExclTax;
            }
        }
    })
}

const updateDiscountForService = (serviceId: string, event: string) => {
    props.tableData.forEach((x) => {
        if (!x.convertedAgreementId) {
            if (x.service.id == serviceId && event) {
                x.discountRate = Number(event);
                if (x.unitPriceExclTax) {
                    x.subTotal = x.unitPriceExclTax - x.unitPriceExclTax * (x.discountRate / 100)
                }
            } else {
                x.discountRate = null;
                x.subTotal = x.unitPriceExclTax;
            }
        }
    })
}

const isConvertedAgreementItemForService = (serviceId: string) => {
    return filterServiceItems(serviceId).some((a) => !a.convertedAgreementId);
}

const isConvertedAgreementItemForServiceGroup = (serviceGroupId: string) => {
    return filterServiceGroupItems(serviceGroupId).some((a) => !a.convertedAgreementId);
}

const isGroupService = (item: OfferItemDto): Boolean => {
    return props.tableData.filter((a) => a.service.id == item.service.id && a.serviceGroup.id == item.serviceGroup.id && a.position?.id).length >= 1
}

</script>