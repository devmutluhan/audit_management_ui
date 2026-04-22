export class CreateServiceGroupCommand {
    constructor() {
        this.title = ""
        this.companyBranchId = ""
        this.services = []
    }
    title: string
    companyBranchId: string
    services: Array<{
        title: string
        inRotation: boolean
        positionIds: Array<string>
    }>
}

export class CreateServiceCommand {
    constructor() {
        this.title = ""
        this.inRotation = false
    }
    title: string
    inRotation: boolean
}

export class CreatePositionPriceCommand {
    constructor() {
        this.positionId = ""
        this.prices = new Array<PositionPriceCommand>()
    }
    positionId: string
    prices: Array<PositionPriceCommand>
}

export class CreatePositionForService {
    constructor() {
        this.serviceId = null
        this.positionIds = new Array<string>()
    }
    serviceId: string | null
    positionIds: Array<string>
}

export class PositionPriceCommand {
    constructor() {
        this.currencyCode = ""
        this.costPrice = null
        this.sellPrice = null
        this.validityDate = null
    }
    currencyCode: string
    costPrice: number | null
    sellPrice: number | null
    validityDate: string | null
}
export class UpdatePositionPriceCommand {
    constructor() {
        this.currencyCode = ""
        this.costPrice = null
        this.sellPrice = null
        this.validityDate = ""
        this.isPassive = false
    }
    currencyCode: string
    costPrice: number | null
    sellPrice: number | null
    validityDate: string
    isPassive: boolean
}

export class CreateConflictCommand {
    constructor() {
        this.serviceId = "";
        this.conflictedServiceGroupIds = new Array<string>()
    }
    serviceId: string
    conflictedServiceGroupIds: Array<string>
}