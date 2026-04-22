import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import type { CreateTaxCommand, CreateTaxOfficeCommand, UpdateTaxCommand, UpdateTaxOfficeCommand } from "@/models/entities/general/GeneralCommands";
import type { TaxDto, TaxOfficeDto, CountryDto } from "@/models/entities/general/GeneralDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";

export const useTaxStore = defineStore("tax", () => {
    const loading = ref(false);
    const taxList = ref([] as TaxDto[]);
    const taxOfficeList = ref([] as TaxOfficeDto[]);
    const countryList = ref([] as CountryDto[]);

    const getTaxList = async (filterQuery: any): Promise<PaginatedList<TaxDto>> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<TaxDto>>> = await ApiService.query('general/tax', { params: filterQuery });
            if (res.data.data) {
                taxList.value = res.data.data.items as TaxDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTaxList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getCountryList = async (filterQuery?: any): Promise<Array<CountryDto>> => {
        if (!filterQuery) filterQuery = { pageSize: 1000, pageNumber: 1 };
        try {
            loading.value = true;
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
        } finally {
            loading.value = false;
        }
    }

    const createTax = async (command: CreateTaxCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('general/tax', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateTax = async (command: UpdateTaxCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('general/tax', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteTax = async (taxId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('general/tax/' + taxId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const getTaxOfficeList = async (filterQuery?: any): Promise<PaginatedList<TaxOfficeDto>> => {
        if (!filterQuery) filterQuery = { pageSize: 1000, pageNumber: 1 };
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<PaginatedList<TaxOfficeDto>>> = await ApiService.query('general/taxOffice', { params: filterQuery });
            if (res.data.data) {
                taxOfficeList.value = res.data.data.items as TaxOfficeDto[];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTaxOfficeList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const createTaxOffice = async (command: CreateTaxOfficeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('general/taxOffice', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateTaxOffice = async (command: UpdateTaxOfficeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('general/taxOffice', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteTaxOffice = async (taxOfficeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('general/taxOffice/' + taxOfficeId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        taxList,
        taxOfficeList,
        countryList,
        getTaxList,
        getCountryList,
        createTax,
        updateTax,
        deleteTax,
        getTaxOfficeList,
        createTaxOffice,
        updateTaxOffice,
        deleteTaxOffice,
    };
});
