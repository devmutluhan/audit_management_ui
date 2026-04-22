import { defineStore } from "pinia";
import { ref } from "vue";
import ApiService from "@/core/services/ApiService";
import type { AxiosResponse } from "axios";
import type { ApiResult } from "@/models/ApiResult";
import { createOrUpdateResponse, catchError, deleteResponse } from "@/core/helpers/generalResponse";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";

import type {
    CreateDocumentCategoryCommand,
    DocumentCategoryDto,
    UpdateDocumentCategoryCommand,
    CreateDocumentDefinitionCommand,
    DocumentDefinitionDto,
    UpdateDocumentDefinitionCommand
} from "@/models/entities/humanResource/DocumentModels";
import { mapQueryString } from "@/core/helpers/generalUtils";

export const useDocumentStore = defineStore("document", () => {
    const loading = ref(false);
    const categoryList = ref(new Array<DocumentCategoryDto>());
    const definitionList = ref([] as DocumentDefinitionDto[]);

    const getDocumentCategories = async (filterQuery?: any): Promise<Array<DocumentCategoryDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<Array<DocumentCategoryDto>>> = await ApiService.get('document/category' + queryString);
            if (res.data.data) {
                categoryList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getDocumentCategories());
        } finally {
            loading.value = false;
        }
    }

    const getDocumentDefinitions = async (categoryId: string): Promise<Array<DocumentDefinitionDto>> => {
        try {
            loading.value = true;
            definitionList.value = new Array<DocumentDefinitionDto>();
            const res: AxiosResponse<ApiResult<Array<DocumentDefinitionDto>>> = await ApiService.get(`document/category/${categoryId}/definition`);
            if (res.data.data) {
                definitionList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getDocumentDefinitions(categoryId));
        } finally {
            loading.value = false;
        }
    }

    const createCategory = async (command: CreateDocumentCategoryCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('document/category', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateCategory = async (categoryId: string, command: UpdateDocumentCategoryCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`document/category/${categoryId}`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteCategory = async (categoryId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('document/category/' + categoryId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteDefinition = async (definitionId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('document/category/definition/' + definitionId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const createDefinition = async (categoryId: string, command: CreateDocumentDefinitionCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post(`document/category/${categoryId}/definition`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateDefinition = async (definitionId: string, command: UpdateDocumentDefinitionCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put(`document/category/${definitionId}/definition`, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        categoryList,
        definitionList,
        getDocumentCategories,
        getDocumentDefinitions,
        deleteDefinition,
        deleteCategory,
        createCategory,
        updateCategory,
        createDefinition,
        updateDefinition
    };
});