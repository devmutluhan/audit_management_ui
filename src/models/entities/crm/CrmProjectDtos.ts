import { LookupDto, LookupEmployeeDto } from "@/models/ApiResult"
import { CurrencyDto } from "../management/ManagementDtos"
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes"
import { OfferCustomer } from "./CrmOfferCommands"
import { AddressDto, RepresentativeDto } from "../customer/CustomerDtos"
import { OfferItemDto, RequestApprovalDto } from "./CrmOfferDtos"

export class ProjectListDto {
    constructor() {
        this.id = ""
        this.projectCode = ''
        this.title = ''
        this.subTotal = 0
        this.finalTotal = 0
        this.salesRepresentative = new LookupEmployeeDto()
        this.manager = new LookupEmployeeDto()
        this.partner = new LookupEmployeeDto()
        this.defaultCurrency = new CurrencyDto();
        this.status = ApprovementStatusEnum.Draft
        this.customer = new OfferCustomer()
    }
    id: string
    projectCode: string
    title: string
    subTotal: number
    finalTotal: number
    defaultCurrency: CurrencyDto
    salesRepresentative: LookupEmployeeDto;
    manager: LookupEmployeeDto;
    partner: LookupEmployeeDto;
    status: ApprovementStatusEnum
    customer: OfferCustomer
}

export class ProjectDetailDto {
    constructor() {
        this.id = ""
        this.customer = new OfferCustomer()
        this.representative = new RepresentativeDto()
        this.address = new AddressDto()
        this.convertedOfferId = ""
        this.convertedAgreementId = null
        this.salesRepresentative = new LookupEmployeeDto()
        this.manager = new LookupEmployeeDto()
        this.partner = new LookupEmployeeDto()
        this.agreementCode = ""
        this.title = ""
        this.actualStartDate = ""
        this.actualEndDate = ""
        this.agreementDocumentUrl = ""
        this.isExpenseIncluded = false
        this.defaultCurrency = new CurrencyDto()
        this.exchangeRateAgreement = 0
        this.description = ""
        this.items = new Array<OfferItemDto>()
        this.requestApproval = new RequestApprovalDto();
        this.manageProject = true
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
    convertedAgreementId: string | null
    agreementCode: string
    title: string
    salesRepresentative: LookupEmployeeDto
    manager: LookupEmployeeDto
    partner: LookupEmployeeDto
    agreementDocumentUrl: string
    requestApproval: RequestApprovalDto
    actualStartDate: string
    actualEndDate: string
    isExpenseIncluded: boolean
    defaultCurrency: CurrencyDto
    exchangeRateAgreement: number
    description: string
    items: Array<OfferItemDto>
    manageProject: boolean
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

export class ProjectCostSummaryDto {
    constructor() {
        this.employee = new ProjectEmployeeDto()
        this.position = new LookupDto()
        this.durationInHours = 0
        this.costAmount = 0
        this.sellAmount = 0
        this.currency = ""
    }
    employee: ProjectEmployeeDto
    position: LookupDto
    durationInHours: number
    costAmount: number
    sellAmount: number
    currency: string
}

export class ProjectEmployeeDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.avatarUrl = "";
        this.positionName = "";
        this.positionId = "";
        this.isPassive = false;
    }

    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string
    positionName: string
    positionId: string
    isPassive: boolean
}