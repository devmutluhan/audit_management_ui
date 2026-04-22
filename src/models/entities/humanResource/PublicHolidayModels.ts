import { HolidayTypeEnum } from "@/models/custom/EnumTypes"

export class PublicHolidayListDto {
    constructor() {
        this.id = ""
        this.name = ""
        this.description = ""
        this.publicHolidays = new Array<PublicHolidayDto>()
    }
    id: string
    name: string
    description: string
    publicHolidays: Array<PublicHolidayDto>
}

export class PublicHolidayDto {
    constructor() {
        this.id = ""
        this.startDate = ""
        this.endDate = ""
        this.description = ""
        this.isDeduct = true
        this.isRecurring = true
        this.name = ""
        this.holidayType = HolidayTypeEnum.FullDay
    }
    id: string
    startDate: string
    endDate: string
    description: string
    isDeduct: boolean
    isRecurring: boolean
    name: string
    holidayType: HolidayTypeEnum
}

export class CreatePublicHolidayCommand {
    constructor() {
        this.startDate = new Date().toISOString().slice(0, 10)
        this.endDate = new Date().toISOString().slice(0, 10)
        this.description = ""
        this.isDeduct = true
        this.isRecurring = true
        this.name = ""
        this.holidayType = HolidayTypeEnum.FullDay
    }
    startDate: string
    endDate: string
    description: string
    isDeduct: boolean
    isRecurring: boolean
    name: string
    holidayType: HolidayTypeEnum
}

export class UpdatePublicHolidayCommand {
    constructor() {
        this.id = ""
        this.startDate = new Date().toISOString().slice(0, 10)
        this.endDate = new Date().toISOString().slice(0, 10)
        this.description = ""
        this.isDeduct = true
        this.isRecurring = true
        this.name = ""
        this.holidayType = HolidayTypeEnum.FullDay
    }
    id: string
    startDate: string
    endDate: string
    description: string
    isDeduct: boolean
    isRecurring: boolean
    name: string
    holidayType: HolidayTypeEnum
}