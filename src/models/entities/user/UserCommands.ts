import type { LookupDto } from "@/models/ApiResult";
import { PlatformTypeEnum } from "@/models/custom/EnumTypes";

export class PreSignInCommand {
    constructor() {
        this.email = "";
        this.password = "";
    }

    email: string;
    password: string;
}

export class SignInCommand {
    constructor() {
        this.tenantId = "";
        this.email = "";
        this.password = "";
        this.platformType = PlatformTypeEnum.Web
    }
    tenantId: string;
    email: string;
    password: string;
    platformType: PlatformTypeEnum
}

export class PreSignInResponse {
    constructor() {
        this.jwtToken = "";
        this.tenants = [];
    }
    jwtToken: string;
    tenants: LookupDto[];
}

export class SignInResponse {
    constructor() {
        this.email = "";
        this.employeeId = "";
        this.claims = [];
        this.modules = [];
        this.fullName = "";
        this.tenantId = "";
        this.userId = "";
    }

    email: string;
    employeeId: string;
    claims: string[];
    modules: string[];
    fullName: string;
    tenantId: string;
    userId: string;
}

export class CreateTemplatesCommand {
    constructor() {
        this.name = "";
        this.claims = [];
    }

    name: string;
    claims: number[];
}

export class UpdateTemplatesCommand {
    constructor() {
        this.name = "";
        this.claims = [];
    }

    name: string;
    claims: number[];
}