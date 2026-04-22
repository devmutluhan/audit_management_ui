export class CreateDocumentAuthorizationCommand {
    constructor() {
        this.companyBranchId = "";
        this.employeeIds = [];
        this.managePotentialOpportunity = false;
        this.manageOffer = false;
        this.manageAgreement = false;
        this.manageProject = false;
        this.viewPotentialOpportunity = false;
        this.viewOffer = false;
        this.viewAgreement = false;
        this.viewProject = false;
    }
    companyBranchId: string;
    employeeIds: Array<string>
    managePotentialOpportunity: boolean;
    manageOffer: boolean;
    manageAgreement: boolean;
    manageProject: boolean;
    viewPotentialOpportunity: boolean;
    viewOffer: boolean;
    viewAgreement: boolean;
    viewProject: boolean;
}

export class UpdateDocumentAuthorization {
    constructor() {
        this.managePotentialOpportunity = false;
        this.manageOffer = false;
        this.manageAgreement = false;
        this.manageProject = false;
        this.viewPotentialOpportunity = false;
        this.viewOffer = false;
        this.viewAgreement = false;
        this.viewProject = false;
    }
    managePotentialOpportunity: boolean;
    manageOffer: boolean;
    manageAgreement: boolean;
    manageProject: boolean;
    viewPotentialOpportunity: boolean;
    viewOffer: boolean;
    viewAgreement: boolean;
    viewProject: boolean;
}
