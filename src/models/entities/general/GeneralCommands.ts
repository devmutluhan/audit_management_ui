import type { TaxTypeEnum } from "@/models/custom/EnumTypes";

export class CreateTaxCommand {
    constructor() {
        this.taxType = null;
        this.name = '';
        this.rate = '';
        this.formula = "";
    }
    taxType: TaxTypeEnum | null;
    name: string;
    rate: number | string;
    formula: string;
}

export class UpdateTaxCommand {
    constructor() {
        this.id = '';
        this.taxType = 0;
        this.name = '';
        this.rate = '';
        this.formula = '';
    }
    id: string;
    taxType: number;
    name: string;
    rate: number | string;
    formula: string;
}

export class CreateTaxOfficeCommand {
    constructor() {
        this.name = '';
        this.code = '';
    }
    name: string;
    code: string;
}

export class UpdateTaxOfficeCommand {
    constructor() {
        this.id = '';
        this.name = '';
        this.code = '';
    }
    id: string;
    name: string;
    code: string;
}