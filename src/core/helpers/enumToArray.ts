import type { SelectOptionType } from "@/models/types";
import i18n from "@/core/plugins/i18n";

const enumToArray = (enumType: any): SelectOptionType[] => {
    const StringIsNumber = (value: string | number) => isNaN(Number(value)) === false;
    const enumArray = Object.keys(enumType)
        .filter(StringIsNumber)
        .map((key: any) => enumType[key]);
    const locale = i18n.global.locale.value;
    const localUpperCase = i18n.global.locale.value.toUpperCase();
    const types = enumArray.map((x: string) => {
        return {
            title: i18n.global.t('enums.' + x).toLocaleUpperCase(`${localUpperCase}-${locale}`),
            value: enumType[x],
        };
    }) as SelectOptionType[];

    return types;
};

const arrayToOptionModel = (array: any[], titleField?: string, valueField?: string): SelectOptionType[] => {
    const options = array.map((x: any) => {
        if (!titleField) titleField = "title";
        if (!valueField) valueField = "value";
        return {
            title: x[titleField],
            value: x[valueField],
        };
    }) as SelectOptionType[];
    return options;
}

export { enumToArray, arrayToOptionModel };