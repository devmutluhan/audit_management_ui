import { CustomerRiskLevel, RiskFormType } from "@/models/custom/EnumTypes"

export class RiskFormAnswersCommand {
    constructor() {
        this.riskFormId = ''
        this.customerRiskStatus = null
        this.answers = new Array<AnswerQuestionCommand>()
    }
    riskFormId: string
    customerRiskStatus: CustomerRiskLevel | null
    answers: Array<AnswerQuestionCommand>
}
export class AnswerCommandDto {
    constructor() {
        this.id = ""
        this.question = ""
        this.documentPaths = []
        this.optionValues = new Array<DetailOptionValueDto>()
        this.answerText = ""
        this.value = null
    }
    id: string
    question: string
    documentPaths: Array<string>
    optionValues: Array<DetailOptionValueDto>
    answerText: string
    value: number | null
}

export class AnswerQuestionCommand {
    constructor() {
        this.questionId = ""
        this.documentPaths = []
        this.answerText = ""
        this.value = null
    }
    questionId: string
    documentPaths: Array<any>
    answerText: string
    value: number | null
}

export class CreateRiskFormCommand {
    constructor() {
        this.title = ""
        this.description = ""
        this.riskFormType = RiskFormType.Devam
        this.questions = new Array<QuestionCommand>()
    }
    title: string
    description: string
    riskFormType: RiskFormType
    questions: Array<QuestionCommand>
}
export class UpdateRiskFormCommand extends CreateRiskFormCommand {
    constructor() {
        super()
        this.id = ""
    }
    id: string
}

export class QuestionCommand {
    constructor() {
        this.question = ""
        this.optionValues = []
    }
    question: string
    optionValues: string[]
}

export class RiskFormDto {
    constructor() {
        this.riskFormType = RiskFormType.Devam
        this.versions = new Array<RiskFormVersionDto>()
    }
    riskFormType: RiskFormType
    versions: Array<RiskFormVersionDto>
}

export class RiskFormVersionDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.version = 0
    }
    id: string
    title: string
    version: number
}

export class RiskFormDetailDto {
    constructor() {
        this.id = ''
        this.title = ''
        this.description = ''
        this.riskFormType = RiskFormType.Devam
        this.questions = new Array<DetailQuestionDto>()
    }
    id: string
    title: string
    description: string
    riskFormType: RiskFormType
    questions: Array<DetailQuestionDto>
}

export class DetailQuestionDto {
    constructor() {
        this.id = ''
        this.order = 0
        this.question = ''
        this.optionValues = []
    }
    id: string
    order: number
    question: string
    optionValues: DetailOptionValueDto[]
}

export class DetailOptionValueDto {
    constructor() {
        this.value = 0
        this.option = ''
    }
    value: number
    option: string
}

export class OfferRiskAnswersDto {
    constructor() {
        this.id = ""
        this.customerRiskForm = new RiskFormDetailDto()
        this.customerRiskStatus = CustomerRiskLevel.Low
        this.riskFormAnswers = new Array<AnswerQuestionCommand>()
    }
    id: string
    customerRiskForm: RiskFormDetailDto
    customerRiskStatus: CustomerRiskLevel
    riskFormAnswers: Array<AnswerQuestionCommand>
}