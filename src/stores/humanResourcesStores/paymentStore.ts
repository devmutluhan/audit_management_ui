import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList, Result } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError, createOrUpdateResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import type { AdvanceApprovalRequestListDto, AdvanceDetailDto, AdvanceListDto, CreateAdvanceCommand, UpdateAdvanceCommand } from "@/models/entities/humanResource/PaymentModels";

export const usePaymentStore = defineStore("payment", () => {
    const advanceDetail = ref({} as AdvanceDetailDto);
    const advanceList = ref({} as PaginatedList<AdvanceListDto>);
    const advanceApprovalRequestList = ref({} as PaginatedList<AdvanceApprovalRequestListDto>);
    const loading = ref(false)

    const getAdvanceList = async (filterQuery: any): Promise<PaginatedList<AdvanceListDto>> => {
        try {
            loading.value = true
            const query = mapQueryString(filterQuery)
            const res: AxiosResponse<ApiResult<PaginatedList<AdvanceListDto>>> = await ApiService.get('payments/deductions/advance', query);
            if (res.data.data) {
                advanceList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAdvanceList(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getAdvanceApprovalRequestList = async (filterQuery: any): Promise<PaginatedList<AdvanceApprovalRequestListDto>> => {
        try {
            loading.value = true
            const query = mapQueryString(filterQuery)
            const res: AxiosResponse<ApiResult<PaginatedList<AdvanceApprovalRequestListDto>>> = await ApiService.get('payments/approval-requests', query);
            if (res.data.data) {
                advanceApprovalRequestList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAdvanceApprovalRequestList(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getAdvanceDetail = async (advanceId: string): Promise<AdvanceDetailDto> => {
        try {
            loading.value = true
            advanceDetail.value = {} as AdvanceDetailDto;
            const res: AxiosResponse<ApiResult<AdvanceDetailDto>> = await ApiService.get('payments/deductions/advance/' + advanceId);
            if (res.data.data) {
                advanceDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAdvanceDetail(advanceId));
        } finally {
            loading.value = false
        }
    }

    const createAdvance = async (command: CreateAdvanceCommand): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/deductions/advance', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateAdvance = async (advanceId: string, command: UpdateAdvanceCommand): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.put('payments/deductions/advance/' + advanceId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteAdvance = async (advanceId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.delete('payments/deductions/advance/' + advanceId);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const sendAdvance = async (advanceId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/' + advanceId + '/send', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const approveAdvance = async (advanceId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/' + advanceId + '/approve', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const rejectAdvance = async (advanceId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/' + advanceId + '/reject', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const sendbackAdvance = async (advanceId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/' + advanceId + '/sendback', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const cancelAdvance = async (advanceId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('payments/' + advanceId + '/cancel', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }


    return {
        getAdvanceList,
        getAdvanceDetail,
        createAdvance,
        updateAdvance,
        deleteAdvance,
        sendAdvance,
        rejectAdvance,
        sendbackAdvance,
        cancelAdvance,
        approveAdvance,
        getAdvanceApprovalRequestList,
        advanceApprovalRequestList,
        advanceList,
        advanceDetail,
        loading,
    };
});
