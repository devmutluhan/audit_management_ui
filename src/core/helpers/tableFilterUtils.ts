import type { ActiveFiltersType, FilterItemsType } from "@/models/types";
import { ref } from "vue";
import i18n from "../plugins/i18n";
const { t } = i18n.global;

export const selectItems = ref(null as any)

export const isClick = (filterOption: any, isFirstFetch: boolean) => {
    // Filtre butonuna tıklayınca burası çalışıyor ve fetch atması gerekiyorsa atıyor.
    // isFetch : Her tıklamada fetch atmasını engeller. İlk tıklamada fetch atar sonra hep o datayı kullanır.
    selectItems.value = null;
    if (filterOption.getItems && !isFirstFetch) {
        isFirstFetch = true
        filterOption.getItems().then((res: any) => {
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
        });
    } else {
        selectItems.value = null;
    }
}

// Burada yaptığın değişiklikleri en alttaki resetAllFilter fonksiyonunda da düzelt.
export const resetFilterOption = (filterOption: any, index?: number) => {
    filterOption.filters.forEach((filter: FilterItemsType) => {
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
            else if (typeof filter.value === 'number') {
                if (filter.isEnum)
                    filter.value = '';
                else
                    filter.value = 0;
            }
        }
    });

    if (filterOption.active)
        applyFilterOption(filterOption);

};

export const applyFilterOption = (filterOption: any) => {
    let filterValues = new Array<ActiveFiltersType>();
    filterOption.filters.forEach((filter: FilterItemsType) => {
        if (Array.isArray(filter.field)) {
            for (let i = 0; i < filter.field.length; i++) {
                const field = filter.field[i];
                const value = filter.value[i];
                filterValues = validateFilters(filterOption, field, value, filterValues);
            }
            if (Array.isArray(filter.value))
                filterOption.active = filter.value.some((a) => a);
        } else {
            const field = filter.field;
            const value = filter.value;
            filterValues = validateFilters(filterOption, field, value, filterValues);
        }
    });
    filterOption.action(filterValues);
};

export const returnLabel = (filter: FilterItemsType, column: any) => {
    if (filter.title)
        return t(filter.title)
    else if (column.columnName) {
        return column.columnName
    } else {
        return ''
    }
}

export const validateFilters = (filterOption: any, field: any, value: any, filterValues: Array<ActiveFiltersType>): Array<ActiveFiltersType> => {
    if (Array.isArray(value) && value.length > 0) {
        filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else if (typeof value === 'string' && value.length > 0) {
        filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else if (typeof value === 'number' && (value !== null || value !== undefined)) {
        filterOption.active = true;
        filterValues.push({ field: field, value: value })
    }
    else {
        filterValues.push({ field: field, value: '' })
        filterOption.active = false;
    }

    return filterValues;
}


export const resetAllFilters = (header: any) => {
    const activeFilters = header.filter((a) => a.filterEnabled == true && a.filterOption.active);
    activeFilters.forEach((option, index) => {
        option.filterOption.active = false;
        option.filterOption.filters.forEach((filter) => {
            if (Array.isArray(filter.field)) {
                filter.value = []
            } else {
                if (Array.isArray(filter.value)) filter.value = [];
                else if (typeof filter.value === 'string') filter.value = '';
                else if (typeof filter.value === 'number') {
                    if (filter.isEnum)
                        filter.value = '';
                    else
                        filter.value = 0;
                }
            }
        });
        option.filterOption.action(new Array<ActiveFiltersType>())
    });
}