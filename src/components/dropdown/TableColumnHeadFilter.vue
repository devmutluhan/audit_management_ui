<template>
    <v-row v-for="(filter, index) in filterOption?.filters" :key="index" @click="isClick()">
        <!-- Text -->
        <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Text && filter.components == null">
            <TextField v-model="filter.value" hide-details density="compact" clearable @clickClear="resetFilterOption()"
                @keyup.enter="applyFilterOption()" @input="onInput()" placeholder="general.search" />
        </v-col>
        <!-- Single Select -->
        <v-col cols="12"
            v-if="filter.type == FilterItemTypeEnum.SingleSelect && filter.items && filter.components == null">
            <SingleAutocompleteInput v-model="filter.value" :items="selectItems !== null ? selectItems : filter.items"
                hide-details :item-value="filter.fieldValue ? filter.fieldValue : 'value'" placeholder="general.select"
                @update:model-value="onInput()" :item-title="filter.fieldTitle ? filter.fieldTitle : 'title'"
                @keyup.enter="applyFilterOption()" density="compact" clearable @clickClear="resetFilterOption()">
            </SingleAutocompleteInput>
        </v-col>

        <!-- Multiple Select -->
        <v-col cols="12"
            v-if="filter.type == FilterItemTypeEnum.MultipleSelect && filter.items && filter.components == null">
            <MultipleAutocompleteInput v-model="filter.value" @update:model-value="onInput()"
                :item-value="filter.fieldValue ? filter.fieldValue : 'value'" placeholder="general.select"
                :item-title="filter.fieldTitle ? filter.fieldTitle : 'title'" hide-details density="compact"
                :items="selectItems !== null ? selectItems : filter.items" @keyup.enter="applyFilterOption()" clearable
                @clickClear="resetFilterOption()">
                <template v-slot:chipItem="{ props, item, index }">
                    <div class="d-flex flex-column">
                        <v-chip variant="outlined" class="font-weight-bold" color="buttonChipColor" v-bind="props"
                            v-if="index == 0">
                            {{
                                item[filter.fieldTitle].length > 12
                                    ? item[filter.fieldTitle].slice(0, 12) + '...'
                                    : item[filter.fieldTitle]
                            }}
                        </v-chip>
                        <v-chip v-else-if="index == 1" class="font-weight-bold">
                            + {{ filter.value.length - 1 }}
                        </v-chip>
                    </div>
                </template>
            </MultipleAutocompleteInput>
        </v-col>
        <!-- Switch -->
        <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Switch && filter.components == null"
            style="max-height: 200px; overflow-y: auto; min-height: 130px; overflow-x: hidden;">
            <SwitchInput v-model="filter.value" @keyup.enter="applyFilterOption()" hide-details
                @update:model-value="applyFilterOption()" clearable @clickClear="resetFilterOption()">
            </SwitchInput>
        </v-col>
        <!-- Date -->
        <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Date && filter.components == null">
            <DateInput v-model="filter.value" density="compact" hide-details clearable
                @keyup.enter="applyFilterOption()" @clickClear="resetFilterOption()"
                @update:model-value="applyFilterOption()">
            </DateInput>
        </v-col>
        <!-- Date Range -->
        <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.DateRange && filter.components == null">
            <v-menu :close-on-content-click="false" class="d-inline-flex pa-0">
                <template v-slot:activator="{ props }">
                    <v-text-field :placeholder="(filter.value[0] || filter.value[1]) ?
                        (filter.value[0] ? formatterDate(filter.value[0]) : '∞ ') + ' - ' +
                        (filter.value[1] ? formatterDate(filter.value[1]) : ' ∞') : $t('general.search')
                        " v-bind="props" class="w-100" readonly>
                    </v-text-field>
                </template>
                <v-card color="dropdownCard">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <DateInput v-model="filter.value[0]" density="compact" hide-details clearable
                                    label="form.start" @keyup.enter="applyFilterOption()"
                                    @clickClear="resetFilterOption(0)">
                                </DateInput>
                            </v-col>
                            <v-col cols="12">
                                <DateInput v-model="filter.value[1]" density="compact" hide-details clearable
                                    label="form.end" @keyup.enter="applyFilterOption()"
                                    @clickClear="resetFilterOption(1)">
                                </DateInput>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-col cols="12" class="d-flex justify-content-end">
                        <v-btn class="mr-2" @click="resetFilterOption()" color="cancelButtonColor">
                            {{ $t('general.reset') }}
                        </v-btn>
                        <v-btn class="ml-2" @click="applyFilterOption()" color="confirmButtonColor">
                            {{ $t('general.apply') }}
                        </v-btn>
                    </v-col>
                </v-card>
            </v-menu>
        </v-col>
        <!-- Range Number -->
        <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.NumberRange && filter.components == null">
            <v-menu :close-on-content-click="false" class="d-inline-flex pa-0">
                <template v-slot:activator="{ props }">
                    <v-text-field :placeholder="(filter.value[0] || filter.value[1]) ?
                        (filter.value[0] ? filter.value[0] : '∞ ') + ' - ' +
                        (filter.value[1] ? filter.value[1] : ' ∞') : $t('general.search')
                        " v-bind="props" class="w-100" readonly>
                    </v-text-field>
                </template>
                <v-card color="dropdownCard">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <TextField v-model="filter.value[0]" hide-details density="compact" clearable
                                    label="form.leastDayCount" @clickClear="resetFilterOption(0)" isNumber
                                    placeholder="0" @keyup.enter="applyFilterOption()" />
                            </v-col>
                            <v-col cols="12">
                                <TextField v-model="filter.value[1]" hide-details density="compact" clearable
                                    label="form.mostDayCount" @clickClear="resetFilterOption(1)" isNumber
                                    placeholder="9999" @keyup.enter="applyFilterOption()" />
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-col cols="12" class="d-flex justify-content-end">
                        <v-btn class="mr-2" @click="resetFilterOption()" color="cancelButtonColor">
                            {{ $t('general.reset') }}
                        </v-btn>
                        <v-btn class="ml-2" @click="applyFilterOption()" color="confirmButtonColor">
                            {{ $t('general.apply') }}
                        </v-btn>
                    </v-col>
                </v-card>
            </v-menu>
        </v-col>
        <!-- Component -->
        <v-col cols="12" v-if="filter.components != null">
            <component :is="filter.components" @selectValue="filter.value = $event;" justId :isLabelVisible="false"
                hide-details @keyup.enter="applyFilterOption()" @clickClear="resetFilterOption()" density="compact"
                @updateModelValue="onInput()" justAvatarChip
                :selectItems="filter.type == FilterItemTypeEnum.MultipleSelect ? filter.value : [filter.value]"
                isTableFilter :multiple="filter.type === FilterItemTypeEnum.MultipleSelect ? true : false" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { FilterItemTypeEnum, type ActiveFiltersType, type FilterItemsType } from "@/models/types";
