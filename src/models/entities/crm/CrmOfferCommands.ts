import type { CustomerRiskLevel } from "@/models/custom/EnumTypes";
import { AddressDto, RepresentativeDto } from "../customer/CustomerDtos";
import type { EmployeeDropdownListDto } from "../humanResource/EmployeeDtos";
import type { OfferItemDto } from "./CrmOfferDtos";
import type { AnswerCommandDto, RiskFormAnswersCommand } from "./CrmRiskFormModels";

export class CreateOfferCommand {
    constructor() {
        this.customerId = null;
        this.salesRepresentativeId = null;
        this.customerRepresentativeId = null;
        this.customerAddressId = null;
        this.documentDate = new Date().toISOString().slice(0, 10);
        this.termTime = null;
        this.currencyCode = "TRY";
        this.exchangeRateAgreement = 1;
        this.description = "";
        this.isExpenseIncluded = false;
        this.items = new Array<OfferItemCommand>();
        this.riskFormAnswers = null;
    }
    customerId: string | null
    documentDate: string
    termTime: number | null
    salesRepresentativeId: string | null
    isExpenseIncluded: boolean
    currencyCode: string
    exchangeRateAgreement: number
    description: string
    customerRepresentativeId: string | null
    customerAddressId: string | null
    items: Array<OfferItemCommand>
    riskFormAnswers: RiskFormAnswersCommand | null
}

export class UpdateOfferItemsCommand {
    constructor() {
        this.items = new Array<OfferItemCommand>();
    }
    items: Array<OfferItemCommand>
}

export class UpdateOfferInfoCommand {
    constructor() {
        this.salesRepresentativeId = null;
        this.customerRepresentativeId = null;
        this.customerAddressId = null;
        this.documentDate = new Date().toISOString().slice(0, 10);
        this.termTime = null;
        this.exchangeRateAgreement = 1;
        this.description = "";
        this.isExpenseIncluded = false;
    }
    documentDate: string
    termTime: number | null
    salesRepresentativeId: string | null
    isExpenseIncluded: boolean
    exchangeRateAgreement: number
    description: string
    customerRepresentativeId: string | null
    customerAddressId: string | null
}

export class OfferItemCommand {
    constructor() {
        this.id = null
        this.serviceGroupId = null
        this.serviceId = null
        this.positionId = null
        this.quantity = 1
        this.vatRate = null
        this.oivRate = null
        this.otvRate = null
        this.subTotal = null
        this.tevkifatFormula = null
    }
    id: string | null
    serviceGroupId: string | null
    serviceId: string | null
    positionId: string | null
    quantity: number;
    subTotal: number | null
    vatRate: number | null
    oivRate: number | null
    otvRate: number | null
    tevkifatFormula: string | null
}

export class CheckConflictCommand {
    constructor() {
        this.customerId = ''
        this.includeCompanyRotation = true
        this.selectedServiceIds = new Array<string>()
    }
    customerId: string
    includeCompanyRotation: boolean
    selectedServiceIds: Array<string>
}

export class CheckConflictResponse {
    constructor() {
        this.id = ""
        this.title = ""
        this.conflictList = new Array<{ id: "", title: "" }>()
        this.offerCodes = new Array<string>()
    }
    id: string
    title: string
    conflictList: Array<{ id: string, title: string }>
    offerCodes: Array<string>

}

// Custom Models
export class CreateOfferRequest {
    constructor() {
        this.id = ""
        this.documentStatus = 0
        this.customer = null;
        this.salesRepresentative = null;
        this.representative = new RepresentativeDto()
        this.address = new AddressDto()
        this.customerId = "";
        this.documentDate = new Date().toISOString().slice(0, 10);
        this.termTime = null;
        this.documentNumber = ""
        this.salesRepresentativeId = "";
        this.currencyCode = "TRY";
        this.exchangeRateAgreement = 1;
        this.description = "";
        this.customerRepresentativeId = null;
        this.isExpenseIncluded = false;
        this.customerAddressId = null;
        this.items = new Array<OfferItemDto>();
        this.riskFormAnswers = null;
        this.isRiskForm = true;
        this.questions = new Array<AnswerCommandDto>();
    }
    id: string
    documentNumber: string
    documentStatus: number
    representative: RepresentativeDto | null;
    address: AddressDto | null
    customer: OfferCustomer | null;
    salesRepresentative: EmployeeDropdownListDto | null
    customerId: string
    documentDate: string
    termTime: number | null
    salesRepresentativeId: string
    isExpenseIncluded: boolean
    currencyCode: string
    exchangeRateAgreement: number
    description: string
    customerRepresentativeId: string | null
    customerAddressId: string | null
    items: Array<OfferItemDto>
    isRiskForm: boolean
    riskFormAnswers: RiskFormAnswersCommand | null
    questions: Array<AnswerCommandDto>
}

export class OfferCustomer {
    constructor() {
        this.id = "";
        this.name = "";
        this.logoUrl = "";
        this.termTime = null;
    }

    id: string;
    name: string;
    logoUrl: string;
    termTime: number | null;
}

export class ApproveOfferCommand {
    constructor() {
        this.selectedRiskStatus = null;
    }
    selectedRiskStatus: CustomerRiskLevel | null
}