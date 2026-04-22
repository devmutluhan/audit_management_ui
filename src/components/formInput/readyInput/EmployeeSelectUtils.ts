
import { ref } from 'vue';
import type { EmployeeDropdownListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { mapQueryString } from '@/core/helpers/generalUtils';
import type { AxiosResponse } from 'axios';
import type { ApiResult, PaginatedList } from '@/models/ApiResult';
import ApiService from '@/core/services/ApiService';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { catchError } from '@/core/helpers/generalResponse';

export const employeeListTotalCount = ref(0)
export const employeeListResponse = ref({} as PaginatedList<EmployeeDropdownListDto>)
export const employeeListItems = ref(new Array<EmployeeDropdownListDto>());
export const employeeListFirstFetch = ref(true);
export const pageSize = ref(10);
export const pageNumber = ref(1);
export const employeeStatus = ref(null as any) // null gelirse bütün personeller çekiliyor diğerleri Enum değerine göre çekiliyor.
export const searchValue = ref(''); // Autocomplate yazı yazınca value dönüyor.
export const noFilter = ref(true); // Autocomplate'e yazınca bütün data çekilmişse client filter yapıyor. Çekilmemişse backend e istek atıyor.

export const getEmployeeListForSelectInput = async () => {
    try {
        let filterQuery = { pageSize: pageSize.value, pageNumber: pageNumber.value, fullName: searchValue.value, appUserState: employeeStatus.value, isTerminated: false }
        const queryString = mapQueryString(filterQuery);
        const res: AxiosResponse<ApiResult<PaginatedList<EmployeeDropdownListDto>>> = await ApiService.get(`employees/dropdown${queryString}`);
        employeeListResponse.value = res.data.data;
        if (res.data.data) {
            if (employeeListFirstFetch.value || res.data.data.totalCount > employeeListTotalCount.value) {
                employeeListFirstFetch.value = false;
                employeeListTotalCount.value = res.data.data.totalCount;
            }
            if (filterQuery.pageNumber == 1) {
                employeeListItems.value = res.data.data.items ?? new Array<EmployeeDropdownListDto>();
            } else {
                employeeListItems.value = employeeListItems.value.concat(res.data.data.items ?? new Array<EmployeeDropdownListDto>())
            }
            return Promise.resolve(res.data.data);
        } else {
            ErrorStatusResult[res.status]({ message: res.data.message });
            return Promise.reject(res.data.message);
        }
    } catch (error: any) {
        return catchError(error, () => getEmployeeListForSelectInput());
    } finally {
        if (employeeListTotalCount.value == employeeListItems.value.length) {
            noFilter.value = false
        }
    }
}