<template>
    <v-data-table :group-by="groupBy" :items="tableData" :hover="true" fixed-header hide-default-footer hide-no-data
        show-group-by items-per-page="-1">
        <template v-if="groupBy" v-slot:group-header="{ item, toggleGroup, isGroupOpen }">
            <template :ref="(el) => {
                if (firstRender && !isGroupOpen(item)) {
                    toggleGroup(item);
                }
            }"></template>
            <BodyGroupRow :item="item" :toggleGroup="toggleGroup" :isGroupOpen="isGroupOpen"
                :currencyCode="currencyCode" :table-data="tableData" :tax-list="taxList" :group-by="groupBy"
                :headers="headers" :editable="editable" :selectedItems="selectedItems" :isSelectable="isSelectable"
                @update-selected-item="emit('updateSelectedItem', $event)" />
        </template>
        <template v-slot:item="{ item, index }">
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <tr v-bind="true ? props : null" style="height: 52px;" v-if="isVisibleChildItem(item)"
                        :class="isHovering ? 'bg-hoverRowColor' : index % 2 == 1 ? 'bg-pairRowBgColor' : 'bg-singleRowBgColor'">
                        <td style="min-width: 140px; max-width: 160px;" :class="item.position?.id ? 'pl-8' : 'pl-12'">
                            <v-checkbox :model-value="selectedItems.some((a) => a.service.id == item.service.id)"
                                v-if="isSelectable && !item.convertedAgreementId && !item.position?.id"
                                @update:modelValue="emit('updateSelectedItem', item)" hide-details color="success">
                                <template #label>
                                    <span>{{ item.service.title }}</span>
                                </template>
                            </v-checkbox>
                            <span v-else>
                                {{ item.position?.id ? item.position?.name : item.service.title }}
                            </span>
                        </td>
                        <td v-if="editable && !item.convertedAgreementId" style="min-width: 140px; max-width: 160px;">
                            <!-- Quantity -->
                            <v-row v-if="item.position?.id">
                                <v-col>
                                    <TextField density="compact" v-model.number="item.quantity" hide-details hide-border
                                        padding="pa-0" isNumber>
                                        <template v-slot:customSuffix>
                                            <p class="text-body-2 ma-0">{{ $t('enums.Hour') }}</p>
                                        </template>
                                    </TextField>
                                </v-col>
                                <Tooltip v-if="!item.quantity" color="error" description-text="form.isRequired" />
                            </v-row>
                            <p class="ma-0" v-else-if="!item.position?.id"> {{ item.quantity + ' ' + $t('enums.Piece')
                                }}
                            </p>
                        </td>
                        <td v-else style="min-width: 140px; max-width: 160px;">
                            <!-- Quantity -->
                            <p class="ma-0" v-if="!item.position?.id">
                                {{ item.quantity + ' ' + $t('enums.Piece') }}
                            </p>
                            <p class="ma-0" v-else> {{ item.quantity + ' ' + $t('enums.Hour') }} </p>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Unit Price -->
                            <v-row v-if="editable && !item.convertedAgreementId">
                                <v-col>
                                    <span v-if="!item.position?.id">{{ formatterPriceForCurrencyName(item.subTotal ?? 0,
                                        currencyCode) }}</span>
                                    <span v-else>{{ formatterPriceForCurrencyName(item.unitPriceExclTax ?? 0,
                                        currencyCode) }}</span>
                                </v-col>
                                <Tooltip v-if="!item.unitPriceExclTax && item.position?.id" color="error"
                                    description-text="form.isRequired" />
                            </v-row>
                            <p class="ma-0" v-else>
                                <span v-if="!item.position?.id">{{ formatterPriceForCurrencyName(item.subTotal ?? 0,
                                    currencyCode) }}</span>
                                <span v-else>{{ formatterPriceForCurrencyName(item.unitPriceExclTax ?? 0,
                                    currencyCode) }}</span>
                            </p>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- SubTotal (netPrice) -->
                            <v-row v-if="editable && !item.convertedAgreementId">
                                <v-col v-if="item.position?.id">
                                    <TextField density="compact" v-model.number="item.subTotal" hide-details hide-border
                                        padding="pa-0" isNumber @update:model-value="calculateDiscountRate(item)">
                                        <template v-slot:customSuffix>
                                            <p class="text-body-2 ma-0">{{ currencyCode }}</p>
                                        </template>
                                    </TextField>
                                </v-col>
                                <v-col v-else>
                                    <TextField density="compact" v-model.number="item.subTotal" hide-details hide-border
                                        padding="pa-0" isNumber
                                        @update:model-value="item.unitPriceExclTax = item.subTotal;">
                                        <template v-slot:customSuffix>
                                            <p class="text-body-2 ma-0">{{ currencyCode }}</p>
                                        </template>
                                    </TextField>
                                </v-col>
                                <Tooltip v-if="!item.subTotal" color="error" description-text="form.isRequired" />
                            </v-row>
                            <p class="ma-0" v-else>
                                {{ formatterPriceForCurrencyName(item.subTotal ?? 0,
                                    currencyCode) }}
                            </p>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- KDV -->
                            <v-row>
                                <v-col>
                                    <SingleSelectInput v-if="editable && !item.convertedAgreementId" hide-details
                                        density="compact" v-model="item.vatRate" placeholder="form.select" hideMenuIcon
                                        padding="pa-0" :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Kdv)"
                                        item-value="rate" item-title="name" hide-border>
                                        <template v-slot:customSuffix>
                                            <p class="text-body-2 ma-0">{{ '%' }}</p>
                                        </template>
                                    </SingleSelectInput>
                                    <span v-else>{{ item.vatRate ? '% ' + item.vatRate : '-' }}</span>
                                </v-col>
                                <Tooltip v-if="!item.vatRate" color="error" description-text="form.isRequired" />
                            </v-row>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Total Price -->
                            {{
                                formatterPriceForCurrencyName(getTotalPriceForArray([item]),
                                    currencyCode)
                            }}
                        </td>
                        <td v-if="headers.some((a) => a.key == 'status')" style="min-width: 140px; max-width: 160px;">
                            <!-- Status (Detail de gözüküyor)-->
                            <v-chip v-if="!item.convertedAgreementId && !item.position?.id" color="primary">
                                {{ $t('list.waiting') }}
                            </v-chip>
                            <v-chip v-else-if="!item.position?.id" color="success"
                                @click="router.push({ name: 'agreement-detail', params: { id: item.convertedAgreementId } })">
                                {{ $t('list.convertAgreement') }}
                            </v-chip>
                            <p v-else></p>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Ötv -->
                            <SingleSelectInput v-if="editable && !item.convertedAgreementId" hide-details
                                density="compact" v-model="item.otvRate" clearable padding="pa-0"
                                placeholder="form.select" hideMenuIcon @click-clear="item.otvRate = null"
                                :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Otv)" item-value="rate"
                                item-title="name" hide-border>
                                <template v-slot:customSuffix>
                                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                                </template>
                            </SingleSelectInput>
                            <span v-else>{{ item.otvRate ? '% ' + item.otvRate : '-' }}</span>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Öiv -->
                            <SingleSelectInput v-if="editable && !item.convertedAgreementId" hide-details
                                density="compact" v-model="item.oivRate" @click-clear="item.oivRate = null"
                                placeholder="form.select" padding="pa-0"
                                :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Oiv)" item-value="rate" clearable
                                hideMenuIcon item-title="name" hide-border>
                                <template v-slot:customSuffix>
                                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                                </template>
                            </SingleSelectInput>
                            <span v-else>{{ item.oivRate ? '% ' + item.oivRate : '-' }}</span>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Tevkifat -->
                            <SingleSelectInput v-if="editable && !item.convertedAgreementId" hide-details
                                density="compact" v-model="item.tevkifatFormula" clearable hideMenuIcon
                                placeholder="form.select" padding="pa-0" @click-clear="item.tevkifatFormula = null"
                                :items="taxList.filter((x) => x.taxType == TaxTypeEnum.Tevkifat)" item-value="formula"
                                item-title="name" hide-border></SingleSelectInput>
                            <span v-else>{{ item.tevkifatFormula ? item.tevkifatFormula : '-' }}</span>
                        </td>
                        <td style="min-width: 140px; max-width: 160px;">
                            <!-- Discount -->
                            <TextField v-if="editable && !item.convertedAgreementId" hide-details density="compact"
                                isNumber v-model.number="item.discountRate" hide-border padding="pa-0"
                                @update:model-value="calculateSubTotal(item)">
                                <template v-slot:customSuffix>
                                    <p class="text-body-2 ma-0">{{ '%' }}</p>
                                </template>
                            </TextField>
                            <span v-else>{{ item.discountRate ? '% ' + item.discountRate : '-' }}</span>
                        </td>
                        <td v-if="headers.some((a) => a.key == 'actions')">
                            <GeneralDropdown v-if="editable && !item.convertedAgreementId" :data="item"
                                :menuItems="filterMenuItems(item)">
                            </GeneralDropdown>
                        </td>
                    </tr>
                </template>
            </v-hover>
        </template>
        <template v-slot:body.append>
            <BodyAppend :tableData="tableData" :headers="headers" :currencyCode="currencyCode" :editable="editable" />
        </template>
        <template v-slot:headers>
            <th v-for="(column, i) in headers" :key="i" style="height: 50px;"
                class="bg-headerBgColor text-start pl-4 fw-bold text-uppercase text-truncate text-headerTextColor">
                {{ $t(column.title).toLocaleUpperCase() }}
                <Tooltip v-if="column.key == 'netPrice'" description-text="form.excludeTaxAndDiscount" />
                <Tooltip v-if="column.key == 'totalPrice'" description-text="form.includeTaxAndDiscount" />
            </th>
        </template>
    </v-data-table>
    <v-dialog v-model="addPositionForServiceDialog" width="800">
        <AddPositionForOfferItem :dialog-close="() => { addPositionForServiceDialog = false }"
            :selected-item="selectedItem" :selectedItemChilds="selectedItemChilds"
            @create-item="addPositionForService($event)" />
    </v-dialog>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import BodyAppend from '@/components/kt-datatable/specialTables/offerTablePartials/BodyAppend.vue'
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import type { GeneralDropdownType } from '@/models/types';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import AddPositionForOfferItem from '@/components/dialogs/crm/AddPositionForOfferItem.vue'
import { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { getTotalPriceForArray, netPriceForDiscount } from '@/core/helpers/crmUtils'
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { storeToRefs } from 'pinia';
import { TaxTypeEnum } from '@/models/custom/EnumTypes';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import BodyGroupRow from './offerTablePartials/BodyGroupRow.vue';
import Tooltip from '@/components/formInput/Tooltip.vue';
import { useRouter } from 'vue-router';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const router = useRouter()
const emit = defineEmits(['updateTableData', 'updateSelectedItem']);
const { taxList } = storeToRefs(useTaxStore())

const props = defineProps({
    editable: { type: Boolean, required: false, default: true },
    tableData: { type: Array as () => Array<OfferItemDto>, required: true, default: new Array<OfferItemDto>() },
    headers: { type: Array<any>, required: true },
    isSelectable: { type: Boolean, required: false, default: false },
    selectedItems: { type: Array as () => Array<OfferItemDto>, required: false, default: new Array<OfferItemDto>() },
    currencyCode: { type: String, default: 'TRY' }
});

if (props.editable)
    useTaxStore().getTaxList({ pageSize: 1000, pageNumber: 1 });

const firstRender = ref(true)
const selectedItem = ref(new OfferItemDto())
const selectedItemChilds = ref(new Array<OfferItemDto>())
const addPositionForServiceDialog = ref(false)

const slots = defineSlots<{
    listItem(props: { item: any, props: any, index: number }): any
}>()

onMounted(() => {
    openGroupDepth();
})

watch(() => props.tableData, () => {
    openGroupDepth();
}, { deep: true })

watch(() => props.editable, () => {
    useTaxStore().getTaxList({ pageSize: 1000, pageNumber: 1 });
})

const addPositionForService = (positions: Array<OfferItemDto>) => {
    let index = props.tableData.findIndex((a) => a.service.id == selectedItem.value.service.id && !a.position?.id);
    // Default ola
    // n hizmet bulunur ve o hizmetin modeli silinir -> sıfırlanır -> tekrar eklenir
    if (index != -1) {
        props.tableData.splice(index, 1);
        // props.tableData.push(createOfferItemDto({
        //     service: { id: selectedItem.value.service.id, title: selectedItem.value.service.title },
        //     serviceGroup: { id: selectedItem.value.serviceGroup.id, title: selectedItem.value.serviceGroup.title },
        //     quantity: 0
        // }));
    }

    // Pozisyonlar listeye eklenir
    positions.forEach((a) => {
        a.subTotal = +netPriceForDiscount(a);
        let index = props.tableData.findIndex((x) => x.position?.id == a.position?.id && x.service.id == a.service.id)
        if (index == -1) {
            props.tableData.push(a);
        } else {
            props.tableData[index].quantity += 1
        }
    });
}

const groupBy = ref([
    {
        key: 'serviceGroup.title',
    },
    {
        key: 'service.title',
        groupMenuItems: [{
            title: "general.addPosition",
            action: (item: OfferItemDto) => {
                // Seçili hizmete pozisyon eklemek için dialogu açar ve önceden seçilmiş pozisyonları dialogda gösterir
                selectedItemChilds.value = props.tableData.filter((a: OfferItemDto) => a.service.id == item.service.id && a.position?.id);
                selectedItem.value = item
                addPositionForServiceDialog.value = true
            }
        },
        {
            title: "general.delete",
            confirmModalValue: {
                text: "general.deleteOfferServiceDesc",
                buttonLoading: false,
                action: (item: OfferItemDto) => {
                    emit('updateTableData', props.tableData.filter((a: OfferItemDto) => a.service.id != item.service.id))
                },
            },
        }]
    }
]);

const filterMenuItems = (item: OfferItemDto) => {
    if (item.position?.id) {
        return menuItems.value.filter((a) => a.id != 1)
    } else {
        return menuItems.value
    }
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.addPosition",
        action: (item: OfferItemDto) => {
            // Seçili hizmete pozisyon eklemek için dialogu açar ve önceden seçilmiş pozisyon olmadığı için boş yollar
            selectedItemChilds.value = new Array<OfferItemDto>();
            selectedItem.value = item
            addPositionForServiceDialog.value = true
        }
    },
    {
        id: 2,
        title: "general.delete",
        action: (item: OfferItemDto) => {
            selectedItemChilds.value = new Array<OfferItemDto>();
            selectedItem.value = item;

            if (!item.position?.id) {
                emit('updateTableData', props.tableData.filter((x) => x.service.id != item.service.id || x.serviceGroup.id != item.serviceGroup.id))

                if (props.tableData.filter((a) => a.serviceGroup.id == item.serviceGroup.id).length == 1) {
                    emit('updateTableData', props.tableData.filter((x) => x.serviceGroup.id != item.serviceGroup.id))
                }
            } else {
                if (props.tableData.filter((x) => x.service.id == item.service.id).length == 1) {
                    item.position = null
                } else {
                    const deleteIndex = props.tableData.findIndex((x) => x.serviceGroup.id == item.serviceGroup.id && x.service.id == item.service.id && x.position?.id == item.position?.id)
                    props.tableData.splice(deleteIndex, 1);
                    if (props.tableData.filter((a) => a.service.id == item.service.id).length == 1) {
                        const defaultServiceIndex = props.tableData.findIndex((a) => a.service.id == item.service.id);
                        props.tableData[defaultServiceIndex].quantity = 1
                    }
                }
            }
        }
    },
]);

