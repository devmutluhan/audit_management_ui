import { LookupDto, LookupDtoForEmployee } from "@/models/ApiResult";
import { AccountTypeEnum, ContractTypeEnum, EmployeeStatusTypeEnum, EmploymentTypeEnum, GenderEnum, LevelOfDisability, MilitaryServiceStatus } from "@/models/custom/EnumTypes";
import type { CountryDto } from "../general/GeneralDtos";
import type { RequestApprovalDto } from "../crm/CrmOfferDtos";

export class EmployeeListDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.managerId = "";
        this.managerName = "";
        this.email = "";
        this.workEmail = "";
        this.isVisible = false;
        this.avatarUrl = "";
        this.mobilePhone = "";
        this.workPhone = "";
        this.todayLeaveDayCount = 0;
        this.position = "";
        this.department = "";
    }

    id: string;
    managerId: string;
    managerName: string;
    firstName: string;
    lastName: string;
    email: string;
    workEmail: string;
    isVisible: boolean;
    avatarUrl: string;
    department: string;
    position: string;
    mobilePhone: string;
    workPhone: string;
    todayLeaveDayCount: number;
}
export class EmployeeDropdownListDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.avatarUrl = "";
        this.workEmail = "";
        this.position = "";
        this.isTerminated = false;
        this.positions = new Array<PositionDto>();
        this.appUserState = 0;
    }

    id: string;
    firstName: string;
    lastName: string;
    workEmail: string;
    isTerminated: boolean;
    avatarUrl: string;
    appUserState: number;
    positions: Array<PositionDto>
    position: string;
}

export class EmployeeDetailDto {
    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.fullName = "";
        this.avatarUrl = "";
        this.avatarFileId = "";
        this.birthDate = null;
        this.identityNumber = "";
        this.appUserState = 0;
        this.maritalStatus = 0;
        this.gender = GenderEnum.Other;
        this.levelOfDisability = LevelOfDisability.None;
        this.educationStatus = 0;
        this.educationLevel = 0;
        this.educationalInstitution = "";
        this.nationality = null;
        this.numberOfChildren = 0;
        this.partnerWorkStatus = false;
        this.militaryStatus = MilitaryServiceStatus.NotCompleted;
        this.militaryDelayDate = null;
        this.workEmail = "";
        this.personalEmail = "";
        this.workPhone = "";
        this.mobilePhone = "";
        this.employmentStartDate = "";
        this.contractEndDate = "";
        this.contractType = ContractTypeEnum.Definite
        this.currentExperience = new CurrentExperienceDto();
        this.country = null;
        this.city = null;
        this.street = null;
        this.accountNumber = ""
        this.accountType = AccountTypeEnum.Other
        this.bankName = ""
        this.iban = ""
        this.emergencyClosenessDegree = ""
        this.emergencyPersonFullName = ""
        this.emergencyPersonPhone = ""
        this.personalOccupancyRate = 0
    }

    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatarUrl: string;
    avatarFileId: string;
    birthDate: string | null;
    identityNumber: string;
    maritalStatus: number;
    gender: GenderEnum;
    appUserState: EmployeeStatusTypeEnum;
    levelOfDisability: LevelOfDisability;
    educationStatus: number;
    educationLevel: number;
    educationalInstitution: string;
    nationality: CountryDto | null;
    numberOfChildren: number;
    partnerWorkStatus: boolean | null;
    militaryStatus: MilitaryServiceStatus | null;
    militaryDelayDate: string | null;
    workEmail: string
    personalEmail: string
    workPhone: string
    mobilePhone: string
    employmentStartDate: string
    contractEndDate: string
    contractType: ContractTypeEnum
    currentExperience: CurrentExperienceDto
    country: CountryDto | null
    city: string | null
    street: string | null
    accountType: AccountTypeEnum
    bankName: string
    accountNumber: string
    iban: string
    emergencyClosenessDegree: string
    emergencyPersonFullName: string
    emergencyPersonPhone: string
    personalOccupancyRate: number
}

export class CurrentExperienceDto {
    constructor() {
        this.position = ""
        this.positionStartDate = ""
        this.department = ""
        this.employmentType = EmploymentTypeEnum.Fulltime
        this.manager = new LookupDtoForEmployee();
    }
    position: string
    department: string
    positionStartDate: string
    employmentType: EmploymentTypeEnum
    manager: LookupDtoForEmployee
}

export class PositionDto {
    constructor() {
        this.id = ""
        this.isDefault = false;
        this.name = ""
    }
    id: string;
    isDefault: boolean;
    name: string
}

export class EmployeeExperienceDto {
    constructor() {
        this.id = "";
        this.employee = new LookupDto();
        this.manager = new LookupDtoForEmployee();
        this.isScheduledDefault = false;
        this.isDefault = false;
        this.companyBranch = new LookupDto();
        this.department = new LookupDto();
        this.positions = new Array<PositionDto>();
        this.employmentType = 0;
        this.startDate = "";
        this.endDate = "";
    }

    id: string;
    employee: LookupDto;
    manager: LookupDtoForEmployee;
    isScheduledDefault: boolean;
    isDefault: boolean;
    startDate: string;
    endDate: string;
    companyBranch: LookupDto;
    department: LookupDto;
    positions?: Array<PositionDto>;
    employmentType: number;
}

export class EmployeeSalaryDto {
    constructor() {
        this.id = "";
        this.amount = 0;
        this.currency = "";
        this.payPeriod = 0;
        this.isGross = false;
        this.employeeId = "";
        this.effectiveOn = "";
        this.isMinimumWage = false;
        this.createdAt = "";
    }

    id: string;
    amount: number;
    currency: string;
    payPeriod: number;
    isGross: boolean;
    employeeId: string;
    effectiveOn: string;
    isMinimumWage: boolean;
    createdAt: string;
}

export class TerminationReasonDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.value = "";
        this.isSystemDefault = false;
    }

    id: string;
    name: string;
    value: string;
    isSystemDefault: boolean;
}

export class EmployeeRelatedProjects {
    constructor() {
        this.id = ""
        this.title = ""
        this.customer = {
            id: '',
            name: ''
        }
    }
    id: string
    title: string
    customer: {
        id: string,
        name: string
    }
}
export class EmployeeDocumentsDto {
    constructor() {
        this.categoryName = ""
        this.documents = new Array<DocumentsDto>()
    }
    categoryName: string
    documents: Array<DocumentsDto>
}

export class DocumentsDto {
    constructor() {
        this.definitionId = ""
        this.documentName = ""
        this.isRequired = false
        this.isUploaded = false
        this.isMissing = false
        this.isExpired = false
        this.employeeDocumentId = ""
        this.fileUrl = null
        this.expirationDate = ""
        this.requestApproval = null
    }
    definitionId: string
    documentName: string
    isRequired: boolean
    isUploaded: boolean
    isMissing: boolean
    isExpired: boolean
    employeeDocumentId: string
    fileUrl: string | null
    expirationDate: string
    requestApproval: RequestApprovalDto | null
}