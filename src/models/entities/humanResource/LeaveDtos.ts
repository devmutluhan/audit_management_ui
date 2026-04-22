import type { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import type { ApproverDto } from "../approvalProcess/ApprovalProcessDtos";
import type { ApprovalStepHistoryDto } from "../crm/CrmOfferDtos";

export class EmployeeLeaveListDto {
    constructor() {
        this.id = "";
        this.employeeId = "";
        this.startDate = "";
        this.endDate = "";
        this.returnDate = "";
        this.createdAt = "";
        this.updatedAt = "";
        this.status = 0;
        this.cancellationReason = "";
        this.replacementEmployeeId = "";
        this.replacementEmployee = new ReplacementEmployeeDto();
        this.employee = new ReplacementEmployeeDto();
        this.leaveType = new LeaveTypeDto();
        this.usedDays = 0;
    }

    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    returnDate: string;
    createdAt: string;
    updatedAt: string;
    status: ApprovementStatusEnum;
    cancellationReason: string;
    replacementEmployeeId: string;
    replacementEmployee: ReplacementEmployeeDto;
    employee: ReplacementEmployeeDto;
    leaveType: LeaveTypeDto;
    usedDays: number;
}

export class ReplacementEmployeeDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.fullName = "";
        this.positionName = "";
        this.avatarUrl = "";
        this.workEmail = "";
    }

    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    positionName: string;
    avatarUrl: string;
    workEmail: string;
}

export class LeaveBalanceDto {
    constructor() {
        this.accrualDate = "";
        this.workYear = new WorkYearDto();
        this.nextAccrualDate = "";
        this.unusedUnpaidLeaves = 0;
        this.unused = 0;
        this.currentAccrualPeriod = new AccrualPeriodDto();
        this.total = 0;
        this.used = 0;
        this.futureLeaves = 0;
        this.currentEarned = 0;
        this.currentUsed = 0;
        this.nextPeriodLeaves = 0;
        this.carriedOver = 0;
        this.lastCarriedOver = 0;
        this.loss = 0;
    }

    accrualDate: string;
    workYear: WorkYearDto;
    nextAccrualDate: string;
    unusedUnpaidLeaves: number;
    unused: number;
    currentAccrualPeriod: AccrualPeriodDto;
    total: number;
    used: number;
    futureLeaves: number;
    currentEarned: number;
    currentUsed: number;
    nextPeriodLeaves: number;
    carriedOver: number;
    lastCarriedOver: number;
    loss: number;
}

export class WorkYearDto {
    constructor() {
        this.years = 0;
        this.months = 0;
        this.days = 0;
        this.totalMonths = 0;
        this.normalizedValue = 0;
    }

    years: number;
    months: number;
    days: number;
    totalMonths: number;
    normalizedValue: number;
}

export class AccrualPeriodDto {
    constructor() {
        this.start = "";
        this.end = "";
    }

    start: string;
    end: string;
}
export class LeaveTypeDetailDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.isEnabled = true;
        this.isPrimary = true;
        this.isPaid = true;
        this.limitation = 0;
        this.dayLimit = 0;
        this.remainingLimit = 0;
        this.ageException = new AgeExceptionDto();
        this.overdrawn = 0;
        this.overdrawnLimit = 0;
        this.accrualFrequency = 0;
        this.accrualSchedule = 0;
        this.accrualStartDate = 0;
        this.carryoverLimitation = 0;
        this.carryoverLimit = new CarryoverLimitDto();
        this.seniority = [];
        this.calculationType = 0;
        this.leastDayCount = 0;
        this.mostDayCount = 0;
        this.waitingPeriod = new WaitingPeriodDto();
        this.shouldAffectSeniority = true;
        this.isMessageRequired = true;
        this.isSubstituteRequired = true;
        this.isOverriddenHolidays = true;
        this.isShownInCalendar = true;
    }

    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    isPrimary: boolean;
    isPaid: boolean;
    limitation: number;
    dayLimit: number;
    remainingLimit: number;
    ageException: AgeExceptionDto;
    overdrawn: number;
    overdrawnLimit: number;
    accrualFrequency: number;
    accrualSchedule: number;
    accrualStartDate: number;
    carryoverLimitation: number;
    carryoverLimit: CarryoverLimitDto;
    seniority: string[];
    calculationType: number;
    leastDayCount: number;
    mostDayCount: number;
    waitingPeriod: WaitingPeriodDto;
    shouldAffectSeniority: boolean;
    isMessageRequired: boolean;
    isSubstituteRequired: boolean;
    isOverriddenHolidays: boolean;
    isShownInCalendar: boolean;
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
export class LeaveDetailDto {
    constructor() {
        this.id = "";
        this.employeeId = "";
        this.startDate = "";
        this.endDate = "";
        this.description = "";
        this.returnDate = "";
        this.createdAt = "";
        this.updatedAt = "";
        this.status = 0;
        this.cancellationReason = "";
        this.replacementEmployeeId = "";
        this.replacementEmployee = new EmployeeLeaveDto();
        this.leaveType = new LeaveTypeDto();
        this.usedDays = 0;
    }

    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    description: string;
    returnDate: string;
    createdAt: string;
    updatedAt: string;
    status: number;
    cancellationReason: string;
    replacementEmployeeId: string;
    replacementEmployee: EmployeeLeaveDto;
    leaveType: LeaveTypeDto;
    usedDays: number;
}

export class LeaveTypeDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.dayLimit = 0;
    }

    id: string;
    name: string;
    dayLimit: number;
}

export class EmployeeLeaveDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.fullName = "";
        this.positionName = "";
        this.avatarUrl = "";
        this.workEmail = "";
    }

    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    positionName: string;
    avatarUrl: string;
    workEmail: string;
}
export class LeaveApprovalDetailDto {
    constructor() {
        this.employeeId = "";
        this.leaveTypeId = "";
        this.leaveTypeName = "";
        this.usedDays = 0;
        this.startDate = "";
        this.endDate = "";
        this.returnDate = "";
        this.createdAt = "";
        this.unused = 0;
        this.approvers = new Array<ApproverDto>;
        this.approvalHistories = new Array<ApprovalStepHistoryDto>;
    }

    employeeId: string;
    leaveTypeId: string;
    leaveTypeName: string;
    usedDays: number;
    startDate: string;
    endDate: string;
    returnDate: string;
    createdAt: string;
    unused: number;
    approvers: ApproverDto[];
    approvalHistories: ApprovalStepHistoryDto[];
}
export class CheckLeaveResponseDto {
    constructor() {
        this.errors = [];
        this.preview = new LeaveApprovalDetailDto();
    }

    errors: Array<any>;
    preview: LeaveApprovalDetailDto;
}
