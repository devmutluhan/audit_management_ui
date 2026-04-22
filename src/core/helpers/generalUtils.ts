import type { ActiveFiltersType } from "@/models/types";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { isMobileApp } from "@/assets/ts/_utils";
import { nextTick } from "vue";

// Arama yapmak için backend e ihtiyaç yoksa web tarafında string arama yapar.
export const clientFilter = (items: any[], itemValue: string, searchValue: string): any[] => {
    return items.filter((a: any) => itemValue ?
        a[itemValue].toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) :
        items
    )
}

// Para formatlar. ₺ 105.000 gibi
export const formatterPrice = (value: number, currencyName?: string): string => {
    if (value == null || value == undefined) return '-';
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currencyName ? currencyName : 'TRY',
    }).format(value)
}

// Para Formatlar ama sonuna TL, USD, EUR yazar.
export const formatterPriceForCurrencyName = (value: number, currencyName?: string): string => {
    if (value == null || value == undefined) return '-';

    const val = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currencyName ? currencyName : 'TRY',
    }).format(value);

    let result = '0'
    if (val[0] == '-') {
        result = val.slice(2, val.length) + ' ' + (currencyName ? currencyName : 'TRY');
        result = '-' + result
    } else {
        result = val.slice(1, val.length) + ' ' + (currencyName ? currencyName : 'TRY');
    }
    return result;
}

// Web de görünen veriyi kopyalamayı sağlar
export const copyText = (text: string) => {
    var isCopied = true;
    if (text)
        navigator.clipboard.writeText(text);
    setTimeout(() => {
        isCopied = false;
    }, 3000);
};

// Verilen default model ile verilen datayı propertylerine göre eşitler.
export const mappingModel = (model: any, data: any): any => {
    const resultModel = model
    Object.entries(model).forEach((prop: [key: string, value: any], index) => {
        resultModel[prop[0]] = data[prop[0]] === null ? null : data[prop[0]]
    });
    return resultModel;
}

// GET İsteği öncesi queryString oluşturur.
export const mapQueryString = (query: any): any => {
    let queryString = '?'
    if (query)
        Object.entries(query).forEach((prop: [key: string, value: any], index: number) => {
            const key = prop[0]
            const value = prop[1]
            if (value !== '' && value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach((a) => {
                        if (a !== '' && a !== null && a !== undefined)
                            queryString += key + '=' + a + '&'
                    })
                } else {
                    queryString += key + '=' + value + '&'
                }
            }
        });
    return queryString;
}

// Tablodaki filtreleme işlemleri öncesi query oluşturur.
export const filterQuery = (filterItems: Array<ActiveFiltersType>, initModel: any): any => {
    const model = JSON.parse(JSON.stringify(initModel));
    if (filterItems.length > 0) {
        filterItems.forEach((x: ActiveFiltersType) => {
            if (x.value !== '' && x.value !== null && x.value !== undefined) {
                if (!Array.isArray(x.field)) {
                    model[x.field] = x.value;
                } else {
                    console.log('girdi', x.field, x.value);
                    x.field.forEach((field: string) => {
                        model[field] = x.value;
                    });
                }
            }
        })
    }
    return model;
}

// String olan verilerin başında ve sonundaki boşlukları siler.
export const commandStringTrimFunc = (data: any): any => {
    if (typeof data === 'string') {
        return data.trim();
    }

    if (data === null || typeof data !== 'object') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map((item: any) => commandStringTrimFunc(item));
    }

    Object.keys(data).forEach((key: string) => {
        const value = data[key];

        if (typeof value === 'object' && value !== null) {
            data[key] = commandStringTrimFunc(value);
        }
        else if (typeof value === 'string') {
            data[key] = value.trim();
        }

        if (
            typeof data[key] === 'string' &&
            key.toLowerCase().includes('date') &&
            data[key] === ''
        ) {
            data[key] = null;
        }
    });

    return data;
}

// ApprovementStatusEnum için chipRengi döner.
// Todo: bu tek bir componente dönüştürülüp oraya taşınacak.
export const getChipColor = (status: ApprovementStatusEnum) => {
    if (ApprovementStatusEnum.Draft == status)
        return 'warning'
    else if (ApprovementStatusEnum.Waiting == status)
        return 'warning'
    else if (ApprovementStatusEnum.Approved == status)
        return 'success'
    else if (ApprovementStatusEnum.Rejected == status)
        return 'error'
    else if (ApprovementStatusEnum.SendBack == status)
        return 'info'
    else
        return 'error'
}

export const sendMessageToFlutter = (key: string, object: any) => {
    if (isMobileApp()) {
        if ((window as any).flutter_inappwebview && typeof (window as any).flutter_inappwebview.callHandler === 'function') {
            ((window as any).flutter_inappwebview as any).callHandler(key, object)
        } else {
            console.error("Flutter işleyicisi mevcut değil.");
            // ErrorStatusResult[999]({ message: "Flutter işleyicisi mevcut değil." })
        }
    }
}

export const scrollToAlert = (ref: null | any) => {
    nextTick(() => {
        if (ref.value) {
            ref.value.$el.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    });
};