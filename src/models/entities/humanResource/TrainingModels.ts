import { TrainingStatusEnum } from "@/models/custom/EnumTypes"

export class GetTrainingDto {
    constructor() {
        this.id = ""
        this.name = ""
        this.startDate = ""
        this.endDate = ""
        this.instructorName = ""
        this.instructorCompany = ""
        this.location = ""
        this.description = ""
    }
    id: string
    name: string
    startDate: string
    endDate: string
    instructorName: string
    instructorCompany: string
    location: string
    description: string
}

export class CreateOrUpdateTrainingCommand {
    constructor() {
        this.name = ""
        this.startDate = new Date().toISOString().slice(0, 10)
        this.endDate = new Date().toISOString().slice(0, 10)
        this.instructorName = ""
        this.instructorCompany = ""
        this.location = ""
        this.description = ""
    }
    name: string
    startDate: string
    endDate: string
    instructorName: string
    instructorCompany: string
    location: string
    description: string
}

export class TrainingAssignmentsDto {
    constructor() {
        this.id = ""
        this.employee = new TrainingEmployeeDto()
        this.trainingId = ""
        this.trainingName = ""
        this.status = 0
        this.completedDate = ""
        this.rating = 0
        this.description = ""
    }
    id: string
    employee: TrainingEmployeeDto
    trainingId: string
    trainingName: string
    status: number
    completedDate: string
    rating: number
    description: string
}

export class TrainingEmployeeDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.avatarUrl = "";
        this.fullName = "";
        this.positionName = "";
        this.workEmail = ""
    }

    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string
    fullName: string
    positionName: string
    workEmail: string
}

export class UpdateAssignmentsCommand {
    constructor() {
        this.assignments = new Array<UpdateAssignmentsCommandItem>()
    }
    assignments: Array<UpdateAssignmentsCommandItem>
}

export class UpdateAssignmentsCommandItem {
    constructor() {
        this.id = ""
        this.trainingStatus = TrainingStatusEnum.Skipped
        this.completedDate = ""
        this.rating = 0
        this.description = ""
    }
    id: string
    trainingStatus: TrainingStatusEnum
    completedDate: string
    rating: number
    description: string
}
export class CreateAssignmentsForEmployeesCommand {
    constructor() {
        this.employeeIds = new Array<string>()
    }
    employeeIds: Array<string>
}