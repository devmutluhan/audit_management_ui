export class CreateCustomerCommand {
    constructor() {
        this.name = "";
        this.keyClient = false;
        this.taxNumber = "";
        this.termTime = null;
        this.taxOfficeId = null;
        this.customerTypeId = null;
        this.sectorId = null;
        this.parentId = null;
    }
    name: string;
    keyClient: boolean;
    taxNumber: string;
    taxOfficeId: string | null
    termTime: number | null;
    customerTypeId: string | null;
    sectorId: string | null
    parentId: string | null;
}

export class UpdateCustomerCommand {
    constructor() {
        this.name = "";
        this.keyClient = false;
        this.taxNumber = "";
        this.logoFileId = "";
        this.termTime = 0;
        this.isPassive = false;
        this.parentId = "";
        this.customerTypeId = "";
        this.sectorId = "";
        this.taxOfficeId = "";
    }
    name: string;
    keyClient: boolean;
    taxNumber: string;
    logoFileId: string | null;
    termTime: number;
    isPassive: boolean;
    parentId: string;
    customerTypeId: string;
    sectorId: string;
    taxOfficeId: string;
}

export class AddCustomerRepresentativeCommand {
    constructor() {
        this.fullName = "";
        this.email = "";
        this.phoneNumber = "";
        this.position = "";
        this.customerId = "";
    }
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
    customerId: string;
}

export class AddCustomerRefferalCommand {
    constructor() {
        this.referenceCompany = "";
        this.referencePartner = "";
        this.phoneNumber = "";
        this.email = "";
        this.street = "";
        this.city = "";
        this.countryCode = "";
    }
    referenceCompany: string;
    referencePartner: string;
    phoneNumber: string;
    email: string;
    street: string;
    city: string;
    countryCode: string;
}

export class AddCustomerAddressCommand {
    constructor() {
        this.street = "";
        this.city = "";
        this.countryCode = ""
    }
    street: string;
    city: string;
    countryCode: string;
}
