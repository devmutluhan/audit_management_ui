import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import ApiService from "@/core/services/ApiService";
import type { ApiResult } from "@/models/ApiResult";
import { type CreateTimeSheetCommand, GetTimeSheetDto, type UpdateTimeSheetCommand } from "@/models/entities/crm/CrmTimeSheetModels";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimesheetStore = defineStore("timesheet", () => {
    const loading = ref(false)
    const timeSheetWeek = ref(new GetTimeSheetDto());

    const getTimesheet = async (filterQuery?: any): Promise<GetTimeSheetDto> => {
        try {
            loading.value = true;
            if (!filterQuery) {
                filterQuery = {};
            }
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<GetTimeSheetDto>> = await ApiService.get(`crm/timesheet-week${queryString}`);
            if (res.data.data) {
                timeSheetWeek.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTimesheet(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const updateTimesheetWeek = async (command: UpdateTimeSheetCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/timesheet-week/timesheet', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createTimesheetWeek = async (command: CreateTimeSheetCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/timesheet-week/timesheet', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteTimesheetWeek = async (weekId: string, trainingId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/timesheet-week/' + weekId + '/timesheet/' + trainingId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const closeTimesheetWeek = async (command: { weekId: string }): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/timesheet-week/close', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        timeSheetWeek,
        getTimesheet,
        closeTimesheetWeek,
        createTimesheetWeek,
        updateTimesheetWeek,
        deleteTimesheetWeek,
    };
});
