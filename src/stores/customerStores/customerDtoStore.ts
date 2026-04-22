import ApiService from "@/core/services/ApiService";
import type { ApiResult, LookupDto, PaginatedList } from "@/models/ApiResult";
import { CustomerDetailDto, CustomerDto } from "@/models/entities/customer/CustomerDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";

export const useCustomerDtoStore = defineStore("customerDto", () => {
    const loading = ref(false)
    const customerListLoading = ref(false)
    const customerList = ref({} as PaginatedList<CustomerDto>);
    const customerDetail = ref(new CustomerDetailDto());
    const customerTypes = ref(new Array<LookupDto>());
    const customerSectors = ref(new Array<LookupDto>());

    const getCustomerList = async (filterQuery: any): Promise<PaginatedList<CustomerDto>> => {
        try {
            customerListLoading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<CustomerDto>>> = await ApiService.get(`customers${queryString}`);
            if (res.data.data) {
                customerList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCustomerList(filterQuery));
        } finally {
            customerListLoading.value = false;
        }
    }

    const getCustomerDetail = async (customerId: string): Promise<CustomerDetailDto> => {
        try {
            loading.value = true;
            customerDetail.value = new CustomerDetailDto();
            const res: AxiosResponse<ApiResult<CustomerDetailDto>> = await ApiService.get('customers/' + customerId);
            if (res.data.data) {
                customerDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCustomerDetail(customerId));
        } finally {
            loading.value = false;
        }
    }

    const getCustomerTypes = async (): Promise<LookupDto[]> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<LookupDto[]>> = await ApiService.get('customers/types');
            if (res.data.data) {
                customerTypes.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCustomerTypes());
        } finally {
            loading.value = false;
        }
    }

    const getCustomerSectors = async (): Promise<LookupDto[]> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<LookupDto[]>> = await ApiService.get('customers/sectors');
            if (res.data.data) {
                customerSectors.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCustomerSectors());
        } finally {
            loading.value = false;
        }
    }

    return {
        customerList,
        customerDetail,
        customerTypes,
        customerSectors,
        loading,
        customerListLoading,
        getCustomerList,
        getCustomerDetail,
        getCustomerTypes,
        getCustomerSectors,
    };
});
