<template>
    <DialogContent title="general.addPosition" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addPositionForOfferItemForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <MultipleAutocompleteInput v-model="selectedPositions" label="form.positions"
                            :items="positionPrices" item-title="positionName" isReturnObject @updateMenu="">
                            <template v-slot:menuItem="{ item }">
                                <v-list-item link class="py-0 px-2" v-if="item.isValid" @click="selectPosition(item)">
                                    <v-col cols="12" style="border-bottom:1px solid #EEEEEE;">
                                        <v-row>
                                            <v-col cols="auto" class="pa-0">
                                                <v-checkbox hide-details
                                                    :model-value="selectedPositions.some((a) => a.positionId == item.positionId)"></v-checkbox>
                                            </v-col>
                                            <v-col class="pb-0">
                                                <p class="text-body-1 ma-0">{{ item.positionName }}</p>
                                                <v-list-item-subtitle>
                                                    {{
                                                        formatterPriceForCurrencyName(item.sellPrice, item.currency.code)
                                                    }}
                                                </v-list-item-subtitle>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-list-item>
                                <v-list-item v-else class="py-0 px-2">
                                    <v-col cols="12" style="border-bottom:1px solid #EEEEEE;">
                                        <v-row>
                                            <v-col>
                                                <p class="text-body-1 ma-0">{{ item.positionName }}</p>
                                                <v-list-item-subtitle>
                                                    <v-icon color="primary">mdi-information</v-icon>
                                                    {{ $t('form.addPositionPriceInfo') }}
                                                </v-list-item-subtitle>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="auto" v-if="hasClaimOrModules(['ManageCrmSettings'])">
                                                <v-btn variant="text" color="primary" icon="mdi-cash-plus"
                                                    @click="selectedItemForList = item; positionPriceDialog = true"></v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-list-item>
                            </template>
                        </MultipleAutocompleteInput>
                    </v-col>
                </v-row>
            </v-form>
            <VDialogContent v-model="positionPriceDialog">
                <AddPositionPriceForOfferDialog :dialog-close="() => { positionPriceDialog = false }"
                    :selectedItem="selectedItemForList" @createItem="addPositionPrice" />
            </VDialogContent>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { storeToRefs } from 'pinia';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { onMounted } from 'vue';
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import { createOfferItemDto } from '@/core/helpers/crmUtils';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { PositionPricesDto } from '@/models/entities/crm/CrmServiceDtos';
import { formatterPriceForCurrencyName } from '@/core/helpers/generalUtils';
import AddPositionPriceForOfferDialog from './AddPositionPriceForOfferDialog.vue';
import VDialogContent from '../VDialogContent.vue';

const { positionPrices } = storeToRefs(useCrmServiceStore())
const { createOfferCommand } = storeToRefs(useOfferStore());

const emit = defineEmits(['createItem']);
const addPositionForOfferItemForm = ref(null as any);
const selectedPositions = ref(new Array<PositionPricesDto>());
const positionPriceDialog = ref(false);
const selectedItemForList = ref(new PositionPricesDto())

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    },
    selectedItemChilds: {
        type: null as any,
        required: false
    }
});

useCrmServiceStore().getPositionPrices(props.selectedItem.service.id, createOfferCommand.value.currencyCode)

const addPositionForOfferItem = () => {
    if (selectedPositions.value.length > 0) {
        emit('createItem', selectedPositions.value.map((x) => {
            return createOfferItemDto({
                serviceGroup: { id: props.selectedItem.serviceGroup.id, title: props.selectedItem.serviceGroup.title },
                service: { id: props.selectedItem.service.id, title: props.selectedItem.service.title },
                position: { id: x.positionId, name: x.positionName },
                unitPriceExclTax: x.sellPrice
            })
        }))
    } else {
        emit('createItem', [createOfferItemDto({
            serviceGroup: { id: props.selectedItem.serviceGroup.id, title: props.selectedItem.serviceGroup.title },
            service: { id: props.selectedItem.service.id, title: props.selectedItem.service.title },
        })])
    }
    props.dialogClose();
}

onMounted(() => {
    if (props.selectedItemChilds) {
        // Default seçili getirmek için kodu açmak yeterli
        // props.selectedItemChilds.forEach((a) => {
        //     selectedPositions.value.push({ id: a.positionId, name: a.positionName })
        // })
    }
})

const selectPosition = (item: PositionPricesDto) => {
    const index = selectedPositions.value.findIndex((a) => a.positionId == item.positionId);
    if (index != -1) {
        selectedPositions.value.splice(index, 1)
    } else {
        selectedPositions.value.push(item)
    }
}

const addPositionPrice = (event: PositionPricesDto) => {
    const index = positionPrices.value.findIndex((a) => a.positionId == event.positionId);
    if (index != -1) {
        positionPrices.value[index] = event;
        selectedPositions.value.push(event);
    }
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: addPositionForOfferItem,
        loading: false
    }
])
</script>