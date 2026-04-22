import { AccrualStartDateType, LimitationTypeEnum } from "@/models/custom/EnumTypes";

export class GetLeavePolicyDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.leaveTypes = [];
        this.leaveTypeCount = 0;
    }
    id: string;
    name: string;
    description: string;
    leaveTypes: LeaveTypeDto[];
    leaveTypeCount: number;
}

export class LeaveTypeDto {
    constructor() {
        this.id = "";
        this.leavePolicyId = "";
        this.name = "";
        this.isEnabled = false;
        this.isPrimary = false;
        this.isPaid = false;
        this.limitation = 0;
        this.dayLimit = 0;
        this.leastDayCount = 0;
        this.mostDayCount = 0;
        this.accrualFrequency = 0;
    }

    id: string;
    leavePolicyId: string;
    name: string;
    isEnabled: boolean;
    isPrimary: boolean;
    isPaid: boolean;
    limitation: number;
    dayLimit: number;
    leastDayCount: number;
    mostDayCount: number;
    accrualFrequency: number;
}

export class LeaveTypeDetailDto {
    constructor() {
        this.id = "";
        this.leavePolicyId = "";
        this.isPrimary = false;
        this.name = "";
        this.description = "";
        this.isEnabled = false;
        this.isPaid = false;
        this.limitation = LimitationTypeEnum.NotLimited;
        this.dayLimit = 0;
        this.remainingLimit = 0;
        this.ageException = new AgeExceptionDto();
        this.overdrawn = 0;
        this.overdrawnLimit = 0;
        this.accrualFrequency = 0;
        this.accrualSchedule = 0;
        this.accrualStartDate = AccrualStartDateType.CustomDate;
        this.carryoverLimitation = 0;
        this.carryoverLimit = new CarryoverLimitDto();
        this.seniority = [];
        this.calculationType = 0;
        this.leastDayCount = 0;
        this.mostDayCount = 0;
        this.waitingPeriod = new WaitingPeriodDto();
        this.shouldAffectSeniority = false;
        this.isMessageRequired = false;
        this.isSubstituteRequired = false;
        this.isOverriddenHolidays = false;
    }
    id: string;
    leavePolicyId: string;
    name: string;
    description: string;
    isEnabled: boolean;
    isPrimary: boolean;
    isPaid: boolean;
    limitation: LimitationTypeEnum;
    dayLimit: number;
    remainingLimit: number;
    ageException: AgeExceptionDto;
    overdrawn: number;
    overdrawnLimit: number;
    accrualFrequency: number; // in days
    accrualSchedule: number; // in days
    accrualStartDate: AccrualStartDateType; // in days
    carryoverLimitation: number; // in days
    carryoverLimit: CarryoverLimitDto; // in days
    seniority: SeniortyDto[];
    calculationType: number; // in days
    leastDayCount: number; // in days
    mostDayCount: number; // in days
    waitingPeriod: WaitingPeriodDto; // in days
    shouldAffectSeniority: boolean; // in days
    isMessageRequired: boolean; // in days
    isSubstituteRequired: boolean; // in days
    isOverriddenHolidays: boolean; // in days
}

export class SeniortyDto {
    constructor() {
        this.year = 0
        this.additionalDays = 0
    }
    year: number
    additionalDays: number
}
export class AgeExceptionDto {
    constructor() {
        this.status = false;
        this.minimumDays = 0;
    }
    status: boolean;
    minimumDays: number;
}

export class CarryoverLimitDto {
    constructor() {
        this.days = 0;
        this.deadline = 0;
    }
    days: number;
    deadline: number;
}

export class WaitingPeriodDto {
    constructor() {
        this.status = false;
        this.months = 0;
    }
    status: boolean;
    months: number;
}

