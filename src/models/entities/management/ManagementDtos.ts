import type { EmployeeDropdownListDto, EmployeeRelatedProjects } from "../humanResource/EmployeeDtos";
import type { LeaveTypeDto } from "../humanResource/LeaveDtos";

export class WorkWeekPlanDto {
    constructor() {
        this.id = '';
        this.name = '';
        this.description = '';
        this.fridayDouble = false;
        this.fridayDoubleIfSingle = false;
        this.workingDayDetails = [];
    }
    id: string;
    name: string;
    description: string;
    fridayDouble: boolean;
    fridayDoubleIfSingle: boolean;
    workingDayDetails: WorkingDayDetail[];
}

export class WorkingDayDetail {
    constructor() {
        this.id = '';
        this.dayOfWeek = 0;
        this.dayName = '';
        this.lunchStart = '';
        this.lunchEnd = '';
        this.shiftStart = '';
        this.shiftEnd = '';
        this.isWorking = false
    }
    id: string;
    dayOfWeek: number;
    dayName: string;
    lunchStart: string;
    lunchEnd: string;
    shiftStart: string;
    shiftEnd: string;
    isWorking: boolean;
}

export class CurrencyDto {
    constructor() {
        this.symbol = ""
        this.code = ""
    }
    symbol: string
    code: string
}

export class TenantModulesDto {
    constructor() {
        this.id = ""
        this.tenantName = ""
        this.modules = new Array<ModuleDto>()
    }
    id: string
    tenantName: string
    modules: Array<ModuleDto>
}

export class ModuleClaimsDto {
    constructor() {
        this.moduleId = 0
        this.moduleName = ""
        this.claimId = 0
        this.claimName = ""
    }
    moduleId: number
    moduleName: string
    claimId: number
    claimName: string
}

export class ModuleDto {
    constructor() {
        this.id = 0
        this.name = ""
        this.claims = new Array<ClaimDto>()
    }
    id: number
    name: string
    claims: Array<ClaimDto>
}

export class ClaimDto {
    constructor() {
        this.id = 0;
        this.name = "";
    }

    id: number;
    name: string;
}

export class DashboardItemsDto {
    constructor() {
        this.upcomingBirthdays = new Array<UpcomingBirthdayDto>();
        this.leaveApprovals = new Array<LeaveApprovalRequestDto>();
        this.myLeaveRequests = new Array<LeaveApprovalRequestDto>();
        this.myExpenseRequests = new Array<ExpenseApprovalRequestDto>();
        this.advanceApprovals = new Array<AdvanceApprovalRequestDto>();
        this.myAdvanceRequests = new Array<AdvanceApprovalRequestDto>();
        this.expenseApprovals = new Array<ExpenseApprovalRequestDto>();
        this.publicHolidays = new Array<DashboardPublicHolidayDto>();
        this.myRelatedProjects = new Array<EmployeeRelatedProjects>();
    }
    upcomingBirthdays: Array<UpcomingBirthdayDto>
    leaveApprovals: Array<LeaveApprovalRequestDto>
    myLeaveRequests: Array<LeaveApprovalRequestDto>
    expenseApprovals: Array<ExpenseApprovalRequestDto>
    myExpenseRequests: Array<ExpenseApprovalRequestDto>
    advanceApprovals: Array<AdvanceApprovalRequestDto>
    myAdvanceRequests: Array<AdvanceApprovalRequestDto>
    publicHolidays: Array<DashboardPublicHolidayDto>
    myRelatedProjects: Array<EmployeeRelatedProjects>
}

export class UpcomingBirthdayDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.avatarUrl = "";
        this.position = "";
        this.birthDate = '';
        this.leftDay = 0;
    }
    id: string
    firstName: string
    lastName: string
    avatarUrl: string
    position: string
    birthDate: string
    leftDay: number
}

export class LeaveApprovalRequestDto {
    constructor() {
        this.id = "";
        this.employeeId = "";
        this.leaveTypeId = "";
        this.employee = null;
        this.startDate = new Date();
        this.endDate = new Date();
        this.usedDays = 0;
        this.leaveType = null;
        this.approvementStatus = 0;
        this.leftDay = 0;
    }
    id: string
    employeeId: string | null
    leaveTypeId: string | null
    employee: EmployeeDropdownListDto | null
    startDate: Date
    endDate: Date
    usedDays: number
    leaveType: LeaveTypeDto | null
    approvementStatus: number
    leftDay: number
}

export class ExpenseApprovalRequestDto {
    constructor() {
        this.id = "";
        this.employeeId = "";
        this.employee = null;
        this.createdAt = new Date();
        this.isPaid = false;
        this.approvementStatus = 0;
        this.totalAmount = 0;
        this.currency = "";
    }
    id: string
    employeeId: string | null
    employee: EmployeeDropdownListDto | null
    createdAt: Date
    isPaid: boolean
    approvementStatus: number
    totalAmount: number
    currency: string | null
}

export class AdvanceApprovalRequestDto {
    constructor() {
        this.id = "";
        this.employeeId = "";
        this.employee = null;
        this.createdAt = new Date();
        this.isPaid = false;
        this.approvementStatus = 0;
        this.amount = 0;
        this.currency = "";
    }
    id: string
    employeeId: string | null
    employee: EmployeeDropdownListDto | null
    createdAt: Date
    isPaid: boolean
    approvementStatus: number
    amount: number
    currency: string | null
}

export class DashboardPublicHolidayDto {
    constructor() {
        this.id = "";
        this.startDate = "";
        this.endDate = "";
        this.description = "";
        this.name = "";
    }
    id: string
    startDate: string
    endDate: string
    description: string | null
    name: string | null
}

export class CompanySettingsDto {
    constructor() {
        this.id = "";
        this.tenantId = "";
        this.domainEvents = new Array<any>();
        this.includeServiceConflict = false;
        this.includeCompanyRotation = false;
    }
    id: string
    tenantId: string
    domainEvents: Array<any>
    includeServiceConflict: boolean
    includeCompanyRotation: boolean
}