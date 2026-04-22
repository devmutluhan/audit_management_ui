import { AccountTypeEnum, ContractTypeEnum, EducationLevel, EducationStatusTypeEnum, GenderEnum, LevelOfDisability, MaritalStatusTypeEnum, MilitaryServiceStatus } from "@/models/custom/EnumTypes";

export class CreateEmployeeCommand {
    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.workingEmail = null;
        this.officalStartDate = "";
        this.workPhoneNumber = "";
        this.identityNumber = "";
        this.sendWelcomeEmail = false;
    }

    firstName: string;
    lastName: string;
    email: string;
    workingEmail: string | null;
    officalStartDate: string;
    workPhoneNumber: string;
    identityNumber: string;
    sendWelcomeEmail: boolean;
}
export class UpdateEmployeeCommand {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.contractType = ContractTypeEnum.Definite;
        this.contractEndDate = "";
        this.avatarFileId = "";
    }
    id: string;
    firstName: string;
    lastName: string;
    contractType: ContractTypeEnum;
    contractEndDate: string;
    avatarFileId: string;
}

export class TerminateEmployeeCommand {
    constructor() {
        this.terminationReasonId = "";
        this.terminationDetails = "";
    }

    terminationReasonId: string;
    terminationDetails: string;
}

export class CreateEmployeeExperienceCommand {
    constructor() {
        this.companyBranchId = null;
        this.departmentId = null;
        this.defaultPositionId = null;
        this.positionIds = null;
        this.managerId = null;
        this.startDate = "";
        this.endDate = "";
        this.employmentType = 0;
    }

    companyBranchId: string | null;
    departmentId: string | null;
    defaultPositionId: string | null;
    positionIds: Array<string> | null;
    managerId: string | null;
    startDate: string;
    endDate: string;
    employmentType: number;
}

export class UpdateEmployeeExperienceCommand {
    constructor() {
        this.companyBranchId = null;
        this.departmentId = null;
        this.defaultPositionId = null;
        this.positionIds = null;
        this.managerId = null;
        this.employmentType = 0;
    }

    companyBranchId: string | null;
    departmentId: string | null;
    defaultPositionId: string | null;
    positionIds: Array<string> | null;
    managerId: string | null;
    employmentType: number;
}
export class CreateEmployeeSalariesCommand {
    constructor() {
        this.amount = null;
        this.currencyCode = "";
        this.effectiveOn = '';
        this.isGross = false;
        this.isMinimumWage = false;
        this.payPeriod = null;
    }
    amount: number | null;
    currencyCode: string;
    effectiveOn: string;
    isGross: boolean;
    isMinimumWage: boolean;
    payPeriod: number | null
}

export class UpdateEmployeeAddressCommand {
    constructor() {
        this.countryCode = ""
        this.street = ""
        this.city = ""
    }
    countryCode: string;
    street: string;
    city: string;
}

export class UpdateEmployeeBankDetailCommand {
    constructor() {
        this.bankName = ""
        this.accountType = AccountTypeEnum.Vadeli
        this.accountNumber = ""
        this.iban = ""
    }
    bankName: string;
    accountType: AccountTypeEnum;
    accountNumber: string;
    iban: string;
}

export class UpdateEmergencyPersonDetailCommand {
    constructor() {
        this.emergencyPersonFullName = ""
        this.emergencyPersonPhone = ""
        this.emergencyClosenessDegree = ""
    }
    emergencyPersonFullName: string;
    emergencyPersonPhone: string;
    emergencyClosenessDegree: string;
}
export class UpdateCitizenshipDetailCommand {
    constructor() {
        this.birthDate = ''
        this.identityNumber = ""
        this.gender = GenderEnum.Other
        this.levelOfDisability = LevelOfDisability.None
        this.nationality = ""
        this.militaryStatus = MilitaryServiceStatus.NotCompleted
        this.delayDate = ''
    }
    birthDate: string;
    identityNumber: string;
    gender: GenderEnum;
    levelOfDisability: LevelOfDisability
    nationality: string
    militaryStatus: MilitaryServiceStatus | null
    delayDate: string
}

export class UpdateEducationDetailCommand {
    constructor() {
        this.educationStatus = EducationStatusTypeEnum.Graduate
        this.educationLevel = EducationLevel.EducationNone
        this.educationalInstitution = ""
    }
    educationStatus: EducationStatusTypeEnum;
    educationLevel: EducationLevel;
    educationalInstitution: string;
}

export class UpdateMaritalDetailCommand {
    constructor() {
        this.maritalStatus = MaritalStatusTypeEnum.Divorced
        this.partnerWorkStatus = false
        this.numberOfChildren = 0
    }
    maritalStatus: MaritalStatusTypeEnum;
    partnerWorkStatus: boolean | null;
    numberOfChildren: number;
}

export class UpdateEmployeeCommunicationCommand {
    constructor() {
        this.workEmail = ""
        this.personalEmail = ""
        this.workPhone = ""
        this.mobilePhone = ""
    }
    workEmail: string;
    personalEmail: string;
    workPhone: string;
    mobilePhone: string
}

export class AddEmployeeDocumentsCommand {
    constructor() {
        this.employeeId = ""
        this.expirationDate = ""
        this.fileId = ""
        this.isPrivate = false
    }
    employeeId: string
    expirationDate: string
    isPrivate: boolean
    fileId: string
}
