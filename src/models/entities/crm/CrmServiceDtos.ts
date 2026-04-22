import { LookupDto } from "@/models/ApiResult"
import { CurrencyDto } from "../management/ManagementDtos"
export class ServiceGroupDto {
    constructor() {
        this.id = ""
        this.title = ""
        this.companyBranch = new LookupDto()
        this.hasChild = false
        this.subItems = new Array<ServiceDto>()
    }
    id: string
    title: string
    companyBranch: LookupDto
    hasChild: boolean
    subItems: Array<ServiceDto>
}

export class ServiceDto {
    constructor() {
        this.id = ""
        this.title = ""
        this.serviceGroup = new LookupDto()
        this.hasChild = false
        this.inRotation = false
        this.subItems = new Array<LookupDto>()
    }
    id: string
    title: string
    serviceGroup: LookupDto
    inRotation: boolean
    subItems: Array<LookupDto>
    hasChild: boolean
}

export class PositionPriceDto {
    constructor() {
        this.id = ""
        this.position = new LookupDto()
        this.currency = new CurrencyDto();
        this.costPrice = 0
        this.sellPrice = 0
        this.validityDate = ""
        this.isValid = false
        this.isPassive = false
    }
    id: string
    position: LookupDto
    currency: CurrencyDto
    costPrice: number
    sellPrice: number
    validityDate: string
    isValid: boolean
    isPassive: boolean
}
export class PositionPricesDto {
    constructor() {
        this.positionId = "";
        this.positionName = "";
        this.currency = new CurrencyDto();
        this.costPrice = 0
        this.sellPrice = 0
        this.validityDate = ""
        this.isValid = false
        this.isPassive = false
    }
    positionId: string
    positionName: string
    currency: CurrencyDto
    costPrice: number
    sellPrice: number
    validityDate: string
    isValid: boolean
    isPassive: boolean
}

export class ConflictServiceDto {
    constructor() {
        this.serviceId = ""
        this.serviceName = ""
        this.serviceGroupId = ""
        this.serviceGroupName = ""
    }
    serviceId: string
    serviceName: string
    serviceGroupId: string
    serviceGroupName: string
}

export class PositionPriceHistoryDto {
    constructor() {
        this.costPrice = 0
        this.sellPrice = 0
        this.createdAt = ""
        this.createdByName = ""
    }
    sellPrice: number
    costPrice: number
    createdAt: string
    createdByName: string
}