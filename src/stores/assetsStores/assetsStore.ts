import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import ApiService from "@/core/services/ApiService";
import type { ApiResult, LookupDto, NameCommand, PaginatedList } from "@/models/ApiResult";
import { AssetsDto, AssetsForEmployeeDto, AssignAssetCommand, CreateOrUpdateAssetsCommand, ReturnAssetCommand } from "@/models/entities/assets/AssetsModels";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAssetsStore = defineStore("assets", () => {
    const loading = ref(false)
    const assetDetail = ref(new AssetsDto());
    const assetCategories = ref({} as PaginatedList<LookupDto>);
    const assetsListForEmployee = ref(new Array<AssetsForEmployeeDto>());
    const assetsList = ref({} as PaginatedList<AssetsDto>);

    const getAssetsList = async (filterQuery: any): Promise<PaginatedList<AssetsDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<AssetsDto>>> = await ApiService.get(`assets${queryString}`);
            if (res.data.data) {
                assetsList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAssetsList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getAssetsForEmployee = async (filterQuery: any): Promise<Array<AssetsForEmployeeDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            assetsListForEmployee.value = new Array<AssetsForEmployeeDto>();
            const res: AxiosResponse<ApiResult<Array<AssetsForEmployeeDto>>> = await ApiService.get(`assets/employees${queryString}`);
            if (res.data.data) {
                assetsListForEmployee.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAssetsForEmployee(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const updateAssets = async (id: string, command: CreateOrUpdateAssetsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('assets/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }
    const createAssets = async (command: CreateOrUpdateAssetsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('assets', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteAssets = async (assetId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('assets/' + assetId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const assignAssets = async (id: string, command: AssignAssetCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('assets/' + id + '/assign', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const returnAssets = async (id: string, command: ReturnAssetCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('assets/' + id + '/return', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const getAssetsCategories = async (filterQuery: any): Promise<PaginatedList<LookupDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<LookupDto>>> = await ApiService.get('assets/categories' + queryString);
            if (res.data.data) {
                assetCategories.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getAssetsCategories(filterQuery));
        } finally {
            loading.value = false;
        }
    }


    const updateAssetCategory = async (id: string, command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('assets/categories/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }
    const createAssetCategory = async (command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('assets/categories', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteAssetCategory = async (categoryId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('assets/categories/' + categoryId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        assetCategories,
        assetDetail,
        assetsListForEmployee,
        assetsList,
        getAssetsList,
        getAssetsForEmployee,
        getAssetsCategories,
        updateAssetCategory,
        createAssetCategory,
        deleteAssetCategory,
        createAssets,
        updateAssets,
        deleteAssets,
        assignAssets,
        returnAssets
    };
});
