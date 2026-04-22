import { LookupDto } from "@/models/ApiResult";

export class DocumentAuthorizationDto {
    constructor() {
        this.id = '';
        this.employee = new LookupDto();
        this.companyBranch = new LookupDto();
        this.managePotentialOpportunity = false
        this.manageOffer = false
        this.manageAgreement = false
        this.manageProject = false
        this.viewPotentialOpportunity = false
        this.viewOffer = false
        this.viewAgreement = false
        this.viewProject = false
    }
    id: string;
    companyBranch: LookupDto;
    employee: LookupDto;
    managePotentialOpportunity: boolean
    manageOffer: boolean
    manageAgreement: boolean
    manageProject: boolean
    viewPotentialOpportunity: boolean
    viewOffer: boolean
    viewAgreement: boolean
    viewProject: boolean
}