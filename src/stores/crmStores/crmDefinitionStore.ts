import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import type { DocumentAuthorizationDto } from "@/models/entities/crm/CrmDefinitionDtos";
import { mapQueryString } from "@/core/helpers/generalUtils";
import type { CreateDocumentAuthorizationCommand, UpdateDocumentAuthorization } from "@/models/entities/crm/CrmDefinitionCommands";
import { CreateRiskFormCommand, RiskFormDetailDto, RiskFormDto, UpdateRiskFormCommand } from "@/models/entities/crm/CrmRiskFormModels";

export const useCrmDefinitionStore = defineStore("crmDefinition", () => {
    const loading = ref(false);
    const documentAuthorizationList = ref({} as PaginatedList<DocumentAuthorizationDto>);
    const riskFormList = ref(new Array<RiskFormDto>());
    const riskFormDetail = ref(new RiskFormDetailDto());

    const getDocumentAuthorization = async (filterQuery: any): Promise<PaginatedList<DocumentAuthorizationDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<DocumentAuthorizationDto>>> = await ApiService.get(`crm/documentAuthorization${queryString}`);
            if (res.data.isSuccess) {
                documentAuthorizationList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getDocumentAuthorization(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const createDocumentAuthorization = async (command: CreateDocumentAuthorizationCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/documentAuthorization', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateDocumentAuthorization = async (authId: string, command: UpdateDocumentAuthorization): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/documentAuthorization/' + authId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteDocumentAuthorization = async (documentAuthorizationId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/documentAuthorization/' + documentAuthorizationId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const getRiskFormList = async (): Promise<Array<RiskFormDto>> => {
        try {
            loading.value = true;
            riskFormList.value = new Array<RiskFormDto>()
            const res: AxiosResponse<ApiResult<Array<RiskFormDto>>> = await ApiService.get(`crm/risk-forms`);
            if (res.data.isSuccess) {
                riskFormList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getRiskFormList());
        } finally {
            loading.value = false;
        }
    }

    const getRiskForm = async (id: string): Promise<RiskFormDetailDto> => {
        try {
            loading.value = true;
            riskFormDetail.value = new RiskFormDetailDto();
            const res: AxiosResponse<ApiResult<RiskFormDetailDto>> = await ApiService.get(`crm/risk-forms/${id}`);
            if (res.data.isSuccess) {
                riskFormDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getRiskForm(id));
        } finally {
            loading.value = false;
        }
    }

    const getRiskFormFromCustomerId = async (customerId: string, employeeId: string): Promise<RiskFormDetailDto> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<RiskFormDetailDto>> = await ApiService.get(`crm/risk-forms/customer/${customerId}/employee/${employeeId}`);
            if (res.data.isSuccess) {
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getRiskForm(customerId));
        } finally {
            loading.value = false;
        }
    }

    const createRiskForm = async (command: CreateRiskFormCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/risk-forms', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateRiskForm = async (riskFormId: string, command: UpdateRiskFormCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/risk-forms/' + riskFormId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteRiskForm = async (riskFormId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/risk-forms/' + riskFormId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        documentAuthorizationList,
        riskFormList,
        riskFormDetail,
        getRiskFormFromCustomerId,
        getDocumentAuthorization,
        getRiskFormList,
        getRiskForm,
        createDocumentAuthorization,
        updateDocumentAuthorization,
        deleteDocumentAuthorization,
        createRiskForm,
        updateRiskForm,
        deleteRiskForm
    };
});