import { ref, type PropType } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import SingleAutocompleteInput from "@/components/formInput/generalInputs/SingleAutocompleteInput.vue";
import MultipleAutocompleteInput from "@/components/formInput/generalInputs/MultipleAutocompleteInput.vue";
import SwitchInput from "@/components/formInput/generalInputs/SwitchInput.vue";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import { formatterDate } from "@/core/helpers/dateUtils";

const props = defineProps({
    filterOption: {
        required: true,
        type: Object as PropType<any>,
    },
    column: {
        required: true,
        type: Object as any
    }
});

const selectItems = ref(null as any)

const isFirstFetch = ref(false);
let timeoutId = ref(null as any)

const onInput = () => {
    // Zamanlayıcıyı temizle
    if (timeoutId.value) clearTimeout(timeoutId.value)

    // Yeni zamanlayıcı başlat (3 saniye)
    timeoutId.value = setTimeout(() => {
        applyFilterOption()
    }, 500)
}

const isClick = () => {
    // Filtre butonuna tıklayınca burası çalışıyor ve fetch atması gerekiyorsa atıyor.
    // isFirstFetch : Her tıklamada fetch atmasını engeller. İlk tıklamada fetch atar sonra hep o datayı kullanır.
    if (props.filterOption.getItems && !isFirstFetch.value) {
        isFirstFetch.value = true
        props.filterOption.getItems().then((res: any) => {
            if (res.items)
                if (Array.isArray(selectItems.value))
                    selectItems.value = selectItems.value.concat(res.items)
                else
                    selectItems.value = res.items
            else
                if (Array.isArray(selectItems.value))
                    selectItems.value = selectItems.value.concat(res)
                else
                    selectItems.value = res
        })
    } else {
        selectItems.value = null;
    }
}

const resetFilterOption = (index?: number) => {
    props.filterOption.filters.forEach((filter: FilterItemsType) => {
        if (Array.isArray(filter.field) && (index === undefined || index === null)) {
            filter.value = []
        }
        else if (index !== undefined && index !== null) {
            if (Array.isArray(filter.value[index])) filter.value[index] = [];
            else if (typeof filter.value[index] === 'string') filter.value[index] = '';
            else if (typeof filter.value[index] === 'number') filter.value[index] = 0;
        }
        else {
            if (Array.isArray(filter.value)) filter.value = [];
            else if (typeof filter.value === 'string') filter.value = '';
            else if (typeof filter.value === 'number') filter.value = 0;
        }
    });

    if (props.filterOption.active)
        applyFilterOption();

};

const applyFilterOption = () => {
    let filterValues = new Array<ActiveFiltersType>()
    props.filterOption.filters.forEach((filter: FilterItemsType) => {
        if (Array.isArray(filter.field)) {
            props.filterOption.active = true;
            for (let i = 0; i < filter.field.length; i++) {
                const field = filter.field[i];
                const value = filter.value[i];
                filterValues = validateFilters(field, value, filterValues);
            }
            if (Array.isArray(filter.value))
                props.filterOption.active = filter.value.some((a) => a);
        } else {
            const field = filter.field;
            const value = filter.value;
            filterValues = validateFilters(field, value, filterValues);
        }
    });

    props.filterOption.action(filterValues);
};

const validateFilters = (field: any, value: any, filterValues: Array<ActiveFiltersType>): Array<ActiveFiltersType> => {
    if (Array.isArray(value) && value.length > 0) {
        props.filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else if (typeof value === 'string' && value.length > 0) {
        props.filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else if (typeof value === 'number' && (value !== null || value !== undefined)) {
        props.filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else {
        filterValues.push({ field: field, value: '' })
        props.filterOption.active = false;
    }

    return filterValues;
}

</script>