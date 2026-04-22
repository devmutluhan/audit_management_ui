import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";
import type { AddAgreementEmployeeCommand } from "@/models/entities/crm/CrmAgreementCommands";
import { mapQueryString } from "@/core/helpers/generalUtils";
import type { ConvertToProjectCommand } from "@/models/entities/crm/CrmProjectCommands";
import { ProjectCostSummaryDto, ProjectDetailDto, ProjectEmployeeDto, ProjectListDto } from "@/models/entities/crm/CrmProjectDtos";

export const useProjectStore = defineStore("project", () => {
    const loading = ref(false);
    const projectList = ref({} as PaginatedList<ProjectListDto>)
    const projectEmployees = ref(new Array<ProjectEmployeeDto>())
    const projectDetail = ref(new ProjectDetailDto());
    const projectCostList = ref(new Array<ProjectCostSummaryDto>());

    const getProjectList = async (filterQuery: any): Promise<PaginatedList<ProjectListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<ProjectListDto>>> = await ApiService.get(`crm/projects${queryString}`);
            if (res.data.data) {
                projectList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getProjectList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getProjectEmployees = async (projectId: string): Promise<Array<ProjectEmployeeDto>> => {
        try {
            loading.value = true;
            projectEmployees.value = new Array<ProjectEmployeeDto>()
            const res: AxiosResponse<ApiResult<Array<ProjectEmployeeDto>>> = await ApiService.get(`crm/projects/${projectId}/employees`);
            if (res.data.data) {
                projectEmployees.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getProjectEmployees(projectId));
        } finally {
            loading.value = false;
        }
    }

    const getProjectDetail = async (projectId: string): Promise<ProjectDetailDto> => {
        try {
            loading.value = true;
            projectDetail.value = new ProjectDetailDto();
            const res: AxiosResponse<ApiResult<ProjectDetailDto>> = await ApiService.get(`crm/projects/${projectId}`);
            if (res.data.data) {
                projectDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getProjectDetail(projectId));
        } finally {
            loading.value = false;
        }
    }

    const getProjectCostSummary = async (projectId: string): Promise<Array<ProjectCostSummaryDto>> => {
        try {
            loading.value = true;
            projectCostList.value = new Array<ProjectCostSummaryDto>();
            const res: AxiosResponse<ApiResult<Array<ProjectCostSummaryDto>>> = await ApiService.get(`crm/projects/${projectId}/cost-summary`);
            if (res.data.data) {
                projectCostList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getProjectDetail(projectId));
        } finally {
            loading.value = false;
        }
    }

    const convertToProject = async (command: ConvertToProjectCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/projects/convert-to-project', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const endToProject = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/projects/' + id + '/end-to-project', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const addProjectEmployee = async (id: string, command: Array<AddAgreementEmployeeCommand>): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/projects/' + id + '/employees', { employees: command });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const manageActivationProjectEmployee = async (projectId: string, employeeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/projects/' + projectId + '/employees/' + employeeId + '/manage-activation', {});
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteProjectEmployee = async (projectId: string, employeeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/projects/' + projectId + '/employees/' + employeeId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        projectList,
        projectEmployees,
        projectDetail,
        projectCostList,
        getProjectList,
        getProjectDetail,
        addProjectEmployee,
        getProjectEmployees,
        convertToProject,
        manageActivationProjectEmployee,
        endToProject,
        getProjectCostSummary,
        deleteProjectEmployee
    };
});
