import { InviteHistoryStatusEnum } from "@/models/custom/EnumTypes";

export class TemplatesDto {
    constructor() {
        this.id = "";
        this.name = "";
        this.claims = [];
    }

    id: string;
    name: string;
    claims: number[];
}

export class InviteHistoryDto {
    constructor() {
        this.id = "";
        this.email = "";
        this.invitationStatus = InviteHistoryStatusEnum.Pending;
        this.createdAt = "";
        this.createdByName = "";
    }
    id: string;
    email: string;
    invitationStatus: InviteHistoryStatusEnum;
    createdAt: string;
    createdByName: string;
}
