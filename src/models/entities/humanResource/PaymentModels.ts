import { ApprovementStatusEnum } from "@/models/custom/EnumTypes"
import { RequestApprovalDto } from "../crm/CrmOfferDtos"
import { ExpenseEmployeeDto } from "./ExpenseDtos";

export class AdvanceListDto {
    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.isPaid = false;
        this.amount = 0
        this.currency = ""
        this.createdAt = "";
        this.startsAt = "";
        this.creator = new ExpenseEmployeeDto();
        this.updatedAt = "";
        this.approvementStatus = ApprovementStatusEnum.Draft;
    }

    id: string;
    employee: ExpenseEmployeeDto;
    isPaid: boolean;
    amount: number;
    currency: string
    createdAt: string;
    startsAt: string;
    creator: ExpenseEmployeeDto;
    updatedAt: string;
    approvementStatus: ApprovementStatusEnum
}

export class AdvanceApprovalRequestListDto {
    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.isPaid = false;
        this.description = "";
        this.createdAt = "";
        this.startsAt = "";
        this.amount = 0;
        this.currency = "";
        this.status = ApprovementStatusEnum.Draft
    }

    id: string;
    employee: ExpenseEmployeeDto;
    isPaid: boolean;
    description: string;
    createdAt: string;
    startsAt: string;
    amount: number;
    currency: string;
    status: ApprovementStatusEnum
}

export class AdvanceDetailDto {
    id: string;
    employee: ExpenseEmployeeDto;
    description: string;
    isPaid: boolean;
    createdAt: string;
    amount: number;
    currency: string;
    startsAt: string;
    updatedAt: string | null;
    creator: ExpenseEmployeeDto;
    requestApproval: RequestApprovalDto;

    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.description = "";
        this.isPaid = false;
        this.createdAt = "";
        this.amount = 0;
        this.currency = "";
        this.startsAt = "";
        this.updatedAt = null;
        this.creator = new ExpenseEmployeeDto();
        this.requestApproval = new RequestApprovalDto();
    }
}


export class CreateAdvanceCommand {
    constructor() {
        this.employeeId = "";
        this.description = "";
        this.approve = false;
        this.notifyUser = false;
        this.isPaid = false;
        this.amount = null
        this.currencyCode = "";
        this.startsAt = "";
    }

    employeeId: string;
    description: string;
    approve: boolean;
    notifyUser: boolean;
    isPaid: boolean;
    amount: number | null
    startsAt: string
    currencyCode: string
}

export class UpdateAdvanceCommand {
    constructor() {
        this.description = "";
        this.isPaid = false
        this.amount = null
        this.currencyCode = "";
        this.startsAt = "";
    }
    description: string;
    isPaid: boolean
    amount: number | null
    startsAt: string
    currencyCode: string
}
