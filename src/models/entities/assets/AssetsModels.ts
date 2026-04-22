import { AssetStatusEnum } from "@/models/custom/EnumTypes"

export class AssetsForEmployeeDto {
    constructor() {
        this.assignDate = ""
        this.returnDate = ""
        this.note = ""
        this.id = ""
        this.categoryName = ""
        this.serialNumber = ""
        this.brand = ""
        this.model = ""
    }
    id: string
    categoryName: string
    serialNumber: string
    brand: string
    model: string
    assignDate: string
    returnDate: string
    note: string
}

export class AssetsDto {
    constructor() {
        this.id = ""
        this.assetCategoryId = ""
        this.assetCategoryName = ""
        this.serialNumber = ""
        this.description = ""
        this.brand = ""
        this.model = ""
        this.status = AssetStatusEnum.Available
    }
    id: string
    assetCategoryId: string
    assetCategoryName: string
    description: string
    serialNumber: string
    brand: string
    model: string
    status: AssetStatusEnum
}

export class CreateOrUpdateAssetsCommand {
    constructor() {
        this.assetCategoryId = ""
        this.description = ""
        this.serialNumber = ""
        this.brand = ""
        this.model = ""
        this.status = AssetStatusEnum.Available
    }
    assetCategoryId: string
    description: string
    serialNumber: string
    brand: string
    model: string
    status: AssetStatusEnum
}

export class AssignAssetCommand {
    constructor() {
        this.employeeId = ""
        this.assignDate = new Date().toISOString().slice(0, 10);
        this.note = ""
    }
    employeeId: string
    assignDate: string
    note: string
}
export class ReturnAssetCommand {
    constructor() {
        this.returnDate = new Date().toISOString().slice(0, 10);
    }
    returnDate: string
}