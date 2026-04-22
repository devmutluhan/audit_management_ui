import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import ApiService from "@/core/services/ApiService";
import type { ApiResult } from "@/models/ApiResult";
import type { CreateLeaveTypeCommand, UpdateLeaveTypeCommand } from "@/models/entities/humanResource/LeavePolicyCommands";
import { GetLeavePolicyDto, LeaveTypeDetailDto } from "@/models/entities/humanResource/LeavePolicyDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLeavePolicyStore = defineStore("leavePolicy", () => {
    const leavePolicy = ref({} as GetLeavePolicyDto);
    const leaveTypeDetail = ref({} as LeaveTypeDetailDto);
    const loading = ref(false);

    const getLeavePolicy = async (): Promise<GetLeavePolicyDto> => {
        try {
            loading.value = true
            const res: AxiosResponse<ApiResult<GetLeavePolicyDto>> = await ApiService.get('leave-policies');
            if (res.data.data) {
                leavePolicy.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeavePolicy());
        } finally {
            loading.value = false
        }
    }

    const getLeaveTypeDetail = async (leavePolicyId: string, leaveTypeId: string): Promise<LeaveTypeDetailDto> => {
        try {
            loading.value = true
            leaveTypeDetail.value = new LeaveTypeDetailDto();
            const res: AxiosResponse<ApiResult<LeaveTypeDetailDto>> = await ApiService.get(`leave-policies/${leavePolicyId}/leave-types/${leaveTypeId}`);
            if (res.data.data) {
                leaveTypeDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveTypeDetail(leavePolicyId, leaveTypeId));
        } finally {
            loading.value = false
        }
    }

    const deleteLeaveType = async (leavePolicyId: string, leaveTypeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('leave-policies/' + leavePolicyId + '/leave-types/' + leaveTypeId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateLeaveType = async (leavePolicyId: string, leaveTypeId: string, command: UpdateLeaveTypeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('leave-policies/' + leavePolicyId + '/leave-types/' + leaveTypeId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createLeaveType = async (leavePolicyId: string, command: CreateLeaveTypeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leave-policies/' + leavePolicyId + '/leave-types', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        leavePolicy,
        leaveTypeDetail,
        getLeavePolicy,
        getLeaveTypeDetail,
        deleteLeaveType,
        updateLeaveType,
        createLeaveType
    };
});
