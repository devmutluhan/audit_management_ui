import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import type { CountryDto, NotificationsDto } from "@/models/entities/general/GeneralDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError } from "@/core/helpers/generalResponse";
import { CurrencyDto, DashboardItemsDto, ModuleClaimsDto, TenantModulesDto } from "@/models/entities/management/ManagementDtos";

export const useGeneralStore = defineStore("general", () => {
    const loading = ref(false)
    const countryList = ref([] as CountryDto[]);
    const currencies = ref([] as CurrencyDto[]);
    const tenantModules = ref({} as TenantModulesDto);
    const moduleClaims = ref(new Array<ModuleClaimsDto>());
    const dashboardItems = ref(new DashboardItemsDto());
    const notificationList = ref({} as PaginatedList<NotificationsDto>);

    const getCountryList = async (filterQuery?: any): Promise<Array<CountryDto>> => {
        if (!filterQuery) filterQuery = { pageSize: 1000, pageNumber: 1 };
        try {
            const res: AxiosResponse<ApiResult<Array<CountryDto>>> = await ApiService.query('general/countries', { params: filterQuery });
            if (res.data.data) {
                countryList.value = res.data.data as CountryDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCountryList(filterQuery));
        }
    }

    const getNotificationList = async (filterQuery?: any): Promise<PaginatedList<NotificationsDto>> => {
        if (!filterQuery) filterQuery = { pageSize: 1000, pageNumber: 1 };
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<NotificationsDto>>> = await ApiService.query('general/notifications', { params: filterQuery });
            if (res.data.data) {
                if (!filterQuery.status)
                    notificationList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getNotificationList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const readNotifications = async (command: Array<string>): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('general/notifications/markAsRead', command);
            return Promise.resolve(res.data)
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const getCurrencies = async (): Promise<Array<CurrencyDto>> => {
        try {
            const res: AxiosResponse<ApiResult<Array<CurrencyDto>>> = await ApiService.get('general/currencies');
            if (res.data.data) {
                currencies.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCurrencies());
        }
    }

    const getTenantModules = async (): Promise<TenantModulesDto> => {
        try {
            const res: AxiosResponse<ApiResult<TenantModulesDto>> = await ApiService.get('general/tenantModules');
            if (res.data.data) {
                tenantModules.value = res.data.data;
                moduleClaims.value = new Array<ModuleClaimsDto>()
                res.data.data.modules.forEach((module) => {
                    module.claims.forEach((claim) => {
                        moduleClaims.value.push({
                            moduleId: module.id,
                            moduleName: module.name,
                            claimId: claim.id,
                            claimName: claim.name
                        });
                    })
                });

                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTenantModules());
        }
    }


    const getDashboardItems = async (): Promise<DashboardItemsDto> => {
        try {
            const res: AxiosResponse<ApiResult<DashboardItemsDto>> = await ApiService.get('general/dashboard');
            if (res.data.data) {
                dashboardItems.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTenantModules());
        }
    }


    return {
        countryList,
        currencies,
        loading,
        tenantModules,
        moduleClaims,
        notificationList,
        dashboardItems,
        getCountryList,
        readNotifications,
        getNotificationList,
        getCurrencies,
        getTenantModules,
        getDashboardItems
    };
});
