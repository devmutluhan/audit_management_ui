import { ApprovalEmployeeDto } from "./ApprovalProcessDtos";

export class CreateApprovalProcessCommand {
    constructor() {
        this.name = '';
        this.isPrivate = false;
        this.steps = [];
    }
    name: string;
    isPrivate: boolean;
    steps: ApprovalProcessStepDto[];
}

export class UpdateApprovalProcessCommand {
    constructor() {
        this.name = '';
        this.isPrivate = false;
        this.steps = [];
    }
    name: string;
    isPrivate: boolean;
    steps: ApprovalProcessStepDto[];
}

export class ApprovalProcessStepDto {
    constructor() {
        this.approverEmployeeId = '';
        this.order = 1;
        this.approverEmployee = new ApprovalEmployeeDto();
    }
    approverEmployee: ApprovalEmployeeDto | null;
    approverEmployeeId: string;
    order: number;
}