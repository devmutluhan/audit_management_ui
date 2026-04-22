<template>
    <v-row>
        <v-col>
            <InputLabel v-if="isLabelVisible" :description-text="descriptionText"
                :description-text-visible="descriptionTextVisible" :is-required="isRequired" :label="label" />
            <v-autocomplete ref="autocompleteRef" v-model="selectedEmployees" :no-filter="noFilter"
                item-title="firstName" item-value="id" :items="employeeListItems" :density="density"
                :isRequired="isRequired" :hide-details="hideDetails" @update:search="searchEmployee($event);"
                :loading="loading" :multiple="multiple" :rules="defaultRules" :placeholder="$t('general.search')"
                :clearable="clearable" :disabled="disabled"
                @click:clear="justId ? selectedEmployees = null : selectedEmployees = []; emit('selectValue', selectedEmployees); emit('clickClear');"
                autocomplete="off">
                <template v-slot:loader>
                    <v-progress-linear v-if="loading" class="position-fixed" indeterminate
                        color="primary"></v-progress-linear>
                </template>
                <template v-slot:item="{ item }">
                    <v-list-item link @click="selectedItem(item.raw)" :disabled="disabledItem(item.raw).value">
                        <v-row class="d-flex align-center">
                            <v-col cols="auto" :class="multiple ? 'pa-1' : ''" v-if="props.multiple">
                                <v-checkbox readonly color="selectedTab"
                                    :model-value="selectedEmployees?.some((it: any) => it.id == item.raw.id)"
                                    hide-details></v-checkbox>
                            </v-col>
                            <v-col cols="auto" :class="multiple ? 'pa-2' : ''">
                                <ImageCard size="25" :first-value="item.raw.firstName[0]"
                                    :second-value="item.raw.lastName[0]" rounded="circle"
                                    :avatar-text="item.raw.avatarUrl">
                                </ImageCard>
                            </v-col>
                            <v-col cols="auto" :class="multiple ? 'pa-2' : ''">
                                <v-row>
                                    <v-col class="pb-0">
                                        <v-list-item-title>
                                            {{ item.raw.firstName + ' ' + item.raw.lastName }}
                                        </v-list-item-title>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="pt-0" :class="disabledItem(item.raw).value ? 'pb-0' : ''">
                                        <v-list-item-subtitle>{{ item.raw.position }}</v-list-item-subtitle>
                                    </v-col>
                                </v-row>
                                <v-row v-if="disabledItem(item.raw).value">
                                    <v-col class="pt-0 text-error">
                                        {{ disabledItem(item.raw).description ? $t(disabledItem(item.raw).description) :
                                            '' }}
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </template>
                <template v-slot:chip="{ item, index }">
                    <v-chip v-if="index == 0 && !justAvatarChip" class="px-0">
                        <template v-slot:prepend>
                            <ImageCard size="25" :first-value="item.raw.firstName[0]"
                                :second-value="item.raw.lastName[0]" rounded="circle" :avatar-text="item.raw.avatarUrl">
                            </ImageCard>
                        </template>
                        <template v-slot:default>
                            <v-col class="font-weight-bold pl-2">
                                {{ item.raw.firstName + ' ' + item.raw.lastName }}
                            </v-col>
                        </template>
                    </v-chip>
                    <v-chip size="25" v-else-if="index == 1 && !justAvatarChip">
                        + {{ selectedEmployees.length - 1 }}
                    </v-chip>
                    <span v-else-if="index < 3 && justAvatarChip" :class="index != 0 ? 'ml-n4' : ''">
                        <ImageCard size="25" :first-value="item.raw.firstName[0]" :second-value="item.raw.lastName[0]"
                            rounded="circle" :avatar-text="item.raw.avatarUrl">
                        </ImageCard>
                    </span>
                    <span v-else-if="index == 3 && justAvatarChip" class="ml-n4">
                        <v-avatar size="25" color="toolbarButton">
                            + {{ selectedEmployees.length - 3 }}
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
import type { Density } from '@/models/types';
import type { EmployeeDropdownListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { employeeListFirstFetch, employeeListItems, employeeListTotalCount, employeeStatus, getEmployeeListForSelectInput, noFilter, pageNumber, pageSize, searchValue } from './EmployeeSelectUtils';
import { getFileUrl } from '@/core/helpers/assets';
import InputLabel from '../generalInputs/InputLabel.vue';
import { useFormValidationStore } from '@/stores/formValidation';
import { storeToRefs } from 'pinia';
import type { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';
import ImageCard from '@/components/cards/ImageCard.vue';
const { stringRules, objectRules } = storeToRefs(useFormValidationStore());

const selectedEmployees = ref(new Array<EmployeeDropdownListDto>() as any);
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
    employeeStatusFilter: {
        type: null as unknown as PropType<EmployeeStatusTypeEnum | null>,
        default: null,
        required: false,
    },
    disabled: {
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
    disabledItem: {
        type: Function as any,
        default: () => { return { value: false, description: '' } },
        required: false
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
    hideDetails: {
        type: Boolean,
        required: false
    },
    clearable: {
        type: Boolean,
        required: false,
        default: true
    },
    density: {
        type: String as PropType<Density>,
        default: "comfortable"
    },
    label: {
        type: String,
        default: "form.selectEmployee"
    },
    isTableFilter: {
        type: Boolean,
        default: false
    },
    clearSelected: {
        type: Boolean,
        default: false
    },
    isLabelVisible: {
        type: Boolean,
        default: true
    },
    descriptionTextVisible: {
        type: Boolean,
        default: false
    }
});

const updateModelValue = () => {
    if (props.justId) {
        if (!props.multiple)
            emit('selectValue', selectedEmployees.value[0].id);
        else
            emit('selectValue', selectedEmployees.value.map((a: any) => a.id));
    } else {
        if (!props.multiple)
            emit('selectValue', selectedEmployees.value[0]);
        else
            emit('selectValue', selectedEmployees.value);
    }
    emit('updateModelValue', selectedEmployees.value);
}

onMounted(() => {
    if (props.items) {
        employeeListItems.value = props.items;
        employeeListTotalCount.value = props.items.length;
        noFilter.value = false;
        setPropsSelectItem();
    } else {
        if (props.employeeStatusFilter !== null)
            employeeStatus.value = props.employeeStatusFilter;
        else
            employeeStatus.value = null

        pageNumber.value = 1

        // Table filter için koyuldu bu if 
        if (!props.isTableFilter || employeeListFirstFetch.value) {
            getEmployeeList();
        }
        setPropsSelectItem();
    }
})

watch(() => props.selectItems, () => {
    // Table filter için koyuldu bu if 

    if (!props.isTableFilter) {
        setPropsSelectItem();
    } else {
        if (props.selectItems?.length == 0) {
            selectedEmployees.value = new Array<EmployeeDropdownListDto>();
        }
    }
})

const setPropsSelectItem = () => {
    if (!props.items) {
        if (props.justId) {
            if (props.selectItems && props.selectItems.length > 0) {
                if (props.selectItems[0] != null && props.selectItems[0] != undefined && props.selectItems[0] != "") {
                    if (!props.isTableFilter) {
                        if (!props.multiple) {
                            selectedEmployees.value.push(props.selectItems[0])
                        } else {
                            selectedEmployees.value = props.selectItems
                        }
                        updateModelValue()
                    } else { // Table filter için kullanılıyorsa aşağı giriyor (props.selectItems sadece id[] geliyorsa aşağıdaki kod çalışıyor)
                        props.selectItems.forEach((x: string) => {
                            let employee = employeeListItems.value.find((a: EmployeeDropdownListDto) => a.id == x)
                            if (employee && x)
                                selectedEmployees.value.push(employee)
                        });
                    }
                }
            }
        } else {
            if (props.selectItems && props.selectItems.length > 0) {
                if (props.selectItems[0] != null && props.selectItems[0] != undefined && props.selectItems[0] != "") {
                    selectedEmployees.value = props.selectItems;
                    updateModelValue()
                }
            }
        }
    } else {
        if (props.selectItems && props.selectItems.length > 0)
            if (props.selectItems[0] != null && props.selectItems[0] != undefined) {
                selectedEmployees.value = props.items.filter((a) => props.selectItems?.includes(a.id))
            }
    }
}

const getEmployeeList = () => {
    loading.value = true;
    getEmployeeListForSelectInput().finally(() => {
        loading.value = false;
    })
}

let timeoutId = ref(null as any);

const selectedItem = (item: any) => {
    if (selectedEmployees.value === null || selectedEmployees.value === undefined) {
        selectedEmployees.value = new Array<EmployeeDropdownListDto>();
    }
    if (!props.multiple) {
        autocompleteRef.value.menu = false;
        if (selectedEmployees.value.length == 0)
            selectedEmployees.value.push(item);
        else
            selectedEmployees.value[0] = item;

    } else {
        if (selectedEmployees.value.some((it: EmployeeDropdownListDto) => it.id == item.id))
            selectedEmployees.value = selectedEmployees.value.filter((it: EmployeeDropdownListDto) => it.id != item.id);
        else
            selectedEmployees.value.push(item);
    }
    updateModelValue();
};


const endIntersect = (item: boolean) => {
    if (item && employeeListTotalCount.value > employeeListItems.value.length && employeeListItems.value.length >= pageSize.value) {
        pageNumber.value++;
        getEmployeeList();
    }
}

const searchEmployee = (item: string) => {
    if (noFilter.value) {
        searchValue.value = item;
        if (timeoutId.value) {
            clearTimeout(timeoutId.value);
        }

        timeoutId.value = setTimeout(() => {
            pageNumber.value = 1;
            pageSize.value = 10;
            getEmployeeList();
        }, 500);
    }
}

watch(() => selectedEmployees.value, () => {
    if (selectedEmployees.value == null || selectedEmployees.value == undefined) {
        emit('selectValue', selectedEmployees.value);
    }
})

watch(() => props.clearSelected, () => {
    selectedEmployees.value = [];
})

</script>