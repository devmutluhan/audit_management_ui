import { WorkWeekDayEnum } from "@/models/custom/EnumTypes";
import { EmployeeDropdownListDto } from "../humanResource/EmployeeDtos";

export class CreateOrUpdateCompanyBranchCommand {
    constructor() {
        this.name = "";
        this.leaveApprovalProcessId = null;
        this.expenseApprovalProcessId = null;
        this.advanceApprovalProcessId = null;
        this.offerApprovalProcessId = null;
        this.riskApprovalProcess = null;
    }
    name: string;
    leaveApprovalProcessId: string | null;
    expenseApprovalProcessId: string | null;
    advanceApprovalProcessId: string | null;
    offerApprovalProcessId: string | null;
    riskApprovalProcess: RiskApprovalProcessCommand | null;
}

export class RiskApprovalProcessCommand {
    constructor() {
        this.lowApproverId = null;
        this.midApproverId = '';
        this.highApproverId = '';
    }
    lowApproverId: string | null
    midApproverId: string
    highApproverId: string
}

export class CreateOrUpdateDepartmentCommand {
    constructor() {
        this.name = "";
        this.leaveApprovalProcessId = null;
        this.advanceApprovalProcessId = null;
        this.expenseApprovalProcessId = null;
    }
    name: string;
    leaveApprovalProcessId: string | null;
    advanceApprovalProcessId: string | null;
    expenseApprovalProcessId: string | null;
}

export class UpdateWorkWeekPlanCommand {
    constructor() {
        this.id = "";
        this.name = "";
        this.description = "";
        this.fridayDoubleIfSingle = false;
        this.fridayDouble = false;
        this.workingDays = [];
    }
    id: string;
    name: string;
    description: string;
    fridayDoubleIfSingle: boolean;
    fridayDouble: boolean;
    workingDays: WorkingDay[];
}

export class WorkingDay {
    constructor() {
        this.dayOfWeek = WorkWeekDayEnum.Monday;
        this.lunchStart = "";
        this.lunchEnd = "";
        this.shiftStart = "";
        this.shiftEnd = "";
        this.isWorking = false
    }
    dayOfWeek: WorkWeekDayEnum;
    lunchStart: string;
    lunchEnd: string;
    shiftStart: string;
    shiftEnd: string;
    isWorking: boolean;
}

export class DepartmentDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.leaveApprovalProcessId = null;
        this.advanceApprovalProcessId = null;
        this.expenseApprovalProcessId = null;
    }
    id: string;
    name: string;
    leaveApprovalProcessId: string | null;
    advanceApprovalProcessId: string | null;
    expenseApprovalProcessId: string | null;
}

export class CompanyBranchDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.leaveApprovalProcessId = null;
        this.expenseApprovalProcessId = null;
        this.offerApprovalProcessId = null;
        this.riskApprovalProcess = null;
        this.advanceApprovalProcessId = null;
    }
    id: string;
    name: string;
    leaveApprovalProcessId: string | null;
    expenseApprovalProcessId: string | null;
    riskApprovalProcess: RiskApprovalProcessDto | null;
    offerApprovalProcessId: string | null;
    advanceApprovalProcessId: string | null;
}

export class RiskApprovalProcessDto {
    constructor() {
        this.lowApprover = new EmployeeDropdownListDto();
        this.midApprover = new EmployeeDropdownListDto();
        this.highApprover = new EmployeeDropdownListDto();
    }
    lowApprover: EmployeeDropdownListDto;
    midApprover: EmployeeDropdownListDto;
    highApprover: EmployeeDropdownListDto;
}
export class UpdateCompanySettingsCommand {
    constructor() {
        this.includeServiceConflict = false;
        this.includeCompanyRotation = false;
    }
    includeServiceConflict: boolean;
    includeCompanyRotation: boolean;
}