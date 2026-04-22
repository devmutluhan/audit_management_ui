import { AccrualStartDateType } from "@/models/custom/EnumTypes";

export class CreateLeaveTypeCommand {
    constructor() {
        this.name = "";
        this.description = "";
        this.isEnabled = false;
        this.isPaid = false;
        this.shouldAffectSeniority = false;
        this.limitation = null;
        this.dayLimit = null;
        this.hasAgeException = false;
        this.ageExceptionMinimumDays = null;
        this.overdrawn = null;
        this.overdrawnLimit = null;
        this.accrualFrequency = null;
        this.accrualSchedule = null;
        this.accrualStartDate = AccrualStartDateType.CustomDate
        this.carryoverLimitation = null;
        this.carryoverLimitDays = null;
        this.carryoverLimitDeadLine = null;
        this.seniorities = [];
        this.leastDayCount = null;
        this.mostDayCount = null;
        this.calculationType = null;
        this.isMessageRequired = false;
        this.isSubstituteRequired = false;
        this.isOverriddenHolidays = false;
        this.isShownInCalendar = false;
        this.hasWaitingPeriod = false;
        this.waitingPeriod = null;
    }
    name: string
    description: string
    isEnabled: boolean
    isPaid: boolean
    shouldAffectSeniority: boolean
    limitation: number | null
    dayLimit: number | null
    hasAgeException: boolean
    ageExceptionMinimumDays: number | null
    overdrawn: number | null
    overdrawnLimit: number | null
    accrualFrequency: number | null
    accrualSchedule: number | null
    accrualStartDate: AccrualStartDateType
    carryoverLimitation: number | null
    carryoverLimitDays: number | null
    carryoverLimitDeadLine: number | null
    seniorities: SeniortyDto[]
    leastDayCount: number | null
    mostDayCount: number | null
    calculationType: number | null
    isMessageRequired: boolean
    isSubstituteRequired: boolean
    isOverriddenHolidays: boolean
    isShownInCalendar: boolean
    hasWaitingPeriod: boolean
    waitingPeriod: number | null
}

export class SeniortyDto {
    constructor() {
        this.year = null
        this.additionalDays = null
    }
    year: number | null
    additionalDays: number | null
}

export class UpdateLeaveTypeCommand extends CreateLeaveTypeCommand {
    constructor() {
        super();
        this.id = "";
    }
    id: string
}