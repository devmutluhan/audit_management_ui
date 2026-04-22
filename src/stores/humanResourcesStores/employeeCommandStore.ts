import { defineStore } from "pinia";
import type {
    CreateEmployeeCommand, CreateEmployeeExperienceCommand, TerminateEmployeeCommand, UpdateEmployeeCommand, UpdateEmployeeExperienceCommand,
    CreateEmployeeSalariesCommand, UpdateEmployeeAddressCommand, UpdateEmployeeBankDetailCommand, UpdateEmergencyPersonDetailCommand,
    UpdateCitizenshipDetailCommand, UpdateEducationDetailCommand, UpdateMaritalDetailCommand, UpdateEmployeeCommunicationCommand,
    AddEmployeeDocumentsCommand
} from "@/models/entities/humanResource/EmployeeCommands";
import ApiService from "@/core/services/ApiService";
import type { AxiosResponse } from "axios";
import { createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import type { ApiResult } from "@/models/ApiResult";

export const useEmployeeCommandStore = defineStore("employeeCommand", () => {

    const createEmployee = async (command: CreateEmployeeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('employees', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployee = async (command: UpdateEmployeeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const terminateEmployee = async (employeeId: string, command: TerminateEmployeeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('employees/' + employeeId + '/terminate', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createEmployeeExperience = async (employeeId: string, command: CreateEmployeeExperienceCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('employees/' + employeeId + '/experiences', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteEmployeeExperience = async (employeeId: string, experienceId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('employees/' + employeeId + '/experiences/' + experienceId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeExperience = async (employeeId: string, experienceId: string, command: UpdateEmployeeExperienceCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/experiences/' + experienceId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createEmployeeSalary = async (employeeId: string, command: CreateEmployeeSalariesCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('employees/' + employeeId + '/salaries', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteEmployeeSalary = async (employeeId: string, salaryId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('employees/' + employeeId + '/salaries/' + salaryId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeAddress = async (employeeId: string, command: UpdateEmployeeAddressCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/address', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeBankDetail = async (employeeId: string, command: UpdateEmployeeBankDetailCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/bankDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeEmergency = async (employeeId: string, command: UpdateEmergencyPersonDetailCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/emergencyDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeMaritalDetail = async (employeeId: string, command: UpdateMaritalDetailCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/maritalDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeEducationDetail = async (employeeId: string, command: UpdateEducationDetailCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/educationDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeCitizenshipDetail = async (employeeId: string, command: UpdateCitizenshipDetailCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/citizenshipDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateEmployeeCommunication = async (employeeId: string, command: UpdateEmployeeCommunicationCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('employees/' + employeeId + '/contactDetail', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createEmployeeDocument = async (definitionId: string, command: AddEmployeeDocumentsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('employees/employee-documents/' + definitionId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteEmployeeDocument = async (employeeId: string, definitionId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('employees/employee-documents/' + employeeId + '/document/' + definitionId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        createEmployee,
        updateEmployee,
        terminateEmployee,
        createEmployeeExperience,
        createEmployeeDocument,
        deleteEmployeeDocument,
        deleteEmployeeExperience,
        updateEmployeeExperience,
        createEmployeeSalary,
        deleteEmployeeSalary,
        updateEmployeeAddress,
        updateEmployeeBankDetail,
        updateEmployeeEmergency,
        updateEmployeeCitizenshipDetail,
        updateEmployeeEducationDetail,
        updateEmployeeMaritalDetail,
        updateEmployeeCommunication
    };
});
