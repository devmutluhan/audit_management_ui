<template>
    <v-row>
        <v-col>
            <InputLabel v-if="isLabelVisible" :description-text="descriptionText"
                :description-text-visible="descriptionTextVisible" :is-required="isRequired" :label="label" />
            <v-autocomplete ref="autocompleteRef" v-model="selectedCustomers" :no-filter="noFilter" item-title="name"
                item-value="id" :hide-details="hideDetails" :items="customerListItems" :density="density"
                :isRequired="isRequired" @update:search="search($event);" @click:clear="emit('clickClear')"
                :loading="loading" :multiple="multiple" :rules="defaultRules" :placeholder="$t('general.search')"
                clearable autocomplete="off">
                <template v-slot:loader>
                    <v-progress-linear v-if="loading" class="position-fixed" indeterminate
                        color="primary"></v-progress-linear>
                </template>
                <template v-slot:item="{ item }">
                    <v-list-item link @click="selectedItem(item.raw); emit('updateModelValue')"
                        :disabled="disabledItem(item.raw)">
                        <v-row class="d-flex align-center">
                            <v-col cols="auto" :class="multiple ? 'pa-1' : ''" v-if="props.multiple">
                                <v-checkbox readonly color="selectedTab"
                                    :model-value="selectedCustomers.some((it: any) => it.id == item.raw.id)"
                                    hide-details></v-checkbox>
                            </v-col>
                            <v-col cols="auto" :class="multiple ? 'pa-2' : ''">
                                <ImageCard size="35" color="warning" :fullName="item.raw.name" rounded="circle"
                                    :avatar-text="item.raw.logoUrl">
                                </ImageCard>
                            </v-col>
                            <v-col cols="auto" :class="multiple ? 'pa-2' : ''">
                                <v-row>
                                    <v-col class="pb-0">
                                        <v-list-item-title>
                                            {{ item.raw.name }}
                                        </v-list-item-title>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="pt-0">
                                        <v-list-item-subtitle>{{ item.raw.parent }}</v-list-item-subtitle>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </template>
                <template v-slot:chip="{ item, index }">
                    <v-chip class="px-0" size="25" variant="text" v-if="index == 0 && !justAvatarChip">
                        <template v-slot:prepend>
                            <ImageCard size="25" color="warning" :fullName="item.raw.name" rounded="circle"
                                :avatar-text="item.raw.logoUrl">
                            </ImageCard>
                        </template>
                        <template v-slot:default>
                            <v-col class="font-weight-bold pl-2">
                                {{ item.raw.name }}
                            </v-col>
                        </template>
                    </v-chip>
                    <v-chip size="25" v-else-if="index == 1 && !justAvatarChip">
                        + {{ selectedCustomers.length - 1 }}
                    </v-chip>
                    <span v-else-if="index < 3 && justAvatarChip" :class="index != 0 ? 'ml-n4' : ''">
                        <ImageCard size="25" color="warning" :fullName="item.raw.name" rounded="circle"
                            :avatar-text="item.raw.logoUrl">
                        </ImageCard>
                    </span>
                    <span v-else-if="index == 3 && justAvatarChip" class="ml-n4">
                        <v-avatar size="25" color="toolbarButton">
                            + {{ selectedCustomers.length - 3 }}
                        </v-avatar>
                    </span>
                </template>
                <template v-slot:append-item>
                    <v-row v-if="loading">
                        <v-col cols="12" align="center">
                            <v-progress-circular color="primary" height="4" indeterminate></v-progress-circular>
                        </v-col>
                    </v-row>
                    <div v-intersect="endIntersect" />
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { computed, onMounted, type PropType, ref, watch } from 'vue';
import InputLabel from '../generalInputs/InputLabel.vue';
import type { Density } from '@/models/types';
import { customerListItems, customerListTotalCount, getCustomerListForSelectInput, customerListFirstFetch, noFilter, pageNumber, pageSize, searchValue } from './CustomerSelectUtils';
import type { CustomerDto } from '@/models/entities/customer/CustomerDtos';
import { useFormValidationStore } from '@/stores/formValidation';
import { getFileUrl } from '@/core/helpers/assets';
import { storeToRefs } from 'pinia';
import ImageCard from '@/components/cards/ImageCard.vue';
const { stringRules, objectRules } = storeToRefs(useFormValidationStore());

const selectedCustomers = ref(new Array<CustomerDto>());
const autocompleteRef = ref(null as any);

const defaultRules = computed(() => {
    if (props.isRequired) {
        if (props.justId) {
            return stringRules.value;
        } else {
            return objectRules.value;
        }
    } else {
        return [];
    }
});

