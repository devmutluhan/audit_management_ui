import { TimesheetOffType, TimesheetTypeEnum } from "@/models/custom/EnumTypes"

export class CreateTimeSheetCommand {
    constructor() {
        this.startDate = ""
        this.endDate = ""
        this.projectId = null
        this.description = ""
        this.type = TimesheetTypeEnum.Other
    }
    startDate: string
    endDate: string
    projectId: string | null
    description: string
    type: TimesheetTypeEnum
}

export class UpdateTimeSheetCommand {
    constructor() {
        this.timeSheetId = ""
        this.startDate = ""
        this.endDate = ""
        this.description = ""
    }
    timeSheetId: string
    startDate: string
    endDate: string
    description: string
}

export class GetTimeSheetDto {
    constructor() {
        this.id = ""
        this.startDateOfWeek = ""
        this.endDateOfWeek = ""
        this.status = 0
        this.totalWorkingHours = 0
        this.enteredWorkingHours = 0
        this.remainingWorkingHours = 0
        this.totalOvertimeHours = 0
        this.timesheetDays = new Array<TimesheetDaysDto>()
    }
    id: string
    startDateOfWeek: string
    endDateOfWeek: string
    status: number
    totalWorkingHours: number
    enteredWorkingHours: number
    remainingWorkingHours: number
    totalOvertimeHours: number
    timesheetDays: Array<TimesheetDaysDto>
}

export class TimesheetDaysDto {
    constructor() {
        this.date = ""
        this.workStart = ""
        this.workEnd = ""
        this.lunchBreakStart = ""
        this.lunchBreakEnd = ""
        this.nonWorkingDays = new Array<NonWorkingDaysDto>()
        this.totalWorkingHours = 0
        this.timesheets = new Array<TimeSheetDto>()
    }
    date: string
    workStart: string
    workEnd: string
    lunchBreakStart: string
    lunchBreakEnd: string
    nonWorkingDays: Array<NonWorkingDaysDto>
    totalWorkingHours: number
    timesheets: Array<TimeSheetDto>
}

export class NonWorkingDaysDto {
    constructor() {
        this.date = ""
        this.start = ""
        this.end = ""
        this.dayType = TimesheetOffType.NonWorkingDay
        this.description = ""
    }
    date: string
    start: string
    end: string
    dayType: TimesheetOffType
    description: string
}

export class LunchBreakDto {
    constructor() {
        this.breakStart = ""
        this.breakEnd = ""
        this.workEnd = ""
        this.workStart = ""
        this.isWeekend = false
    }
    breakStart: string
    breakEnd: string
    workEnd: string
    workStart: string
    isWeekend: boolean
}

export class TimeSheetDto {
    constructor() {
        this.id = ""
        this.startDate = ""
        this.endDate = ""
        this.project = {}
        this.description = ""
        this.workHours = 0
        this.overtimeHours = 0
        this.sheetType = TimesheetTypeEnum.Other
    }
    id: string
    description: string
    workHours: number
    overtimeHours: number
    sheetType: TimesheetTypeEnum
    project: any
    startDate: string
    endDate: string
}

export class TimesheetEventDto {
    constructor() {
        this.start = ""
        this.end = ""
        this.title = ""
        this.className = ""
        this.itemValue = null
        this.timesheetOffType = null
        this.display = ""
    }
    start: string
    end: string
    title: string
    className: string
    itemValue: TimeSheetDto | null
    timesheetOffType: TimesheetOffType | null
    display: string
}