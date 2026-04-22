
export class CreateExpenseCommand {
    constructor() {
        this.employeeId = "";
        this.description = "";
        this.approve = false;
        this.notifyUser = false;
        this.isPaid = false;
        this.receipts = [];
    }

    employeeId: string;
    description: string;
    approve: boolean;
    notifyUser: boolean;
    isPaid: boolean;
    receipts: ExpenseReceiptCommand[];
}

export class ExpenseReceiptCommand {
    constructor() {
        this.expenseCategoryId = "";
        this.amount = null;
        this.vatRate = null;
        this.description = "";
        this.currencyCode = "TRY";
        this.date = "";
        this.fileId = null;
    }

    expenseCategoryId: string;
    amount: number | null;
    vatRate: number | null;
    description: string;
    currencyCode: string | null;
    date: string;
    fileId: string | null
}

export class UpdateExpenseCommand {
    constructor() {
        this.description = "";
        this.receipts = [];
    }
    description: string;
    receipts: ExpenseReceiptUpdateCommand[];
}

export class ExpenseReceiptUpdateCommand {
    constructor() {
        this.id = "";
        this.expenseCategoryId = "";
        this.amount = 0;
        this.vatRate = 0;
        this.description = "";
        this.date = ""
        this.fileId = null;
    }
    id: string;
    expenseCategoryId: string;
    amount: number;
    vatRate: number;
    description: string;
    date: string;
    fileId: string | null
}


export class CreateExpenseCategoryCommand {
    constructor() {
        this.title = "";
        this.description = "";
    }
    title: string;
    description: string
}
export class UpdateExpenseCategoryCommand {
    constructor() {
        this.id = "";
        this.title = "";
        this.description = "";
        this.isDefault = false;
        this.isEnabled = false;
    }
    title: string;
    description: string;
    id: string;
    isDefault: boolean
    isEnabled: boolean
}
export class ExpenseCategoryDto {
    constructor() {
        this.id = "";
        this.title = "";
        this.description = "";
        this.isDefault = false;
        this.isEnabled = false;
    }
    title: string;
    description: string;
    id: string;
    isDefault: boolean
    isEnabled: boolean
}