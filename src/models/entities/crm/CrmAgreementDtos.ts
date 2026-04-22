import { LookupDto, LookupEmployeeDto } from "@/models/ApiResult"
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes"
import { OfferCustomer } from "./CrmOfferCommands"
import { CurrencyDto } from "../management/ManagementDtos"
import { AddressDto, RepresentativeDto } from "../customer/CustomerDtos"
import { RequestApprovalDto, type OfferItemDto } from "./CrmOfferDtos"

export class AgreementListDto {
    constructor() {
        this.id = ""
        this.agreementCode = ''
        this.title = ''
        this.subTotal = 0
        this.finalTotal = 0
        this.salesRepresentative = new LookupEmployeeDto()
        this.defaultCurrency = new CurrencyDto();
        this.status = ApprovementStatusEnum.Draft
        this.customer = new OfferCustomer()
    }
    id: string
    agreementCode: string
    title: string
    subTotal: number
    finalTotal: number
    defaultCurrency: CurrencyDto
    salesRepresentative: LookupEmployeeDto;
    status: ApprovementStatusEnum
    customer: OfferCustomer
}

export class AgreementDetailDto {
    constructor() {
        this.id = ""
        this.customer = new OfferCustomer()
        this.representative = new RepresentativeDto()
        this.address = new AddressDto()
        this.convertedOfferId = ""
        this.convertedProjectId = null
        this.salesRepresentative = new LookupEmployeeDto()
        this.agreementCode = ""
        this.title = ""
        this.startDate = ""
        this.endDate = ""
        this.agreementDocumentUrl = ""
        this.isExpenseIncluded = false
        this.defaultCurrency = new CurrencyDto()
        this.exchangeRateAgreement = 0
        this.description = ""
        this.items = new Array<OfferItemDto>()
        this.requestApproval = new RequestApprovalDto();
        this.manageAgreement = true
        this.expenseLimit = 0
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
    representative: RepresentativeDto | null;
    address: AddressDto | null
    convertedOfferId: string
    convertedProjectId: string | null
    agreementCode: string
    title: string
    salesRepresentative: LookupEmployeeDto
    agreementDocumentUrl: string
    requestApproval: RequestApprovalDto
    startDate: string
    endDate: string
    isExpenseIncluded: boolean
    defaultCurrency: CurrencyDto
    exchangeRateAgreement: number
    description: string
    items: Array<OfferItemDto>
    manageAgreement: boolean
    expenseLimit: number
    subTotal: number
    tevkifatAmount: number
    discountAmount: number
    discountRate: number
    finalTotal: number
    oivAmount: number
    vatAmount: number
    otvAmount: number
}

export class ApprovalStepDto {
    constructor() {
        this.approverEmployee = { avatarUrl: null, id: '', name: '' }
        this.order = 0
        this.replacedFor = ''
    }
    approverEmployee: {
        avatarUrl: string | null
        id: string
        name: string
    }
    order: number
    replacedFor: string
}

export class AgreementEmployeeDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.avatar = "";
        this.positionName = "";
        this.positionId = "";
    }

    id: string;
    firstName: string;
    lastName: string;
    avatar: string
    positionName: string
    positionId: string
}