const openGroupDepth = () => {
    firstRender.value = true;
    setTimeout(() => {
        firstRender.value = false;
    }, 300)
}

const isVisibleChildItem = (item: OfferItemDto): Boolean => {
    let result = false;
    if (props.tableData.filter((a: OfferItemDto) => a.service.id == item.service.id).length > 1) {
        if (item.position?.id)
            result = true
        else
            result = false
    } else {
        if (item.service.id)
            result = true
        else
            result = false
    }
    return result
}

const calculateDiscountRate = (item: OfferItemDto) => {
    if (item.unitPriceExclTax && item.subTotal) {
        item.discountRate = Number((100 - (item.subTotal / item.unitPriceExclTax) * 100).toFixed(4))
        if (item.subTotal == item.unitPriceExclTax) {
            item.discountRate = null
        }
    }
    if (!item.subTotal) {
        item.subTotal = item.unitPriceExclTax
    }
}

const calculateSubTotal = (item: OfferItemDto) => {
    if (item.unitPriceExclTax && item.discountRate) {
        item.subTotal = Number((item.unitPriceExclTax - item.unitPriceExclTax * (item.discountRate / 100)).toFixed(4))
    }
    if (!item.discountRate) {
        item.subTotal = item.unitPriceExclTax
    }
}
</script>