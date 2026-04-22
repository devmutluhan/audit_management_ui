import { LookupDto } from "@/models/ApiResult"
import { GoalTypeEnum, PeriodStatusType, RaterRelationTypeEnum, ReviewStatusEnum, SectionStatusEnum, PerformanceTemplateStatus } from "@/models/custom/EnumTypes"

export class PeriodDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.startDate = ''
        this.goalSettingDueDate = ''
        this.evaluationStartDate = ''
        this.endDate = ''
        this.status = PeriodStatusType.Planning
    }
    id: string
    title: string
    startDate: string
    goalSettingDueDate: string
    evaluationStartDate: string
    endDate: string
    status: PeriodStatusType
}


export class PeriodDetailDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.startDate = ''
        this.evaluationStartDate = ''
        this.goalSettingDueDate = ''
        this.endDate = ''
        this.status = PeriodStatusType.Active
    }
    id: string
    title: string
    startDate: string
    evaluationStartDate: string
    goalSettingDueDate: string
    endDate: string
    status: PeriodStatusType
}

export class ObjectiveDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.type = 0
        this.kpiMinScale = 0
        this.kpiMaxScale = 0
        this.defaultWeight = 0
        this.keyResults = []
    }
    id: string
    title: string
    kpiMinScale: number
    kpiMaxScale: number
    type: number
    defaultWeight: number
    keyResults: KeyResultDto[]
}

export class KeyResultDto {
    constructor() {
        this.id = ''
        this.description = ''
        this.metricType = 0
        this.startValue = 0
        this.targetValue = 0
        this.contributionWeight = 0
    }
    id: string
    description: string
    metricType: number
    startValue: number
    targetValue: number
    contributionWeight: number
}

export class CompetencyItemDto {
    constructor() {
        this.id = ''
        this.name = ''
        this.description = ''
        this.minScore = 0
        this.maxScore = 0
    }
    id: string
    name: string
    description: string
    minScore: number
    maxScore: number
}

export class CompetencyGroupDto {
    constructor() {
        this.id = ''
        this.groupName = ''
        this.weight = 0
        this.competencies = []
        this.relationType = RaterRelationTypeEnum.Self
    }
    id: string
    groupName: string
    weight: number
    relationType: RaterRelationTypeEnum
    competencies: CompetencyItemDto[]
}
export class CompetencyTemplateDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.description = ''
        this.status = PerformanceTemplateStatus.Active
        this.groups = []
    }
    id: string
    title: string
    description: string
    status: PerformanceTemplateStatus
    groups: CompetencyGroupDto[]
}
export class PeriodCompetencyTemplateDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.description = ''
        this.status = PerformanceTemplateStatus.Active
        this.groups = []
    }
    id: string
    title: string
    description: string
    status: PerformanceTemplateStatus
    groups: CompetencyGroupDto[]
}
export class CompetencyTemplateDropdownDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.status = PerformanceTemplateStatus.Active
    }
    id: string
    title: string
    status: PerformanceTemplateStatus
}

export class ReviewSummaryDto {
    constructor() {
        this.id = ""
        this.reviewee = new LookupDto()
        this.manager = new LookupDto()
        this.status = ReviewStatusEnum.Draft
        this.finalScore = 0
        this.finalizedDate = ""
        this.goalScoreWeight = 0
        this.competencyScoreWeight = 0
        this.goal = new GoalSummaryDto();
        this.competency = new CompetencySummaryDto();
    }
    id: string
    reviewee: LookupDto
    manager: LookupDto
    status: ReviewStatusEnum
    finalScore: number
    finalizedDate: string
    goalScoreWeight: number
    competencyScoreWeight: number
    goal: GoalSummaryDto | null
    competency: CompetencySummaryDto | null
}

export class GoalSummaryDto {
    constructor() {
        this.id = ""
        this.finalizedScore = 0
        this.isSubmitted = true
        this.status = SectionStatusEnum.Active
    }
    id: string
    finalizedScore: number
    isSubmitted: boolean
    status: SectionStatusEnum
}
export class CompetencySummaryDto {
    constructor() {
        this.id = ""
        this.title = ""
        this.finalizedScore = 0
        this.status = SectionStatusEnum.Active
        this.raters = new Array<RaterDto>()
    }
    id: string
    title: string
    finalizedScore: number
    status: SectionStatusEnum
    raters: Array<RaterDto>
}

export class RaterDto {
    constructor() {
        this.relationType = RaterRelationTypeEnum.Self
        this.isSubmitted = true
    }
    relationType: RaterRelationTypeEnum
    isSubmitted: boolean
}

export class EvaluationTemplateDto {
    constructor() {
        this.id = ""
        this.title = ""
        this.goalWeight = 0
        this.competencyWeight = 0
        this.hasGoal = true
        this.defaultGoalTitle = ""
        this.goalType = GoalTypeEnum.OKR
        this.isPassive = true
    }
    id: string
    title: string
    goalWeight: number
    competencyWeight: number
    hasGoal: boolean
    defaultGoalTitle: string | null
    goalType: GoalTypeEnum | null
    isPassive: boolean
}

export class GoalSectionForPeriodDto {
    constructor() {
        this.id = ""
        this.title = ""
        this.status = PerformanceTemplateStatus.Draft
        this.structureType = ''
        this.objectives = []
    }
    id: string
    title: string
    status: PerformanceTemplateStatus
    structureType: string
    objectives: ObjectiveDto[]
}