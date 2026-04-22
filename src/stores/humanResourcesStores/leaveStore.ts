import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList, SendToApprovementResponse } from "@/models/ApiResult";
import type { CheckLeaveRequestCommand, CreateLeaveRequestCommand, UpdateLeaveRequestCommand } from "@/models/entities/humanResource/LeaveCommands";
import { CheckLeaveResponseDto, EmployeeLeaveListDto, LeaveApprovalDetailDto, LeaveBalanceDto, LeaveDetailDto } from "@/models/entities/humanResource/LeaveDtos";
import { LeaveTypeDetailDto } from "@/models/entities/humanResource/LeavePolicyDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLeaveStore = defineStore("leave", () => {
    const employeeLeaveList = ref({} as PaginatedList<EmployeeLeaveListDto>);
    const leaveApprovalRequestList = ref({} as PaginatedList<EmployeeLeaveListDto>);
    const employeeLeaveSummaryDetail = ref({} as LeaveBalanceDto);
    const employeeLeaveTypeList = ref([] as Array<LeaveTypeDetailDto>)
    const leaveTypeDetail = ref({} as LeaveTypeDetailDto);
    const leaveDetail = ref({} as LeaveDetailDto);
    const leaveShow = ref({} as LeaveApprovalDetailDto)
    const loading = ref(false);

    const getLeaveDetail = async (leaveId: string): Promise<LeaveDetailDto> => {
        try {
            loading.value = true
            leaveDetail.value = new LeaveDetailDto();
            const res: AxiosResponse<ApiResult<LeaveDetailDto>> = await ApiService.get(`leaves/${leaveId}`);
            if (res.data.data) {
                leaveDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveDetail(leaveId));
        } finally {
            loading.value = false
        }
    }

    const getLeaveShow = async (leaveId: string): Promise<LeaveApprovalDetailDto> => {
        try {
            loading.value = true
            leaveShow.value = new LeaveApprovalDetailDto()
            const res: AxiosResponse<ApiResult<LeaveApprovalDetailDto>> = await ApiService.get(`leaves/show/${leaveId}`);
            if (res.data.data) {
                leaveShow.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveShow(leaveId));
        } finally {
            loading.value = false
        }
    }

    const getLeaveForEmployee = async (filterQuery: any): Promise<PaginatedList<EmployeeLeaveListDto>> => {
        try {
            loading.value = true
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EmployeeLeaveListDto>>> = await ApiService.get(`leaves/employees` + queryString);
            if (res.data.data) {
                employeeLeaveList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveForEmployee(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getLeaveApprovalRequests = async (filterQuery: any): Promise<PaginatedList<EmployeeLeaveListDto>> => {
        try {
            loading.value = true
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EmployeeLeaveListDto>>> = await ApiService.get(`leaves/approval-requests` + queryString);
            if (res.data.data) {
                leaveApprovalRequestList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveApprovalRequests(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getLeaveSummaryForEmployee = async (employeeId: string): Promise<LeaveBalanceDto> => {
        try {
            loading.value = true
            employeeLeaveSummaryDetail.value = new LeaveBalanceDto()
            const res: AxiosResponse<ApiResult<LeaveBalanceDto>> = await ApiService.get(`leaves/employees/${employeeId}/summary`);
            if (res.data.data) {
                employeeLeaveSummaryDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveSummaryForEmployee(employeeId));
        } finally {
            loading.value = false
        }
    }

    const getLeaveTypesForEmployee = async (employeeId: string): Promise<Array<LeaveTypeDetailDto>> => {
        try {
            loading.value = true
            employeeLeaveTypeList.value = new Array<LeaveTypeDetailDto>()
            const res: AxiosResponse<ApiResult<Array<LeaveTypeDetailDto>>> = await ApiService.get(`leaves/employees/${employeeId}/types`);
            if (res.data.data) {
                employeeLeaveTypeList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getLeaveTypesForEmployee(employeeId));
        } finally {
            loading.value = false
        }
    }

    const getLeaveTypeDetail = async (leavePolicyId: string, leaveTypeId: string): Promise<LeaveTypeDetailDto> => {
        try {
            loading.value = true
            leaveTypeDetail.value = new LeaveTypeDetailDto();
            const res: AxiosResponse<ApiResult<LeaveTypeDetailDto>> = await ApiService.get(`leaves/employees/${leavePolicyId}/leave-types/${leaveTypeId}`);
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

    const checkLeave = async (command: CheckLeaveRequestCommand): Promise<ApiResult<CheckLeaveResponseDto>> => {
        try {
            const res: AxiosResponse<ApiResult<CheckLeaveResponseDto>> = await ApiService.post('leaves/check', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createLeaveRequest = async (command: CreateLeaveRequestCommand): Promise<ApiResult<SendToApprovementResponse>> => {
        try {
            const res: AxiosResponse<ApiResult<SendToApprovementResponse>> = await ApiService.post('leaves', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateLeaveRequest = async (id: string, command: UpdateLeaveRequestCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('leaves/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteLeaveRequest = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('leaves/' + id);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const sendApproveLeave = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leaves/' + id + '/send', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const approveLeave = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leaves/' + id + '/approve', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const rejectLeave = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leaves/' + id + '/reject', reason);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const sendbackLeave = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leaves/' + id + '/sendback', reason);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const cancelLeave = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('leaves/' + id + '/cancel', reason);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        employeeLeaveList,
        employeeLeaveSummaryDetail,
        employeeLeaveTypeList,
        leaveTypeDetail,
        leaveDetail,
        leaveShow,
        loading,
        leaveApprovalRequestList,
        getLeaveDetail,
        getLeaveShow,
        getLeaveApprovalRequests,
        getLeaveSummaryForEmployee,
        getLeaveTypesForEmployee,
        getLeaveForEmployee,
        getLeaveTypeDetail,
        checkLeave,
        createLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        cancelLeave,
        approveLeave,
        sendbackLeave,
        sendApproveLeave,
        rejectLeave
    };
});
