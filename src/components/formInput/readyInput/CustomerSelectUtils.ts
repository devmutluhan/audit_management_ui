
import { ref } from 'vue';
import { mapQueryString } from '@/core/helpers/generalUtils';
import type { AxiosResponse } from 'axios';
import type { ApiResult, PaginatedList } from '@/models/ApiResult';
import ApiService from '@/core/services/ApiService';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { catchError } from '@/core/helpers/generalResponse';
import type { CustomerDto } from '@/models/entities/customer/CustomerDtos';

export const customerListTotalCount = ref(0)
export const customerListResponse = ref({} as PaginatedList<CustomerDto>)
export const customerListItems = ref(new Array<CustomerDto>());
export const customerListFirstFetch = ref(true);
export const pageSize = ref(10);
export const pageNumber = ref(1);
export const searchValue = ref('');
export const noFilter = ref(true);

export const getCustomerListForSelectInput = async () => {
    if (customerListTotalCount.value > customerListItems.value.length || customerListTotalCount.value == 0) {
        try {
            let filterQuery = { pageSize: pageSize.value, pageNumber: pageNumber.value, name: searchValue.value }
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<CustomerDto>>> = await ApiService.get(`customers${queryString}`);
            customerListResponse.value = res.data.data;
            if (res.data.data) {
                if (customerListFirstFetch.value || res.data.data.totalCount > customerListTotalCount.value) {
                    customerListFirstFetch.value = false;
                    customerListTotalCount.value = res.data.data.totalCount;
                }
                if (filterQuery.pageNumber == 1) {
                    customerListItems.value = res.data.data.items ?? new Array<CustomerDto>();
                } else {
                    customerListItems.value = customerListItems.value.concat(res.data.data.items ?? new Array<CustomerDto>())
                }
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCustomerListForSelectInput());
        } finally {
            if (customerListTotalCount.value == customerListItems.value.length) {
                noFilter.value = false
            }
        }
    }
}