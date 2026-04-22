
export enum PlatformTypeEnum {
    Web,
    Mobile
}


export enum CustomerStatusEnum {
    Potantional = 0,
    Customer = 1,
    Employee = 2,
    Supplier = 4,
    SupplierCustomer = 5,
}

export enum GenderEnum {
    Male,
    Female,
    Other
}

export enum TaxTypeEnum {
    Kdv,
    Oiv,
    Otv,
    Tevkifat
}

export enum EmploymentTypeEnum {
    Fulltime,
    Parttime,
    Intern,
    Freelance,
    DailyType,
    Contracted,
    Mobile
}

export enum PayPeriodTypeEnum {
    Monthly,
    Daily,
    Yearly,
    Weekly,
    Hourly
}

export enum WorkWeekDayEnum {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 0,
}

export enum LevelOfDisability {
    None,
    FirstDegree,
    SecondDegree,
    ThirdDegree
}

export enum MilitaryServiceStatus {
    Completed,
    NotCompleted,
    Exempt,
    Delayed,
    DraftEvader,
}

export enum EducationLevel {
    EducationNone,
    Primary,
    Secondary,
    HighSchool,
    Associate,
    Bachelor,
    Master,
    Doctorate,
}

export enum ContractTypeEnum {
    Definite,
    Indefinite
}

export enum AccountTypeEnum {
    Vadeli,
    Vadesiz,
    Cek,
    Other
}

export enum MaritalStatusTypeEnum {
    Unspecified,
    Single,
    Married,
    Divorced
}

export enum EducationStatusTypeEnum {
    Student,
    Graduate
}

export enum EmployeeStatusTypeEnum {
    NoneEmployee,
    Invited,
    Valid,
    Locked
}

export enum InviteHistoryStatusEnum {
    Pending,
    Accepted,
    Canceled
}

export enum ApprovementStatusEnum {
    Draft = 0,
    Waiting = 1,
    Approved = 2,
    Rejected = 3,
    SendBack = 4,
    Cancelled = 5,
}

export enum FileCategoryEnum {
    PersonalFile, // Özlük dosyası
    ProfilePicture, // Profil fotoğrafı  
    Proposal, // Teklif dökümanı
    Contract, // Sözleşme
    Receipt, // Fiş/Fatura
    Other
}

export enum LimitationTypeEnum {
    LimitedToEvent = 0,
    LimitedToYear = 1,
    NotLimited = 2,
}

export enum OverdrawnTypeEnum {
    NoOverdrawn = 0,
    Unlimited = 1,
    Limited = 2
}

export enum CalculationTypeEnum {
    HourlyCalc,
    DailyCalc
}

export enum AccrualFrequencyType {
    Yearly,
    Monthly,
    Daily
}

export enum AccrualScheduleType {
    EndOfThePeriod,
    StartOfThePeriod
}

export enum AccrualStartDateType {
    FirstDayOfTheYear,
    CustomDate
}

export enum CarryoverLimitationType {
    UnlimitedCarryover,
    BalanceReset,
    LimitedBalance,
    LimitedCarryover,
    LimitedCarryoverWithDeadline
}

export enum HolidayTypeEnum {
    FullDay,
    MultipleDays,
    HalfDay,
}

export enum WeekStatusEnum {
    Open,
    Closed,
    ClosedBySystem,
    OpenByManager
}

export enum ReceiptApprovementStatusEnum {
    Created,
    Approved,
    Rejected
}


export enum TimesheetTypeEnum {
    Project,
    Marketing,
    WorkTravel,
    Training,
    Office,
    Meeting,
    Other
}


export enum TrainingStatusEnum {
    Skipped,
    PendingTraining,
    InProgress,
    CancelledTraining,
    NotAttended,
    ExemptTraining,
    CompletedTraining
}

export enum TimesheetOffType {
    PublicHoliday,
    NonWorkingDay,
    EmployeeLeave
}

export enum CustomerRiskLevel {
    Low,
    Mid,
    High
}
export enum RiskFormType {
    Devam,
    Kabul,
}

export enum NotificationStatusEnum {
    Pending,
    Sent,
    Failed,
    Read
}

export enum AssetStatusEnum {
    Available, //mevcut
    Assigned, //zimmetli
    Retired, // hurda
    Lost // kayıp
}

export enum NotificationTypeEnum {
    InApp = 1,
    Email = 2,
    SMS = 4,
    PushNotification = 8
}

export enum PeriodStatusType {
    /// <summary>
    /// Taslak aşaması. Personel atamaları yapılır, şablonlar seçilir.
    /// </summary>
    Planning = 0,

    /// <summary>
    /// Hedef girişleri açık. Çalışanlar hedef giriyor.
    /// </summary>
    GoalSetting = 10,

    /// <summary>
    /// Hedefler onaylandı/kilitlendi. Yıl içi takip yapılıyor.
    /// </summary>
    Active = 20,

    /// <summary>
    /// Yıl sonu puanlama başladı. Self ve Manager review açık.
    /// </summary>
    Evaluation = 30,

    /// <summary>
    /// İK süreci kapattı. Puanlar kesinleşti.
    /// </summary>
    Completed = 40
}


export enum PerformanceTemplateStatus {
    Draft,
    Active,
    Archived
}

export enum KeyResultMetricTypeEnum {
    Count,
    Percentage,
    Currency,
    Boolean,
    Rating
}

export enum GoalTypeEnum {
    OKR,
    KPI
}

export enum GoalStructureTypeEnum {
    // MIXED,
    OKR_HIERARCHY,
    SIMPLE_FLAT
}

export enum RaterRelationTypeEnum {
    Self = 1,
    Manager = 2,
    Subordinate = 4,
    Peer = 8,
    Other = 32
}

export enum ReviewStatusEnum {
    // --- FAZ 0: HAZIRLIK ---
    Draft = 0, // HR oluşturdu, ayar yapıyor.

    // --- FAZ 1: HEDEF BELİRLEME ---
    WaitingGoalSetting = 10, // Çalışan hedeflerini giriyor.
    WaitingGoalApproval = 20, // Çalışan gönderdi, yönetici onayı bekliyor.
    WaitingGoalRevision = 25, // Yönetici reddetti, düzeltme bekleniyor.

    // --- FAZ 2: DÖNEM İÇİ ---
    Active = 30, // Hedefler onaylandı, dönem içi takip (Progress girişi açık).

    // --- FAZ 3: YIL SONU DEĞERLENDİRME ---
    Evaluation = 40, // Dönem sonu puanlama (Self & Manager Score girişi).
    ManagerReview = 50, // Yönetici son kontrolü yapıyor (Nihai karar).

    // --- FAZ 4: KAPANIŞ ---
    HRReview = 60, // İK Kalibrasyonu.
    Finalized = 70 // Kapandı.
}

export enum SectionStatusEnum {
    // 1. Veri Girişi: Anketler açık, rater'lar puan giriyor.
    Active = 1,

    // 2. Bekleme: Tüm rater'lar submit etti. Sistem kilitli, HR'ın "Finalize" etmesi bekleniyor.
    // (Eski ManagerApproved yerine bunu kullanıyoruz)
    ReadyForReview = 2,

    // 3. Kilitli: HR finalize etti, snapshot alındı.
    Completed = 3
}