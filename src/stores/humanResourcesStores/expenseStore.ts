import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList, Result } from "@/models/ApiResult";
import type { CreateExpenseCategoryCommand, CreateExpenseCommand, ExpenseCategoryDto, ExpenseReceiptCommand, UpdateExpenseCategoryCommand, UpdateExpenseCommand } from "@/models/entities/humanResource/ExpenseCommands";
import { ExpenseApprovalRequestList, ExpenseDetailDto, ExpenseListDto } from "@/models/entities/humanResource/ExpenseDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { catchError, createOrUpdateResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";

export const useExpenseStore = defineStore("expense", () => {
    const expenseDetail = ref({} as ExpenseDetailDto);
    const expenseList = ref({} as PaginatedList<ExpenseListDto>);
    const expenseApprovalRequestList = ref({} as PaginatedList<ExpenseApprovalRequestList>);
    const expenseCategoryList = ref([] as ExpenseCategoryDto[])
    const loading = ref(false)

    const getExpenseList = async (filterQuery: any): Promise<PaginatedList<ExpenseListDto>> => {
        try {
            loading.value = true
            const query = mapQueryString(filterQuery)
            const res: AxiosResponse<ApiResult<PaginatedList<ExpenseListDto>>> = await ApiService.get('expenses', query);
            if (res.data.data) {
                expenseList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getExpenseList(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getExpenseApprovalRequestList = async (filterQuery: any): Promise<PaginatedList<ExpenseApprovalRequestList>> => {
        try {
            loading.value = true
            const query = mapQueryString(filterQuery)
            const res: AxiosResponse<ApiResult<PaginatedList<ExpenseApprovalRequestList>>> = await ApiService.get('expenses/approval-requests', query);
            if (res.data.data) {
                expenseApprovalRequestList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getExpenseList(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const getExpenseDetail = async (expenseId: string): Promise<ExpenseDetailDto> => {
        try {
            loading.value = true
            expenseDetail.value = new ExpenseDetailDto();
            const res: AxiosResponse<ApiResult<ExpenseDetailDto>> = await ApiService.get('expenses/' + expenseId);
            if (res.data.data) {
                expenseDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getExpenseDetail(expenseId));
        } finally {
            loading.value = false
        }
    }

    const createExpense = async (command: CreateExpenseCommand): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateExpense = async (expenseId: string, command: UpdateExpenseCommand): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.put('expenses/' + expenseId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteExpense = async (expenseId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.delete('expenses/' + expenseId);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const sendExpense = async (expenseId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/send', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const addReceipt = async (expenseId: string, command: ExpenseReceiptCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('expenses/' + expenseId + '/receipts', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateReceipt = async (expenseId: string, receiptId: string, command: ExpenseReceiptCommand): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.put('expenses/' + expenseId + '/receipts/' + receiptId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteReceipt = async (expenseId: string, receiptId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.delete('expenses/' + expenseId + '/receipts/' + receiptId);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const approveReceipt = async (expenseId: string, command: Array<string>): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/receipts/approve', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const rejectReceipt = async (expenseId: string, command: Array<string>): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/receipts/reject', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const approveExpense = async (expenseId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/approve', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const rejectExpense = async (expenseId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/reject', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const sendbackExpense = async (expenseId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/sendback', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const cancelExpense = async (expenseId: string, description: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('expenses/' + expenseId + '/cancel', description);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateExpenseCategory = async (command: UpdateExpenseCategoryCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('expenses/categories/' + command.id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createExpenseCategory = async (command: CreateExpenseCategoryCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('expenses/categories', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const getExpenseCategoryList = async (filterQuery: any): Promise<PaginatedList<ExpenseCategoryDto>> => {
        try {
            loading.value = true
            const res: AxiosResponse<ApiResult<PaginatedList<ExpenseCategoryDto>>> = await ApiService.query('expenses/categories', { params: filterQuery });
            if (res.data.data) {
                expenseCategoryList.value = res.data.data.items ?? new Array<ExpenseCategoryDto>();
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getExpenseCategoryList(filterQuery));
        } finally {
            loading.value = false
        }
    }

    const deleteExpenseCategory = async (categoryId: string): Promise<Result> => {
        try {
            const res: AxiosResponse<ApiResult<Result>> = await ApiService.delete('expenses/categories/' + categoryId);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        getExpenseList,
        getExpenseDetail,
        createExpense,
        updateExpense,
        deleteExpense,
        sendExpense,
        approveExpense,
        rejectExpense,
        sendbackExpense,
        cancelExpense,
        createExpenseCategory,
        getExpenseCategoryList,
        getExpenseApprovalRequestList,
        updateExpenseCategory,
        deleteExpenseCategory,
        addReceipt,
        updateReceipt,
        deleteReceipt,
        approveReceipt,
        rejectReceipt,
        expenseCategoryList,
        expenseApprovalRequestList,
        expenseList,
        loading,
        expenseDetail
    };
});