const emit = defineEmits(['selectValue', 'updateModelValue', 'clickClear']);
const loading = ref(false);

const props = defineProps({
    justId: {
        type: Boolean,
        default: false,
    },
    justAvatarChip: {
        type: Boolean,
        default: false,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    items: {
        type: null as any,
        required: false
    },
    selectItems: {
        type: Array<any>,
        required: false
    },
    descriptionText: {
        type: String,
        required: false
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    label: {
        type: String,
        default: "form.selectCustomer"
    },
    isTableFilter: { // table da henüz veri varken aynı endpointe istek atıp veriler bozulmasın diye eklendi.
        type: Boolean,
        default: false
    },
    hideDetails: {
        type: Boolean,
        default: true
    },
    isLabelVisible: {
        type: Boolean,
        default: true
    },
    disabledItem: {
        type: Function as any,
        default: () => { return false },
        required: false
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const updateModelValue = () => {
    if (props.justId) {
        if (!props.multiple)
            emit('selectValue', selectedCustomers.value[0].id);
        else
            emit('selectValue', selectedCustomers.value.map((a: any) => a.id));
    } else {
        if (!props.multiple)
            emit('selectValue', selectedCustomers.value[0]);
        else
            emit('selectValue', selectedCustomers.value);
    }
}

onMounted(() => {
    // Table filter için koyuldu bu if
    if (!props.isTableFilter || customerListFirstFetch.value) {
        getCustomerList();
    }
    setPropsSelectItem();
})
watch(() => props.selectItems, () => {
    // Table filter için koyuldu bu if 
    if (!props.isTableFilter) {
        setPropsSelectItem();
    } else {
        if (props.selectItems?.length == 0) {
            selectedCustomers.value = new Array<CustomerDto>();
        }
    }
})

const setPropsSelectItem = () => {
    if (props.justId) {
        if (props.selectItems && props.selectItems.length > 0) {
            if (props.selectItems[0] != null && props.selectItems[0] != undefined && props.selectItems[0] != "") {
                if (!props.isTableFilter) {
                    if (!props.multiple) {
                        selectedCustomers.value.push(props.selectItems[0])
                    } else {
                        selectedCustomers.value = props.selectItems
                    }
                    updateModelValue()
                } else { // Table filter için kullanılıyorsa aşağı giriyor(props.selectItems sadece id[] geliyorsa aşağıdaki kod çalışıyor)
                    props.selectItems.forEach((x: string) => {
                        let customer = customerListItems.value.find((a: CustomerDto) => a.id == x)
                        if (customer && x)
                            selectedCustomers.value.push(customer)
                    });
                }
            }
        }
    } else {
        if (props.selectItems && props.selectItems.length > 0) {
            if (props.selectItems[0] != null && props.selectItems[0] != undefined && props.selectItems[0] != "") {
                selectedCustomers.value = props.selectItems;
                updateModelValue()
            }
        }
    }
}

const getCustomerList = () => {
    loading.value = true;
    getCustomerListForSelectInput().finally(() => {
        loading.value = false;
    })
}

let timeoutId = ref(null as any);

const selectedItem = (item: any) => {
    if (selectedCustomers.value === null || selectedCustomers.value === undefined) {
        selectedCustomers.value = new Array<CustomerDto>();
    }
    if (!props.multiple) {
        autocompleteRef.value.menu = false;
        if (selectedCustomers.value.length == 0)
            selectedCustomers.value.push(item);
        else
            selectedCustomers.value[0] = item;

    } else {
        if (selectedCustomers.value.some((it: CustomerDto) => it.id == item.id))
            selectedCustomers.value = selectedCustomers.value.filter((it: CustomerDto) => it.id != item.id);
        else
            selectedCustomers.value.push(item);
    }
    updateModelValue();
};


const endIntersect = (item: boolean) => {
    if (item && customerListTotalCount.value > customerListItems.value.length && customerListItems.value.length >= pageSize.value) {
        pageNumber.value++;
        getCustomerList();
    }
}

const search = (item: string) => {
    if (noFilter.value) {
        searchValue.value = item;
        if (timeoutId.value) {
            clearTimeout(timeoutId.value);
        }

        timeoutId.value = setTimeout(() => {
            pageNumber.value = 1;
            pageSize.value = 10;
            getCustomerList();
        }, 500);
    }
}

watch(() => selectedCustomers.value, () => {
    if (selectedCustomers.value == null || selectedCustomers.value == undefined) {
        emit('selectValue', selectedCustomers.value);
    }
})

</script>