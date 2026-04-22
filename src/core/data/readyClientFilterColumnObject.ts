import { ActiveFiltersType, FilterItemsType, FilterItemTypeEnum, FilterOptionType } from "@/models/types"
import { ref } from "vue"
import { enumToArray } from "../helpers/enumToArray";
import { TaxTypeEnum } from "@/models/custom/EnumTypes";

export const activeClientFilters = ref(new Array<ActiveFiltersType>());

export const mountComponentForClientFilter = (tableHeader: any) => {
    activeClientFilters.value = new Array<ActiveFiltersType>();
    const filterColumnArray = tableHeader.filter((e: any) => e.filterEnabled == true);
    columnFiltersOnMount(filterColumnArray);
};

export const columnFiltersOnMount = (columnFilters: Array<any>) => {
    columnFilters.forEach((columnFilter: any) => {
        columnFilter.filterOption.active = false;
        columnFilter.filterOption.filters.forEach((x: any) => {
            if (typeof x.value == 'string') {
                x.value = ''
            } else if (typeof x.value == 'number') {
                x.value = 0
            } else if (Array.isArray(x.value)) {
                x.value = []
            }
        })
        columnFilter.filterOption.action = (prop) => filterAction(prop);
    })
}

const filterAction = (prop: Array<ActiveFiltersType>) => {
    if (prop.length == 0) {
        activeClientFilters.value = new Array<ActiveFiltersType>();
    } else {
        for (let i = 0; i < prop.length; i++) {
            const filterValue = prop[i].value;
            if (filterValue !== '' && filterValue !== undefined && filterValue !== null) {
                activeClientFilters.value.push(prop[i]);
            } else {
                activeClientFilters.value = activeClientFilters.value.filter((x: ActiveFiltersType) => x.field != prop[i].field);
            }
        }
    }
}

export const clientFilterList = (initialList: any) => {
    let filteredList = initialList;
    activeClientFilters.value.forEach((filter: ActiveFiltersType) => {
        filteredList = filteredList.filter((item: any) => {
            const itemValue = item[filter.field];
            const filterValue = filter.value;
            if (Array.isArray(filterValue)) {
                if (Array.isArray(itemValue)) {
                    return filterValue.every(val => itemValue.includes(val));
                } else {
                    return filterValue.includes(itemValue);
                }
            } else if (typeof filterValue === 'string') {
                return itemValue.toString().toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
            } else if (typeof filterValue === 'number') {
                return itemValue === filterValue;
            }
        });
    });
    return filteredList;
}

export const codeFilterText = {
    columnName: 'list.code',
    columnLabel: "code",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "code",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const nameFilterText = {
    columnName: 'list.name',
    columnLabel: "name",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "name",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const claimCardFilterText = {
    columnName: 'form.claimCardTitle',
    columnLabel: "name",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "name",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const titleFilterText = {
    columnName: 'list.title',
    columnLabel: "title",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "title",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const descriptionFilterText = {
    columnName: 'list.description',
    columnLabel: "description",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "description",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const leaveWorkReasonCodeFilterText = {
    columnName: 'list.code',
    columnLabel: "name",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "name",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const leaveWorkReasonDescriptionFilterText = {
    columnName: 'list.description',
    columnLabel: "value",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "value",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: Array<ActiveFiltersType>) => { },
    } as FilterOptionType,
}

export const taxTypeEnumFilter = {
    columnName: 'list.taxType',
    columnLabel: "taxType",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    valueFormatter: (value: any) => {
        return enumToArray(TaxTypeEnum).find(x => x.value === value.taxType)?.title;
    },
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "taxType",
                items: enumToArray(TaxTypeEnum),
                value: null,
                fieldTitle: "title",
                fieldValue: "value",
                isEnum: true
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const taxRateFilter = {
    columnName: 'list.taxRate',
    columnLabel: "rate",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    valueFormatter: (value: any) => {
        return '' + value.rate + ' %';
    },
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "rate",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}