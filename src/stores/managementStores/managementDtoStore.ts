import ApiService from "@/core/services/ApiService";
import type { ApiResult, LookupDto, PaginatedList } from "@/models/ApiResult";
import { CompanySettingsDto, WorkWeekPlanDto } from "@/models/entities/management/ManagementDtos";
import type { AxiosResponse } from "axios";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { defineStore } from "pinia";
import { ref } from "vue";
import { catchError } from "@/core/helpers/generalResponse";
import type { CompanyBranchDto, DepartmentDto } from "@/models/entities/management/ManagementCommands";

export const useManagementDtoStore = defineStore("managementDto", () => {
    const loading = ref(false)
    const departmentList = ref([] as DepartmentDto[]);
    const companySettings = ref(new CompanySettingsDto());
    const positionList = ref([] as LookupDto[]);
    const companyBranchList = ref([] as CompanyBranchDto[]);
    const workWeekPlan = ref({} as WorkWeekPlanDto);

    const getDepartmentList = async (filterQuery: any): Promise<PaginatedList<DepartmentDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<DepartmentDto>>> = await ApiService.query('management/department', { params: filterQuery });
            if (res.data.data || res.data.isSuccess) {
                departmentList.value = res.data.data.items as DepartmentDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getDepartmentList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getPositionList = async (filterQuery: any): Promise<PaginatedList<LookupDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<LookupDto>>> = await ApiService.query('management/position', { params: filterQuery });
            if (res.data.data || res.data.isSuccess) {
                positionList.value = res.data.data.items as LookupDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPositionList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getCompanyBranchList = async (filterQuery: any): Promise<PaginatedList<CompanyBranchDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<CompanyBranchDto>>> = await ApiService.query('management/companyBranch', { params: filterQuery });
            if (res.data.data || res.data.isSuccess) {
                companyBranchList.value = res.data.data.items as CompanyBranchDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCompanyBranchList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getWorkWeekPlan = async (): Promise<WorkWeekPlanDto> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<WorkWeekPlanDto>> = await ApiService.get('management/workWeekPlan');
            if (res.data.data || res.data.isSuccess) {
                workWeekPlan.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getWorkWeekPlan());
        } finally {
            loading.value = false;
        }
    }

    const getCompanySettings = async (): Promise<CompanySettingsDto> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<CompanySettingsDto>> = await ApiService.get('management/generalSettings');
            if (res.data.data || res.data.isSuccess) {
                companySettings.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCompanySettings());
        } finally {
            loading.value = false;
        }
    }

    return {
        loading, departmentList, companyBranchList, positionList, workWeekPlan, companySettings,
        getDepartmentList,
        getPositionList,
        getCompanyBranchList,
        getWorkWeekPlan,
        getCompanySettings
    };
});
