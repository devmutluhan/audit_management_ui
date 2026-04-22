<template>
    <v-card border="false">
        <v-card-text :style="isMobileDevice() ? { height: '70vh' } : { height: '60vh' }" style="overflow: auto;">
            <Datatable :data="employeeList.items ?? []" :checkboxEnabled="true" :header="tableHeader"
                :enable-items-per-page-dropdown="true" :loading="loading" :currentPage="employeeList.pageNumber"
                :infiniteScroll="true" :total="employeeList.totalCount" @onItemsSelect="selectedEmployeeIds = $event;"
                :currentlySelectedItems="selectedEmployeeIds">
                <template v-slot:avatar="{ row: data }">
                    <ImageCard :first-value="data.firstName" :second-value="data.lastName" color="red"
                        :avatarText="data.avatarUrl" rounded="lg" />
                </template>
                <template v-slot:fullName="{ row: data }">
                    <p class="font-weight-bold ma-0">
                        {{ data.firstName + ' ' + data.lastName }}
                    </p>
                </template>
                <template v-slot:managerId="{ row: data }">
                    <EmployeeSelectInput @click.stop :selectItems="data.managerId ? [data.managerId] : undefined"
                        :disabledItem="(a) => { return disabledEmployee(data, a.id) }"
                        :isRequired="selectedEmployeeIds.includes(data.id)"
                        @update-model-value="selectManagerToEmployee($event[0], data)"
                        @selectValue="selectManagerToEmployee($event[0], data)" :items="initialEmployeeList.items"
                        :isLabelVisible="false">
                    </EmployeeSelectInput>
                </template>
            </Datatable>
        </v-card-text>
        <v-row class="d-flex justify-end mt-4">
            <v-col cols="auto" align="end">
                <v-dialog width="800">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn color="confirmButtonColor" variant="outlined" size="small"
                            :disabled="selectedEmployeeIds.length === 0" v-bind="activatorProps">
                            {{ $t('list.assignManagerToSelectedEmployees') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <SelectEmployeeEmitDialog :dialogClose="() => { isActive.value = false }"
                            :initialEmployeeList="initialEmployeeList.items ?? []"
                            @createItem="selectManagerFromDialog($event)" :selectedNotManagerIds="selectedNotManagerIds"
                            :selectedEmployeeIds="selectedEmployeeIds" />
                    </template>
                </v-dialog>
                <p class="mb-0 text-subtitle-1 text-error" v-if="selectedNotManagerIds?.length">
                    <v-icon color="error">mdi-alert</v-icon>
                    {{ $t('list.selectedEmployeeNotValid', {
                        count:
                            selectedNotManagerIds?.length
                    }) }}
                </p>
            </v-col>
        </v-row>
    </v-card>
</template>

<script lang="ts" setup>
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import { computed, onMounted, type PropType, ref, watch } from "vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import { FilterItemsType, FilterItemTypeEnum, FilterOptionType, type ActiveFiltersType } from "@/models/types";
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import type { EmployeeListDto } from "@/models/entities/humanResource/EmployeeDtos";
import type { PaginatedList } from "@/models/ApiResult";
import type { ReviewSummaryDto } from '@/models/entities/humanResource/PerformanceDtos';
import SelectEmployeeEmitDialog from '@/components/dialogs/humanResources/SelectEmployeeEmitDialog.vue';
import { isMobileDevice } from '@/assets/ts/_utils';

const activeFilters = ref(new Array<ActiveFiltersType>());
const emit = defineEmits(['update:selectedEmployeeIds']);

const props = defineProps({
    initialEmployeeList: {
        type: Object as PropType<PaginatedList<EmployeeListDto>>,
        required: true
    },
    periodReviewList: {
        type: Array<ReviewSummaryDto>,
        required: true
    },
    selectedEmployeeIds: {
        type: Array<String>,
        required: true
    }
});

const loading = ref(false)
const employeeList = ref({} as PaginatedList<EmployeeListDto>);

const selectedEmployeeIds = computed({
    get() {
        return props.selectedEmployeeIds ?? [];
    },
    set(newValue: Array<string>) {
        emit('update:selectedEmployeeIds', newValue);
    }
});

onMounted(() => {
    mountDialog()
})

watch(() => props.initialEmployeeList, () => {
    mountDialog()
}, { deep: true })

const mountDialog = () => {
    if (props.initialEmployeeList) {
        const filterReviewIds = props.periodReviewList.map((a) => { return a.reviewee.id })
        let resultCount = props.initialEmployeeList.totalCount - filterReviewIds.length;
        let resultItems = props.initialEmployeeList.items ? props.initialEmployeeList.items.filter((a) => !filterReviewIds.includes(a.id)) : Array<EmployeeListDto>()
        employeeList.value.totalCount = resultCount;
        employeeList.value.items = resultItems;
    }
}

const selectManagerToEmployee = (selectedEmployee: EmployeeListDto, data: EmployeeListDto) => {
    if (selectedEmployee && selectedEmployee.id) {
        data.managerId = selectedEmployee.id;
        data.managerName = selectedEmployee.firstName + ' ' + selectedEmployee.lastName;
        if (!selectedEmployeeIds.value.includes(data.id)) {
            selectedEmployeeIds.value.push(data.id);
        }
    } else {
        data.managerId = ''
        data.managerName = ''
        const index = selectedEmployeeIds.value.findIndex((a) => a == data.id)
        if (index != -1) {
            selectedEmployeeIds.value.splice(index, 1);
        }
    }
}

const selectManagerFromDialog = (event: { selectedEmployee: EmployeeListDto, employeeIds: Array<string> }) => {
    if (employeeList.value.items) {
        const employees = employeeList.value.items.filter((a) => event.employeeIds.includes(a.id));
        employees.forEach((a) => {
            a.managerId = event.selectedEmployee.id;
            a.managerName = event.selectedEmployee.firstName + ' ' + event.selectedEmployee.lastName;
            if (!selectedEmployeeIds.value.includes(a.id)) {
                selectedEmployeeIds.value.push(a.id);
            }
        })
    }
}

const disabledEmployee = (data: any, selectedEmployeeId: string) => {
    if (data.id == selectedEmployeeId) {
        return { value: true, description: 'enums.Self' }
    }
    return { value: false, description: '' }
}

const isChange = (filterItems: Array<ActiveFiltersType>) => {
    if (!props.initialEmployeeList.items) return;

    if (!filterItems || filterItems.length === 0) {
        employeeList.value.items = [...props.initialEmployeeList.items];
        employeeList.value.totalCount = JSON.parse(JSON.stringify(props.initialEmployeeList.totalCount))
        return;
    }

    const filteredResult = props.initialEmployeeList.items.filter((employee) => {
        return filterItems.every((filter) => {

            if (!filter.value) return true;

            const filterValueStr = String(filter.value).toLocaleLowerCase('tr');
            const filterField = filter.field as string;

            if (filterField === 'fullName') {
                const fullName = `${employee.firstName} ${employee.lastName}`;
                return fullName.toLocaleLowerCase('tr').includes(filterValueStr);
            }

            const recordValue = (employee as any)[filterField];

            if (recordValue) {
                return String(recordValue).toLocaleLowerCase('tr').includes(filterValueStr);
            }

            return false;
        });
    });

    employeeList.value.items = filteredResult;
    employeeList.value.totalCount = filteredResult.length;
};

const selectedNotManagerIds = computed(() => {
    if (employeeList.value.items)
        return employeeList.value.items.filter((a) => props.selectedEmployeeIds.includes(a.id) && !a.managerId).map((b) => b.id);
    else
        return []
})

const filterAction = (prop: ActiveFiltersType) => {
    const index = activeFilters.value.findIndex((a) => a.field == prop.field);
    if (prop.value) {
        if (index != -1) {
            activeFilters.value[index] = prop;
        } else {
            activeFilters.value.push(prop)
        }
    } else {
        if (index != -1)
            activeFilters.value.splice(index, 1)
    }
    isChange(activeFilters.value);
}

const tableHeader = ref([
    {
        columnLabel: 'avatar',
        columnName: '',
        sortEnabled: false,
    },
    {
        columnName: 'general.employeeFullName',
        columnLabel: "fullName",
        sortEnabled: true,
        columnWidth: 175,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "fullName",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                filterAction(prop[0])
            },
        } as FilterOptionType,
    },
    {
        columnName: 'list.position',
        columnLabel: "position",
        sortEnabled: true,
        columnWidth: 175,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "position",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                filterAction(prop[0])
            },
        } as FilterOptionType,
    },
    {
        columnName: 'form.department',
        columnLabel: "department",
        sortEnabled: true,
        columnWidth: 175,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "department",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                filterAction(prop[0])
            },
        } as FilterOptionType,
    },
    {
        columnName: 'form.manager',
        columnLabel: "managerId",
        sortEnabled: true,
        columnWidth: 175,
        filterEnabled: true,
        filterOption: {
            active: false,
            filters: [
                {
                    type: FilterItemTypeEnum.Text,
                    field: "managerName",
                    value: "",
                },
            ] as FilterItemsType[],
            action: (prop: Array<ActiveFiltersType>) => {
                filterAction(prop[0])
            },
        } as FilterOptionType,
        rowColor: true,
        rowColorFunc: (row: EmployeeListDto) => {
            if (row) {
                if (row.managerId || !props.selectedEmployeeIds.includes(row.id)) {
                    return null
                } else {
                    return 'bg-warningTableColor'
                }
            }
        }
    }
]);

</script>