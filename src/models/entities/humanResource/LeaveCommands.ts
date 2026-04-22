export class CreateLeaveRequestCommand {
    constructor() {
        this.employeeId = null;
        this.leaveTypeId = null;
        this.startDate = "";
        this.endDate = "";
        this.usedDays = 0;
        this.description = "";
        this.replacementEmployeeId = null;
        this.skipApprovementProcess = false;
        this.sendNotification = false;
        this.returnDate = ""
    }

    employeeId: string | null;
    leaveTypeId: string | null;
    startDate: string;
    endDate: string;
    usedDays: number;
    description: string;
    replacementEmployeeId: string | null;
    skipApprovementProcess: boolean;
    sendNotification: boolean;
    returnDate: string
}

export class CheckLeaveRequestCommand {
    constructor() {
        this.employeeId = null;
        this.leaveTypeId = null;
        this.startDate = "";
        this.endDate = "";
        this.description = "";
        this.replacementEmployeeId = null;
    }

    employeeId: string | null;
    leaveTypeId: string | null;
    startDate: string;
    endDate: string;
    description: string;
    replacementEmployeeId: string | null;
}

export class UpdateLeaveRequestCommand {
    constructor() {
        this.leaveTypeId = null;
        this.startDate = "";
        this.endDate = "";
        this.usedDays = 0;
        this.description = "";
        this.replacementEmployeeId = null;
        this.skipApprovementProcess = false;
    }

    leaveTypeId: string | null;
    startDate: string;
    endDate: string;
    usedDays: number;
    description: string;
    replacementEmployeeId: string | null;
    skipApprovementProcess: boolean;
}

export class CombineDatesModel {
    constructor() {
        this.startDate = ""
        this.endDate = ""
        this.endTime = ""
        this.startTime = ""
        this.returnDate = ""
        this.returnTime = ""
    }
    startDate: string
    endDate: string
    endTime: string
    startTime: string
    returnTime: string
    returnDate: string
}