import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import ApiService from "@/core/services/ApiService";
import type { ApiResult } from "@/models/ApiResult";
import type { CreatePublicHolidayCommand, PublicHolidayListDto, UpdatePublicHolidayCommand } from "@/models/entities/humanResource/PublicHolidayModels";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useHolidayCalenderStore = defineStore("holidayCalender", () => {
    const holidayList = ref({} as PublicHolidayListDto);
    const loading = ref(false);

    const getPublicHoliday = async (filterQuery?: any): Promise<PublicHolidayListDto> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PublicHolidayListDto>> = await ApiService.get('holiday-calendars' + queryString);
            if (res.data.data) {
                holidayList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPublicHoliday());
        } finally {
            loading.value = false
        }
    }

    const deletePublicHoliday = async (leavePolicyId: string, publicHolidayId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('holiday-calendars/' + leavePolicyId + '/leave-types/' + publicHolidayId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updatePublicHoliday = async (leavePolicyId: string, publicHolidayId: string, command: UpdatePublicHolidayCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('holiday-calendars/' + leavePolicyId + '/public-holidays/' + publicHolidayId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createPublicHoliday = async (leavePolicyId: string, command: CreatePublicHolidayCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('holiday-calendars/' + leavePolicyId + '/public-holidays', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        holidayList,
        loading,
        getPublicHoliday,
        deletePublicHoliday,
        updatePublicHoliday,
        createPublicHoliday
    };
});
