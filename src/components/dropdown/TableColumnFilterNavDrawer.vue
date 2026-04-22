<template>
    <v-card color="transparent" border="false" align="left">
        <v-card-text v-for="(filter, index) in filterOption.filters" :key="index" class="py-0"
            @click="isClick(filterOption, isFirstFetch)">
            <!-- Text -->
            <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Text && filter.components == null">
                <TextField v-model="filter.value" hide-details :label="returnLabel(filter, column)"
                    placeholder="general.search" @keyup.enter="applyFilterOption(filterOption)" />
            </v-col>
            <!-- Single Select -->
            <v-col cols="12"
                v-if="filter.type == FilterItemTypeEnum.SingleSelect && filter.items && filter.components == null">
                <SingleAutocompleteInput v-model="filter.value" :label="returnLabel(filter, column)"
                    :items="selectItems !== null ? selectItems : filter.items" hide-details placeholder="general.select"
                    :item-value="filter.fieldValue ? filter.fieldValue : 'value'"
                    :item-title="filter.fieldTitle ? filter.fieldTitle : 'title'"
                    @keyup.enter="applyFilterOption(filterOption)">
                </SingleAutocompleteInput>
            </v-col>
            <!-- Multiple Select -->
            <v-col cols="12"
                v-if="filter.type == FilterItemTypeEnum.MultipleSelect && filter.items && filter.components == null">
                <MultipleAutocompleteInput v-model="filter.value" :label="returnLabel(filter, column)" hide-details
                    :item-value="filter.fieldValue ? filter.fieldValue : 'value'" placeholder="general.select"
                    :item-title="filter.fieldTitle ? filter.fieldTitle : 'title'"
                    :items="selectItems !== null ? selectItems : filter.items"
                    @keyup.enter="applyFilterOption(filterOption)">
                    <template v-slot:chipItem="{ props, item, index }">
                        <v-chip class="pa-4" variant="flat" color="buttonChipColor" v-bind="props" v-if="index == 0">
                            {{ item[filter.fieldTitle] }}
                        </v-chip>
                        <v-chip v-else-if="index == 1">
                            + {{ filter.value.length - 1 }}
                        </v-chip>
                    </template>
                </MultipleAutocompleteInput>
            </v-col>
            <!-- Switch -->
            <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Switch && filter.components == null"
                style="max-height: 200px; overflow-y: auto; min-height: 130px; overflow-x: hidden;">
                <SwitchInput v-model="filter.value" hide-details :label="returnLabel(filter, column)"
                    @keyup.enter="applyFilterOption(filterOption)">
                </SwitchInput>
            </v-col>
            <!-- Date -->
            <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.Date && filter.components == null"
                style="max-height: 200px; overflow-y: auto; min-height: 130px; overflow-x: hidden;">
                <DateInput v-model="filter.value" hide-details :label="returnLabel(filter, column)"
                    @keyup.enter="applyFilterOption(filterOption)">
                </DateInput>
            </v-col>
            <!-- DateRange -->
            <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.DateRange && filter.components == null"
                style="max-height: 250px; overflow-y: auto; min-height: 130px; overflow-x: hidden;">
                <v-label v-if="returnLabel(filter, column)" class="mb-2 font-weight-bold">
                    {{ $t(returnLabel(filter, column)) }}
                </v-label>
                <v-row>
                    <v-col cols="12">
                        <DateInput v-model="filter.value[0]" density="compact" hide-details clearable label="form.start"
                            @keyup.enter="applyFilterOption(filterOption)"
                            @clickClear="resetFilterOption(filterOption, 0)">
                        </DateInput>
                    </v-col>
                    <v-col cols="12">
                        <DateInput v-model="filter.value[1]" density="compact" hide-details clearable label="form.end"
                            @keyup.enter="applyFilterOption(filterOption)"
                            @clickClear="resetFilterOption(filterOption, 1)">
                        </DateInput>
                    </v-col>
                </v-row>
            </v-col>
            <!-- NumberRange -->
            <v-col cols="12" v-if="filter.type == FilterItemTypeEnum.NumberRange && filter.components == null"
                style="max-height: 250px; overflow-y: auto; min-height: 130px; overflow-x: hidden;">
                <v-label v-if="returnLabel(filter, column)" class="mb-2 font-weight-bold">
                    {{ $t(returnLabel(filter, column)) }}
                </v-label>
                <v-row>
                    <v-col cols="12">
                        <TextField v-model="filter.value[0]" hide-details density="compact" clearable
                            @clickClear="resetFilterOption(filterOption, 0)" isNumber placeholder="form.leastDayCount"
                            @keyup.enter="applyFilterOption(filterOption)" />
                    </v-col>
                    <v-col cols="12">
                        <TextField v-model="filter.value[1]" hide-details density="compact" clearable
                            @clickClear="resetFilterOption(filterOption, 1)" isNumber placeholder="form.mostDayCount"
                            @keyup.enter="applyFilterOption(filterOption)" />
                    </v-col>
                </v-row>
            </v-col>
            <!-- Component -->
            <v-col cols="12" v-if="filter.components != null">
                <component :is="filter.components" @selectValue="filter.value = $event;" justId hide-details
                    :selectItems="filter.type == FilterItemTypeEnum.MultipleSelect ? filter.value : [filter.value]"
                    @keyup.enter="applyFilterOption(filterOption)" @clickClear="resetFilterOption(filterOption)"
                    isTableFilter :multiple="filter.type === FilterItemTypeEnum.MultipleSelect ? true : false" />
            </v-col>
            <v-col cols="12" class="d-flex justify-content-end">
                <v-btn class="mr-2" @click="resetFilterOption(filterOption)" color="cancelButtonColor">
                    {{ $t('general.reset') }}
                </v-btn>
                <v-btn class="ml-2" @click="applyFilterOption(filterOption)" color="confirmButtonColor">
                    {{ $t('general.apply') }}
                </v-btn>
            </v-col>
        </v-card-text>
        <v-divider></v-divider>
    </v-card>
</template>

<script lang="ts" setup>
import { FilterItemTypeEnum } from "@/models/types";
import { ref, type PropType } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import SingleAutocompleteInput from "@/components/formInput/generalInputs/SingleAutocompleteInput.vue";
import MultipleAutocompleteInput from "@/components/formInput/generalInputs/MultipleAutocompleteInput.vue";
import SwitchInput from "@/components/formInput/generalInputs/SwitchInput.vue";
import DateInput from "@/components/formInput/generalInputs/DateInput.vue";
import { applyFilterOption, isClick, resetFilterOption, returnLabel, selectItems } from "@/core/helpers/tableFilterUtils";

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

const isFirstFetch = ref(false);

</script>