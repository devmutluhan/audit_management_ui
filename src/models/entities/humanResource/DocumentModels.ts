export class CreateDocumentCategoryCommand {
    constructor() {
        this.name = ''
        this.description = ''
    }
    name: string
    description: string
}

export class DocumentCategoryDto {
    constructor() {
        this.id = ''
        this.name = ''
        this.description = ''
        this.isActive = false
    }
    id: string
    name: string
    description: string
    isActive: boolean
}

export class UpdateDocumentCategoryCommand {
    constructor() {
        this.name = ''
        this.description = ''
        this.isActive = false
    }
    name: string
    description: string
    isActive: boolean
}

export class CreateDocumentDefinitionCommand {
    constructor() {
        this.name = ''
        this.isRequired = false
        this.hasExpiration = false
    }
    name: string
    isRequired: boolean
    hasExpiration: boolean
}

export class DocumentDefinitionDto {
    constructor() {
        this.id = ''
        this.name = ''
        this.isRequired = false
        this.hasExpiration = false
        this.categoryId = ''
    }
    id: string
    name: string
    isRequired: boolean
    hasExpiration: boolean
    categoryId: string
}

export class UpdateDocumentDefinitionCommand {
    constructor() {
        this.name = ''
        this.isRequired = false
        this.hasExpiration = false
    }
    name: string
    isRequired: boolean
    hasExpiration: boolean
}