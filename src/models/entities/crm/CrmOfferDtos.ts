import { LookupEmployeeDto, type LookupDto } from "@/models/ApiResult"
import { AddressDto, RepresentativeDto } from "../customer/CustomerDtos";
import { EmployeeDropdownListDto } from "../humanResource/EmployeeDtos";
import { CurrencyDto } from "../management/ManagementDtos";
import { OfferCustomer } from "./CrmOfferCommands";
import { ApprovementStatusEnum, CustomerRiskLevel } from "@/models/custom/EnumTypes";
import { ApprovalEmployeeDto } from "../approvalProcess/ApprovalProcessDtos";

export class OfferListDto {
    constructor() {
        this.id = ""
        this.customer = new OfferCustomer();
        this.salesRepresentative = new EmployeeDropdownListDto();
        this.convertedServiceStatus = ""
        this.offerCode = "";
        this.documentDate = "";
        this.expirationDate = "";
        this.isRiskApprover = false
        this.riskStatus = CustomerRiskLevel.Low
        this.termTime = "";
        this.status = ApprovementStatusEnum.Draft
        this.finalTotal = 0
        this.subTotal = 0
        this.defaultCurrency = new CurrencyDto()
    }
    id: string
    customer: OfferCustomer
    convertedServiceStatus: string
    termTime: string
    salesRepresentative: EmployeeDropdownListDto;
    expirationDate: string
    offerCode: string
    isRiskApprover: boolean
    riskStatus: CustomerRiskLevel
    status: ApprovementStatusEnum
    documentDate: string
    defaultCurrency: CurrencyDto
    finalTotal: number
    subTotal: number
}

export class OfferDetailDto {
    constructor() {
        this.id = ""
        this.customer = new OfferCustomer()
        this.representative = new RepresentativeDto()
        this.address = new AddressDto()
        this.salesRepresentative = new LookupEmployeeDto()
        this.documentDate = ""
        this.offerCode = ""
        this.termTime = 0
        this.expirationDate = ""
        this.hasRiskLevel = false
        this.isExpenseIncluded = false
        this.defaultCurrency = new CurrencyDto()
        this.exchangeRateAgreement = 0
        this.description = ""
        this.items = new Array<OfferItemDto>()
        this.requestApproval = new RequestApprovalDto();
        this.manageOffer = true
        this.subTotal = 0
        this.tevkifatAmount = 0
        this.discountAmount = 0
        this.discountRate = 0
        this.finalTotal = 0
        this.oivAmount = 0
        this.vatAmount = 0
        this.otvAmount = 0
    }
    id: string
    customer: OfferCustomer
    hasRiskLevel: boolean
    representative: RepresentativeDto | null;
    address: AddressDto | null
    salesRepresentative: LookupEmployeeDto
    offerCode: string
    expirationDate: string
    requestApproval: RequestApprovalDto
    documentDate: string
    termTime: number | null
    isExpenseIncluded: boolean
    defaultCurrency: CurrencyDto
    exchangeRateAgreement: number
    description: string
    items: Array<OfferItemDto>
    manageOffer: boolean
    subTotal: number
    tevkifatAmount: number
    discountAmount: number
    discountRate: number
    finalTotal: number
    oivAmount: number
    vatAmount: number
    otvAmount: number
}

export class RequestApprovalDto {
    constructor() {
        this.approvalStepHistories = new Array<ApprovalStepHistoryDto>()
        this.approvalSteps = new Array<ApprovalStepDto>()
        this.cancellationMessage = ""
        this.lastActionDate = ""
        this.rejectionMessage = ""
        this.status = ApprovementStatusEnum.Draft
        this.riskApprovalSteps = null
    }
    cancellationMessage: string
    approvalStepHistories: Array<ApprovalStepHistoryDto>
    rejectionMessage: string
    lastActionDate: string
    approvalSteps: Array<ApprovalStepDto>
    status: ApprovementStatusEnum
    riskApprovalSteps: RiskApprovalStepDto | null
}

export class RiskApprovalStepDto {
    constructor() {
        this.step = CustomerRiskLevel.Low
        this.lowApprover = new ApprovalEmployeeDto();
        this.midApprover = new ApprovalEmployeeDto();
        this.highApprover = new ApprovalEmployeeDto();
    }
    step: CustomerRiskLevel
    lowApprover: ApprovalEmployeeDto
    midApprover: ApprovalEmployeeDto
    highApprover: ApprovalEmployeeDto
}

export class ApprovalStepHistoryDto {
    constructor() {
        this.order = 0
        this.employee = new ApprovalEmployeeDto()
        this.approverRiskLevel = null
        this.selectedRiskStatus = null
        this.actionDate = ""
        this.status = ApprovementStatusEnum.Draft
        this.reason = null
    }
    order: number
    employee: ApprovalEmployeeDto
    actionDate: string
    status: ApprovementStatusEnum
    reason: string | null
    approverRiskLevel: CustomerRiskLevel | null
    selectedRiskStatus: CustomerRiskLevel | null
}
export class ApprovalStepDto {
    constructor() {
        this.approver = new ApprovalEmployeeDto();
        this.order = 0
        this.replacedFor = new ApprovalEmployeeDto();
    }
    approver: ApprovalEmployeeDto
    order: number
    replacedFor: ApprovalEmployeeDto | null
}

export class OfferItemDto {
    constructor() {
        this.id = null
        this.serviceGroup = new OfferItemLookupDto()
        this.service = new OfferItemLookupDto()
        this.position = null
        this.quantity = 1
        this.unitPriceExclTax = null
        this.convertedAgreementId = null
        this.vatRate = null
        this.oivRate = null
        this.otvRate = null
        this.subTotal = null
        this.discountRate = null
        this.tevkifatFormula = null
    }
    id: string | null
    serviceGroup: OfferItemLookupDto
    service: OfferItemLookupDto
    position: LookupDto | null
    quantity: number;
    convertedAgreementId: string | null
    unitPriceExclTax: number | null
    subTotal: number | null
    vatRate: number | null
    oivRate: number | null
    otvRate: number | null
    discountRate: number | null
    tevkifatFormula: string | null
}

export class OfferItemLookupDto {
    constructor() {
        this.id = ""
        this.title = ""
    }
    id: string
    title: string
}