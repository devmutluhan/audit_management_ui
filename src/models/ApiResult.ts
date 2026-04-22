import { ApprovementStatusEnum } from "./custom/EnumTypes";

export interface Result {
  isSuccess: boolean;
  message: string;
  errorCode: string | null;
}

export interface ApiResult<T> extends Result {
  data: T;
}

export interface PaginatedList<T> {
  items: Array<T> | null;
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  totalCountByStatus: TotalCountByStatus;
  hasNextPage: boolean;
}

export interface TotalCountByStatus {
  active: number;
  terminated: number;
}

export class LookupDto {
  constructor() {
    this.id = "";
    this.name = "";
  }

  id: string;
  name: string;
}

export class LookupDtoForEmployee {
  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.avatar = "";
    this.positionName = "";
    this.titleName = ""
  }

  id: string;
  firstName: string;
  lastName: string;
  avatar: string
  positionName: string
  titleName: string
}

export class LookupEmployeeDto {
  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
  }
  id: string;
  firstName: string;
  lastName: string;
}


export class NameCommand {
  constructor() {
    this.name = "";
  }
  name: string;
}

export class SendToApprovementResponse {
  constructor() {
    this.id = '';
    this.status = ApprovementStatusEnum.Draft;
  }
  id: string
  status: ApprovementStatusEnum
}

export class GeneralFileResponse {
  constructor() {
    this.fileId = ""
    this.url = ""
    this.fileName = ""
    this.contentType = ""
  }
  fileId: string
  url: string
  fileName: string
  contentType: string
}