export class ConvertToAgreementCommand {
    constructor() {
        this.offerId = ''
        this.title = ''
        this.convertedServiceIds = new Array<string>()
        this.description = ''
        this.agreementDocumentFileId = null
        this.startDate = new Date().toISOString().slice(0, 10)
        this.endDate = new Date().toISOString().slice(0, 10)
        this.expenseLimit = null
    }
    offerId: string
    title: string
    convertedServiceIds: Array<string>
    description: string
    agreementDocumentFileId: string | null;
    startDate: string;
    endDate: string;
    expenseLimit: number | null;
}


export class UpdateAgreementInfoCommand {
    constructor() {
        this.title = ""
        this.startDate = new Date().toISOString().slice(0, 10);
        this.endDate = new Date().toISOString().slice(0, 10);
        this.description = "";
        this.agreementDocumentFileId = null;
        this.expenseLimit = null;
    }
    title: string
    startDate: string
    endDate: string
    description: string
    agreementDocumentFileId: string | null
    expenseLimit: number | null;
}

export class AddAgreementEmployeeCommand {
    constructor() {
        this.employeeId = ""
        this.positionId = ""
    }
    employeeId: string
    positionId: string
}