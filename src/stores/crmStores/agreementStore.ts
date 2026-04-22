import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";
import type { AddAgreementEmployeeCommand, ConvertToAgreementCommand, UpdateAgreementInfoCommand } from "@/models/entities/crm/CrmAgreementCommands";
import { AgreementDetailDto, AgreementEmployeeDto, AgreementListDto } from "@/models/entities/crm/CrmAgreementDtos";
import { mapQueryString } from "@/core/helpers/generalUtils";

export const useAgreementStore = defineStore("agreement", () => {
    const loading = ref(false);
    const agreementList = ref({} as PaginatedList<AgreementListDto>)
    const agreementEmployees = ref(new Array<AgreementEmployeeDto>())
    const agreementDetail = ref(new AgreementDetailDto())

    const getAgreementList = async (filterQuery: any): Promise<PaginatedList<AgreementListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<AgreementListDto>>> = await ApiService.get(`crm/agreements${queryString}`);
            if (res.data.data) {
                agreementList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAgreementList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getAgreementEmployees = async (agreementId: string): Promise<Array<AgreementEmployeeDto>> => {
        try {
            loading.value = true;
            agreementEmployees.value = new Array<AgreementEmployeeDto>();
            const res: AxiosResponse<ApiResult<Array<AgreementEmployeeDto>>> = await ApiService.get(`crm/agreements/${agreementId}/employees`);
            if (res.data.data) {
                agreementEmployees.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAgreementEmployees(agreementId));
        } finally {
            loading.value = false;
        }
    }

    const getAgreementDetail = async (agreementId: string): Promise<AgreementDetailDto> => {
        try {
            loading.value = true;
            agreementDetail.value = new AgreementDetailDto();
            const res: AxiosResponse<ApiResult<AgreementDetailDto>> = await ApiService.get(`crm/agreements/${agreementId}`);
            if (res.data.data) {
                agreementDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAgreementDetail(agreementId));
        } finally {
            loading.value = false;
        }
    }

    const convertToAgreement = async (command: ConvertToAgreementCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/agreements/convert-to-agreement', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const cancelAgreement = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/agreements/' + id + '/cancel', { cancellationReason: reason });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateAgreement = async (command: UpdateAgreementInfoCommand, id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/agreements/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const addAgreementEmployee = async (id: string, command: Array<AddAgreementEmployeeCommand>): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/agreements/' + id + '/employees', { employees: command });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteAgreementEmployee = async (agreementId: string, employeeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/agreements/' + agreementId + '/' + employeeId + '/employees');
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        agreementList,
        agreementEmployees,
        agreementDetail,
        getAgreementList,
        getAgreementDetail,
        addAgreementEmployee,
        getAgreementEmployees,
        updateAgreement,
        convertToAgreement,
        deleteAgreementEmployee,
        cancelAgreement
    };
});
