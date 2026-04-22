export class ApprovalProcessDto {
    constructor() {
        this.id = '';
        this.name = '';
        this.isPrivate = false;
        this.approvers = [];
    }
    id: string;
    name: string;
    isPrivate: boolean;
    approvers: ApproverDto[];
}

export class ApproverDto {
    constructor() {
        this.approver = new ApprovalEmployeeDto();
        this.order = 0;
        this.replacedFor = new ApprovalEmployeeDto();
    }
    approver: ApprovalEmployeeDto;
    order: number;
    replacedFor: ApprovalEmployeeDto;
}

export class ApprovalEmployeeDto {
    constructor() {
        this.id = '';
        this.avatarUrl = '';
        this.workEmail = '';
        this.firstName = '';
        this.lastName = '';
        this.fullName = '';
        this.positionName = ''
    }
    id: string;
    avatarUrl: string;
    workEmail: string;
    firstName: string;
    lastName: string;
    fullName: string;
    positionName: string;
}