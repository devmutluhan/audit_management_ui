import {
    filterClaimPages, CustomerPages, GeneralDefinitionPages,
    HrEmployeePages, HrPaymentPages, HrTrainingPages, HrVacationPages, PollPages, HrAssetPages,
    CrmPages, CrmOfferPages, CrmDefinitionPages, CrmProjectPages, CrmAgreementPages,
    AssetPages,
    PerformancePages
} from "./moduleAndClaimUtils"

export const ClaimsEnum: { [char: string]: string[] } = {
    ManageCustomer: CustomerPages.concat(CrmPages),
    ViewCustomer: filterClaimPages(CustomerPages, ['create', 'definition']),
    ManageEmployee: HrEmployeePages, // Personel ekranları
    ManageLeave: HrVacationPages, // Personel detayı > izin işlemleri + İzinler
    ManagePayment: HrPaymentPages, // Personel detayı > ödemeler + Avans
    ManageAsset: HrAssetPages.concat(AssetPages), // Personel detayı zimmetler + Zimmetler
    ManageTraining: HrTrainingPages, // Personel detayı eğitimler + Eğitimler
    ManagePoll: PollPages, // Anketler
    ManagePerformance: PerformancePages, // Performans
    ManageApprovementCard: ['approvement-card-definition'],
    ViewCrmOffer: filterClaimPages(CrmOfferPages, ['create']),
    ManageCrmOffer: CrmOfferPages, // Teklif ekranları
    ManageCrmAgreement: CrmAgreementPages, // Sözleşme ekranları
    ManageCrmProject: CrmProjectPages, // Proje ekranları
    ManageCrmSettings: CrmDefinitionPages, // Tanımlama ve Hizmet ekranları
    ManageCompanySettings: filterClaimPages(GeneralDefinitionPages, []), // 'approvement', 'claim'
    ManageEmployeeSystemUsage: ['user-claim-definition', 'claim-card-definition'],
    RequestLeave: ['profile-vacation'],
    RequestPayment: ['profile-expense', 'profile-advance'],
    RequestTraining: ['profile-training'],
    ViewAsset: ['profile-assets', 'personel-assets']
}

export const ModulesEnum: { [char: string]: string[] } = {
    Customer: [],
    HREmployeeManagement: [],
    HRPerformanceManagement: [],
    HRLeave: [],
    HRPayment: [],
    HRTraining: [],
    Asset: [],
    CRM: [],
    CompanyManagement: []
}