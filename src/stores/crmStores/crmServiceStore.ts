import ApiService from "@/core/services/ApiService";
import type { ApiResult, LookupDto, PaginatedList } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import type { ConflictServiceDto, PositionPriceDto, PositionPriceHistoryDto, PositionPricesDto, ServiceDto, ServiceGroupDto } from "@/models/entities/crm/CrmServiceDtos";
import type { CreateConflictCommand, CreatePositionForService, CreatePositionPriceCommand, CreateServiceCommand, CreateServiceGroupCommand, UpdatePositionPriceCommand } from "@/models/entities/crm/CrmServiceCommands";

export const useCrmServiceStore = defineStore("crmService", () => {
    const loading = ref(false);
    const serviceGroupList = ref({} as PaginatedList<ServiceGroupDto>)
    const serviceList = ref({} as PaginatedList<ServiceDto>)
    const servicePositionList = ref([] as Array<LookupDto>)
    const positionPriceList = ref([] as Array<PositionPriceDto>)
    const conflictList = ref([] as Array<ConflictServiceDto>)
    const positionPriceHistory = ref([] as Array<PositionPriceHistoryDto>)
    const positionPrices = ref([] as Array<PositionPricesDto>)

    const getServiceGroupList = async (filterQuery: any): Promise<PaginatedList<ServiceGroupDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<ServiceGroupDto>>> = await ApiService.get(`crm/service-groups${queryString}`);
            if (res.data.data) {
                serviceGroupList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getServiceGroupList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getPositionPrices = async (serviceId: string, currencyCode: string): Promise<Array<PositionPricesDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<Array<PositionPricesDto>>> = await ApiService.get(`crm/service/${serviceId}/${currencyCode}/positions-price`);
            if (res.data.data) {
                positionPrices.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPositionPrices(serviceId, currencyCode));
        } finally {
            loading.value = false;
        }
    }

    const getServiceList = async (filterQuery: any): Promise<PaginatedList<ServiceDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<ServiceDto>>> = await ApiService.get(`crm/services${queryString}`);
            if (res.data.data) {
                serviceList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getServiceList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getConflictList = async (): Promise<Array<ConflictServiceDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<Array<ConflictServiceDto>>> = await ApiService.get(`crm/services/conflicts`);
            if (res.data.data) {
                conflictList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getConflictList());
        } finally {
            loading.value = false;
        }
    }

    const getPositionListForService = async (serviceId: string): Promise<Array<LookupDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<Array<LookupDto>>> = await ApiService.get(`crm/service/${serviceId}/positions`);
            if (res.data.data) {
                servicePositionList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPositionListForService(serviceId));
        } finally {
            loading.value = false;
        }
    }

    const getPositionPriceList = async (): Promise<Array<PositionPriceDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<Array<PositionPriceDto>>> = await ApiService.get(`crm/position-price`);
            if (res.data.data) {
                positionPriceList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPositionPriceList());
        } finally {
            loading.value = false;
        }
    }

    const getPositionPriceHistoryList = async (positionPriceId: string): Promise<Array<PositionPriceHistoryDto>> => {
        try {
            loading.value = true;
            positionPriceHistory.value = new Array<PositionPriceHistoryDto>()
            const res: AxiosResponse<ApiResult<Array<PositionPriceHistoryDto>>> = await ApiService.get(`crm/position-price/${positionPriceId}/histories`);
            if (res.data.data) {
                positionPriceHistory.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPositionPriceHistoryList(positionPriceId));
        } finally {
            loading.value = false;
        }
    }

    const createServiceGroup = async (command: CreateServiceGroupCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/service-groups', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateServiceGroup = async (id: string, command: { title: string }): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`crm/service-groups/${id}`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteServiceGroup = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/service-groups/' + id);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createService = async (serviceGroupId: string, command: CreateServiceCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post(`crm/service-groups/${serviceGroupId}/services`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateService = async (serviceGroupId: string, serviceId: string, command: CreateServiceCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`crm/service-groups/${serviceGroupId}/services/${serviceId}`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteService = async (serviceGroupId: string, id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete(`crm/service-groups/${serviceGroupId}/services/${id}`);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createPositionForService = async (serviceGroupId: string, command: CreatePositionForService): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post(`crm/service-groups/${serviceGroupId}/services/positions`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deletePositionForService = async (serviceGroupId: string, serviceId: string, positionId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete(`crm/service-groups/${serviceGroupId}/services/${serviceId}/positions/${positionId}`);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createPositionPrice = async (command: CreatePositionPriceCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post(`crm/position-price`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createConflict = async (command: CreateConflictCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post(`crm/services/create-update-conflicts`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updatePositionPrice = async (command: UpdatePositionPriceCommand, positionId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`crm/position-price/${positionId}`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        positionPriceList,
        serviceGroupList,
        serviceList,
        conflictList,
        positionPriceHistory,
        servicePositionList,
        positionPrices,
        getPositionPriceHistoryList,
        getPositionPriceList,
        getServiceGroupList,
        getServiceList,
        getPositionPrices,
        getConflictList,
        getPositionListForService,
        createServiceGroup,
        updateServiceGroup,
        deleteServiceGroup,
        createService,
        updateService,
        deleteService,
        createPositionForService,
        deletePositionForService,
        createPositionPrice,
        updatePositionPrice,
        createConflict,
    };
});
