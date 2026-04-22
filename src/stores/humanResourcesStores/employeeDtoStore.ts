import { defineStore } from "pinia";
import { ref } from "vue";
import { EmployeeDetailDto, EmployeeDocumentsDto, EmployeeDropdownListDto, EmployeeExperienceDto, EmployeeListDto, EmployeeRelatedProjects, EmployeeSalaryDto, TerminationReasonDto } from "@/models/entities/humanResource/EmployeeDtos";
import ApiService from "@/core/services/ApiService";
import type { AxiosResponse } from "axios";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import { userInfo } from "@/core/helpers/localStorageManagement";

export const useEmployeeDtoStore = defineStore("employeeDto", () => {
    const loading = ref(false);
    const employeeDetail = ref(new EmployeeDetailDto());
    const employeeList = ref({} as PaginatedList<EmployeeListDto>);
    const employeeDropdownList = ref({} as PaginatedList<EmployeeDropdownListDto>);
    const employeeExperience = ref([] as EmployeeExperienceDto[]);
    const employeeSalaries = ref([] as EmployeeSalaryDto[]);
    const terminationReasonList = ref([] as TerminationReasonDto[]);
    const employeeDocuments = ref([] as EmployeeDocumentsDto[]);
    const employeeRelatedProjects = ref(new Array<EmployeeRelatedProjects>());

    const getEmployeeList = async (filterQuery: any): Promise<PaginatedList<EmployeeListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EmployeeListDto>>> = await ApiService.get(`employees/search${queryString}`);
            if (res.data.data) {
                employeeList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getEmployeeDropdownList = async (filterQuery: any): Promise<PaginatedList<EmployeeDropdownListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EmployeeDropdownListDto>>> = await ApiService.get(`employees/dropdown${queryString}`);
            if (res.data.data) {
                employeeDropdownList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getEmployeeDetail = async (employeeId: string): Promise<EmployeeDetailDto> => {
        try {
            loading.value = true;
            employeeDetail.value = new EmployeeDetailDto();
            const res: AxiosResponse<ApiResult<EmployeeDetailDto>> = await ApiService.get('employees/' + employeeId + '/profile');
            if (res.data.data) {
                employeeDetail.value = res.data.data;
                if (res.data.data.id == userInfo.value.employeeId) {
                    userInfo.value.employeeDetail = res.data.data;
                    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
                }
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeDetail(employeeId));
        } finally {
            loading.value = false;
        }
    };

    const getEmployeeExperience = async (employeeId: string): Promise<EmployeeExperienceDto[]> => {
        try {
            loading.value = true;
            employeeExperience.value = new Array<EmployeeExperienceDto>();
            const res: AxiosResponse<ApiResult<EmployeeExperienceDto[]>> = await ApiService.get('employees/' + employeeId + '/experiences');
            if (res.data.data) {
                employeeExperience.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeExperience(employeeId));
        } finally {
            loading.value = false;
        }
    };

    const getEmployeeSalaries = async (employeeId: string): Promise<EmployeeSalaryDto[]> => {
        try {
            loading.value = true;
            employeeSalaries.value = new Array<EmployeeSalaryDto>();
            const res: AxiosResponse<ApiResult<EmployeeSalaryDto[]>> = await ApiService.get('employees/' + employeeId + '/salaries');
            if (res.data.data) {
                employeeSalaries.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeSalaries(employeeId));
        } finally {
            loading.value = false;
        }
    }

    const getTerminateReasonList = async (): Promise<TerminationReasonDto[]> => {
        try {
            loading.value = true;
            terminationReasonList.value = new Array<TerminationReasonDto>();
            const res: AxiosResponse<ApiResult<TerminationReasonDto[]>> = await ApiService.get('employees/terminationReason');
            if (res.data.data) {
                terminationReasonList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTerminateReasonList());
        } finally {
            loading.value = false;
        }
    }


    const getEmployeeRelatedProjects = async (filterQuery: any): Promise<PaginatedList<EmployeeRelatedProjects>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EmployeeRelatedProjects>>> = await ApiService.get(`employee/employee-related-projects${queryString}`);
            if (res.data.data) {
                employeeRelatedProjects.value = res.data.data.items ?? new Array<EmployeeRelatedProjects>()
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeRelatedProjects(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getEmployeeDocuments = async (employeeId: string): Promise<Array<EmployeeDocumentsDto>> => {
        try {
            loading.value = true;
            employeeDocuments.value = new Array<EmployeeDocumentsDto>()
            const res: AxiosResponse<ApiResult<Array<EmployeeDocumentsDto>>> = await ApiService.get(`employees/employee-documents/${employeeId}`);
            if (res.data.data) {
                employeeDocuments.value = res.data.data ?? new Array<EmployeeDocumentsDto>()
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEmployeeDocuments(employeeId));
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        employeeList,
        employeeDetail,
        employeeExperience,
        employeeSalaries,
        terminationReasonList,
        employeeRelatedProjects,
        employeeDropdownList,
        employeeDocuments,
        getEmployeeDocuments,
        getTerminateReasonList,
        getEmployeeList,
        getEmployeeDropdownList,
        getEmployeeExperience,
        getEmployeeSalaries,
        getEmployeeDetail,
        getEmployeeRelatedProjects
    };
});
