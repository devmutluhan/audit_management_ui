import ApiService from "@/core/services/ApiService";
import type { ApiResult, NameCommand } from "@/models/ApiResult";
import type { CreateOrUpdateCompanyBranchCommand, CreateOrUpdateDepartmentCommand, UpdateCompanySettingsCommand, UpdateWorkWeekPlanCommand } from "@/models/entities/management/ManagementCommands";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";

export const useManagementCommandStore = defineStore("managementCommand", () => {

    const createDepartment = async (command: CreateOrUpdateDepartmentCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('management/department', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateDepartment = async (departmentId: string, command: CreateOrUpdateDepartmentCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/department/' + departmentId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteDepartment = async (departmentId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('management/department/' + departmentId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createPosition = async (command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('management/position', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createTitle = async (command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('management/title', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateTitle = async (titleId: string, command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/title/' + titleId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updatePosition = async (positionId: string, command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/position/' + positionId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteTitle = async (titleId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('management/title/' + titleId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }
    const deletePosition = async (positionId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('management/position/' + positionId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createCompanyBranch = async (command: CreateOrUpdateCompanyBranchCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('management/companyBranch', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateCompanyBranch = async (companyBranchId: string, command: CreateOrUpdateCompanyBranchCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/companyBranch/' + companyBranchId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteCompanyBranch = async (companyBranchId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('management/companyBranch/' + companyBranchId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateWorkWeekPlan = async (command: UpdateWorkWeekPlanCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/workWeekPlan', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateCompanySettings = async (command: UpdateCompanySettingsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('management/generalSettings', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        createDepartment,
        updateDepartment,
        deleteDepartment,
        createPosition,
        updatePosition,
        deletePosition,
        createTitle,
        updateTitle,
        deleteTitle,
        createCompanyBranch,
        updateCompanyBranch,
        deleteCompanyBranch,
        updateWorkWeekPlan,
        updateCompanySettings,
    };
});
