import { ApprovementStatusEnum, ReceiptApprovementStatusEnum } from "@/models/custom/EnumTypes"
import { RequestApprovalDto } from "../crm/CrmOfferDtos"

export class ExpenseEmployeeDto {
    constructor() {
        this.id = ""
        this.firstName = ""
        this.lastName = ""
        this.fullName = ""
        this.positionName = ""
        this.avatarUrl = ""
        this.workEmail = ""
    }
    id: string
    firstName: string
    lastName: string
    fullName: string
    positionName: string
    avatarUrl: string
    workEmail: string

}

export class ExpenseListDto {
    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.isPaid = false;
        this.createdAt = "";
        this.creator = new ExpenseEmployeeDto();
        this.updatedAt = "";
        this.approvementStatus = ApprovementStatusEnum.Draft;
        this.receipts = [];
    }

    id: string;
    employee: ExpenseEmployeeDto;
    isPaid: boolean;
    createdAt: string;
    creator: ExpenseEmployeeDto;
    updatedAt: string;
    approvementStatus: ApprovementStatusEnum
    receipts: ExpenseReceiptDto[];
}

export class ExpenseApprovalRequestList {
    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.isPaid = false;
        this.description = "";
        this.creator = new ExpenseEmployeeDto();
        this.createdAt = "";
        this.status = ApprovementStatusEnum.Draft
        this.receipts = [];
    }

    id: string;
    employee: ExpenseEmployeeDto;
    isPaid: boolean;
    description: string;
    createdAt: string;
    creator: ExpenseEmployeeDto;
    status: ApprovementStatusEnum;
    receipts: ExpenseReceiptApprovalRequestDto[];
}
export class ExpenseReceiptApprovalRequestDto {
    constructor() {
        this.id = "";
        this.amount = 0;
        this.currency = "";
        this.vatRate = 0;
        this.description = "";
        this.date = "";
        this.fileUrl = "";
        this.approvementStatus = ReceiptApprovementStatusEnum.Created;
        this.category = "";
    }

    id: string;
    amount: number;
    currency: string;
    vatRate: number;
    description: string;
    date: string;
    fileUrl: string
    approvementStatus: ReceiptApprovementStatusEnum;
    category: string
}

export class ExpenseReceiptDto {
    constructor() {
        this.id = "";
        this.amount = 0;
        this.currency = "";
        this.vatRate = 0;
        this.categoryTitle = "";
        this.date = "";
    }

    id: string;
    amount: number;
    currency: string;
    vatRate: number;
    categoryTitle: string;
    date: string;
}
export class ExpenseCategoryDto {
    id: string;
    title: string;
    description: string;
    isDefault: boolean;
    isEnabled: boolean;

    constructor() {
        this.id = "";
        this.title = "";
        this.description = "";
        this.isDefault = false;
        this.isEnabled = true;
    }
}

export class ExpenseReceiptDetailDto {
    id: string;
    amount: number;
    currency: string;
    vatRate: number;
    description: string;
    date: string;
    fileUrl: string;
    fileId: string;
    approvementStatus: ReceiptApprovementStatusEnum;
    category: ExpenseCategoryDto;
    createdAt: string;
    updatedAt: string | null;

    constructor() {
        this.id = "";
        this.amount = 0;
        this.currency = "";
        this.vatRate = 0;
        this.description = "";
        this.date = "";
        this.fileUrl = "";
        this.fileId = "";
        this.approvementStatus = ReceiptApprovementStatusEnum.Created;
        this.category = new ExpenseCategoryDto();
        this.createdAt = "";
        this.updatedAt = null;
    }
}

export class ExpenseDetailDto {
    id: string;
    employee: ExpenseEmployeeDto;
    description: string;
    isPaid: boolean;
    createdAt: string;
    updatedAt: string | null;
    creator: ExpenseEmployeeDto;
    requestApproval: RequestApprovalDto;
    receipts: ExpenseReceiptDetailDto[];

    constructor() {
        this.id = "";
        this.employee = new ExpenseEmployeeDto();
        this.description = "";
        this.isPaid = false;
        this.createdAt = "";
        this.updatedAt = null;
        this.creator = new ExpenseEmployeeDto();
        this.requestApproval = new RequestApprovalDto();
        this.receipts = [];
    }
}
