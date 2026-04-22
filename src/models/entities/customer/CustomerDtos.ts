import { LookupDto } from "@/models/ApiResult";

export class CustomerDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.keyClient = false;
        this.logoUrl = "";
        this.termTime = 0;
        this.isPassive = false;
        this.parent = "";
        this.customerType = "";
        this.sector = "";
    }

    id: string;
    name: string;
    keyClient: boolean;
    logoUrl: string;
    termTime: number;
    isPassive: boolean;
    parent: string;
    customerType: string;
    sector: string;
}

export class CustomerDetailDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.keyClient = false;
        this.taxNumber = "";
        this.logoUrl = "";
        this.termTime = 0;
        this.isPassive = false;
        this.parent = new LookupDto();
        this.taxOffice = new LookupDto();
        this.type = new LookupDto();
        this.sector = new LookupDto();
        this.referrals = [];
        this.addresses = [];
        this.representatives = [];
    }
    id: string;
    name: string;
    keyClient: boolean;
    taxNumber: string;
    logoUrl: string;
    termTime: number;
    isPassive: boolean;
    parent: LookupDto;
    taxOffice: LookupDto;
    type: LookupDto;
    sector: LookupDto;
    referrals: ReferralDto[];
    addresses: AddressDto[];
    representatives: RepresentativeDto[];
}

export class ReferralDto {
    constructor() {
        this.id = "";
        this.referenceCompany = "";
        this.referencePartner = "";
        this.phoneNumber = "";
        this.email = "";
        this.street = "";
        this.city = "";
        this.countryCode = "";
        this.countryName = "";
    }

    id: string;
    referenceCompany: string;
    referencePartner: string;
    phoneNumber: string;
    email: string;
    street: string;
    city: string;
    countryCode: string;
    countryName: string;
}

export class AddressDto {
    constructor() {
        this.id = "";
        this.street = "";
        this.city = "";
        this.countryCode = "";
        this.countryName = "";
    }
    id: string;
    street: string;
    city: string;
    countryCode: string;
    countryName: string;
}

export class RepresentativeDto {
    constructor() {
        this.id = "";
        this.fullName = "";
        this.email = "";
        this.phoneNumber = "";
        this.position = "";
    }
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    position: string;
}