import ApiService from "@/core/services/ApiService";
import type { ApiResult, NameCommand } from "@/models/ApiResult";
import type { AddCustomerAddressCommand, AddCustomerRefferalCommand, AddCustomerRepresentativeCommand, CreateCustomerCommand, UpdateCustomerCommand } from "@/models/entities/customer/CustomerCommads";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";

export const useCustomerCommandStore = defineStore("customerCommand", () => {

    const passiveCustomer = async (customerId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`customers/${customerId}/status`, {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createCustomer = async (command: CreateCustomerCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateCustomer = async (customerId: string, command: UpdateCustomerCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('customers/' + customerId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCustomer = async (customerId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/' + customerId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createCustomerType = async (command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers/types', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCustomerType = async (customerTypeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/types/' + customerTypeId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createCustomerSector = async (command: NameCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers/sectors', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCustomerSector = async (customerSectorId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/sectors/' + customerSectorId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const addCustomerRepresentative = async (command: AddCustomerRepresentativeCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers/customerRepresentatives', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateCustomerRepresentative = async (command: AddCustomerRepresentativeCommand, representativeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('customers/customerRepresentatives/' + representativeId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCustomerRepresentative = async (representativeId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/customerRepresentatives/' + representativeId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const addCustomerRefferal = async (command: AddCustomerRefferalCommand, customerId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers/' + customerId + '/referrals', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateCustomerRefferal = async (command: AddCustomerRefferalCommand, customerId: string, referralId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('customers/' + customerId + '/referrals/' + referralId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCustomerRefferal = async (referralId: string, customerId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/' + customerId + '/referrals/' + referralId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const addCustomerAddress = async (command: AddCustomerAddressCommand, customerId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('customers/' + customerId + '/addresses', command);
            return createOrUpdateResponse(res);
        }
        catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateCustomerAddress = async (command: AddCustomerAddressCommand, customerId: string, addressId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('customers/' + customerId + '/addresses/' + addressId, command);
            return createOrUpdateResponse(res);
        }
        catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteCustomerAddress = async (addressId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('customers/addresses/' + addressId);
            return deleteResponse(res);
        }
        catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        createCustomer,
        updateCustomer,
        deleteCustomer,
        createCustomerType,
        deleteCustomerType,
        createCustomerSector,
        deleteCustomerSector,
        passiveCustomer,
        addCustomerRepresentative,
        updateCustomerRepresentative,
        deleteCustomerRepresentative,
        addCustomerRefferal,
        updateCustomerRefferal,
        deleteCustomerRefferal,
        deleteCustomerAddress,
        addCustomerAddress,
        updateCustomerAddress
    };
});
