export class TaxDto {
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

export class NotificationsDto {
    constructor() {
        this.id = ''
        this.title = '';
        this.readAt = '';
        this.message = '';
        this.data = '';
    }
    id: string
    title: string;
    readAt: string;
    message: string;
    data: string | any;
}


export class TaxOfficeDto {
    constructor() {
        this.id = '';
        this.name = '';
        this.code = '';
    }
    id: string;
    name: string;
    code: string;
}

export class CountryDto {
    constructor() {
        this.name = null;
        this.code = null;
    }
    name: string | null;
    code: string | null;
}