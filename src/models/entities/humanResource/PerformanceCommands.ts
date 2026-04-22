import { GoalTypeEnum, KeyResultMetricTypeEnum, RaterRelationTypeEnum } from "@/models/custom/EnumTypes";

export class CreatePeriodCommand {
    constructor() {
        this.title = ''
        this.startDate = new Date().toISOString().slice(0, 10);
        this.endDate = new Date().toISOString().slice(0, 10);
        this.goalSettingDueDate = '';
        this.evaluationStartDate = '';
    }
    title: string
    startDate: string
    endDate: string
    goalSettingDueDate: string
    evaluationStartDate: string
}

export class UpdatePeriodCommand {
    constructor() {
        this.title = ''
        this.startDate = new Date().toISOString().slice(0, 10);
        this.endDate = new Date().toISOString().slice(0, 10);
        this.goalSettingDueDate = '';
        this.evaluationStartDate = '';
    }
    title: string
    startDate: string
    endDate: string
    goalSettingDueDate: string
    evaluationStartDate: string
}


export class KeyResultCommand {
    constructor() {
        this.id = null
        this.description = ''
        this.metricType = KeyResultMetricTypeEnum.Count
        this.startValue = null
        this.targetValue = null
        this.contributionWeight = null
    }
    id: string | null
    description: string
    metricType: KeyResultMetricTypeEnum
    startValue: number | null
    targetValue: number | null
    contributionWeight: number | null
}

export class ObjectiveCommand {
    constructor() {
        this.id = null
        this.title = ''
        this.type = GoalTypeEnum.KPI
        this.defaultWeight = null
        this.kpiMinVal = null
        this.kpiMaxVal = null
        this.keyResults = []
    }
    id: string | null
    title: string
    type: GoalTypeEnum
    defaultWeight: number | null
    kpiMinVal: number | null
    kpiMaxVal: number | null
    keyResults: KeyResultCommand[]
}
export class MinMaxModel {
    constructor() {
        this.min = null
        this.max = null
    }
    min: number | null
    max: number | null
}

export class CompetencyItemCommand {
    constructor() {
        this.id = null
        this.name = ''
        this.description = ''
        this.minScore = null
        this.maxScore = null
    }
    id: string | null
    name: string
    description: string
    minScore: number | null
    maxScore: number | null
}

export class CompetencyGroupCommand {
    constructor() {
        this.id = null
        this.groupName = ''
        this.relationType = RaterRelationTypeEnum.Self
        this.competencies = []
    }
    id: string | null
    groupName: string
    relationType: RaterRelationTypeEnum
    competencies: CompetencyItemCommand[]
}

export class CreateCompetencyTemplateCommand {
    constructor() {
        this.templateName = ''
        this.description = ''
        this.groups = []
    }
    templateName: string
    description: string
    groups: CompetencyGroupCommand[]
}

export class UpdateCompetencyTemplateCommand {
    constructor() {
        this.templateName = ''
        this.description = ''
        this.groups = []
    }
    templateName: string
    description: string
    groups: CompetencyGroupCommand[]
}

export class RevieweeDto {
    constructor() {
        this.revieweeId = ''
        this.managerId = ''
    }
    revieweeId: string
    managerId: string
}

export class RevieweeRaterCommand {
    constructor() {
        this.revieweeId = ''
        this.raters = new Array<RaterCommandDto>()
    }
    revieweeId: string
    raters: Array<RaterCommandDto>
}

export class RaterCommandDto {
    constructor() {
        this.id = null
        this.raterId = ''
        this.relationType = RaterRelationTypeEnum.Self
    }
    id: string | null
    raterId: string
    relationType: RaterRelationTypeEnum
}

export class CompetencyWeightDefinitionCommand {
    constructor() {
        this.relationType = RaterRelationTypeEnum.Self
        this.weight = null
    }
    relationType: RaterRelationTypeEnum
    weight: number | null
}

export class CompetencySectionCommand {
    constructor() {
        this.title = ''
        this.description = ''
        this.weights = []
        this.groups = []
    }
    title: string
    description: string
    weights: CompetencyWeightDefinitionCommand[]
    groups: CompetencyGroupCommand[]
}

export class ReviewGoalKeyResultCommand {
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

export class ReviewGoalObjectiveCommand {
    constructor() {
        this.id = ''
        this.title = ''
        this.type = 0
        this.defaultWeight = 0
        this.kpiMinVal = 0
        this.kpiMaxVal = 0
        this.keyResults = []
    }
    id: string
    title: string
    type: number
    defaultWeight: number
    kpiMinVal: number
    kpiMaxVal: number
    keyResults: ReviewGoalKeyResultCommand[]
}

export class GoalSectionCommand {
    constructor() {
        this.sectionTitle = ''
        this.objectives = []
    }
    sectionTitle: string
    objectives: ReviewGoalObjectiveCommand[]
}

export class UpdateReviewWeightsCommand {
    constructor() {
        this.goalWeight = null
        this.competencyWeight = null
    }
    goalWeight: number | null
    competencyWeight: number | null
}

export class AssignRevieweesCommand {
    constructor() {
        this.templateId = ''
        this.reviewees = new Array<RevieweeDto>()
    }
    templateId: string
    reviewees: RevieweeDto[]
}

export class RemoveRevieweesCommand {
    constructor() {
        this.revieweeIds = []
    }
    revieweeIds: string[]
}

export class PeriodReviewCompetencySectionCommand {
    constructor() {
        this.reviewees = []
        this.competencySection = new CompetencySectionCommand()
    }
    reviewees: RevieweeRaterCommand[]
    competencySection: CompetencySectionCommand
}

export class UpdateReviewGoalSectionCommand {
    constructor() {
        this.goalSection = new GoalSectionCommand()
    }
    goalSection: GoalSectionCommand
}

export class CreateOrUpdateEvaluationTemplateCommand {
    constructor() {
        this.title = ""
        this.goalWeight = 0
        this.competencyWeight = 0
        this.hasGoal = false
        this.defaultGoalTitle = ""
        this.goalType = GoalTypeEnum.OKR
    }
    title: string
    goalWeight: number
    competencyWeight: number
    hasGoal: boolean
    defaultGoalTitle: string | null
    goalType: GoalTypeEnum | null
}

export class ChangeEvaluationTemplateStatusCommand {
    constructor() {
        this.isPassive = true
    }
    isPassive: boolean
}