import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import type { CreateTemplatesCommand, UpdateTemplatesCommand } from "@/models/entities/user/UserCommands";
import type { ApiResult, LookupDto } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import type { InviteHistoryDto, TemplatesDto } from "@/models/entities/user/UserDtos";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, deleteResponse } from "@/core/helpers/generalResponse";

export const useUserStore = defineStore("user", () => {
    const templateList = ref([] as TemplatesDto[]);
    const userClaimCardList = ref([] as LookupDto[]);
    const userInviteHistory = ref([] as InviteHistoryDto[])
    const loading = ref(false)

    const getTemplates = async (): Promise<TemplatesDto[]> => {
        try {
            templateList.value = [] as TemplatesDto[];
            loading.value = true;
            const res: AxiosResponse<ApiResult<TemplatesDto[]>> = await ApiService.get('users/templates');

            if (res.data.data) {
                templateList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return catchError(error, () => getTemplates());
        } finally {
            loading.value = false
        }
    }

    const getTemplatesFromUser = async (employeeId: string): Promise<LookupDto[]> => {
        try {
            userClaimCardList.value = [] as LookupDto[];
            loading.value = true
            const res: AxiosResponse<ApiResult<LookupDto[]>> = await ApiService.get('users/' + employeeId + '/templates');
            if (res.data.data) {
                userClaimCardList.value = res.data.data
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return catchError(error, () => getTemplates());
        } finally {
            loading.value = false
        }
    }

    const getInviteUserHistory = async (employeeId: string): Promise<InviteHistoryDto[]> => {
        try {
            userInviteHistory.value = [] as InviteHistoryDto[];
            loading.value = true
            const res: AxiosResponse<ApiResult<InviteHistoryDto[]>> = await ApiService.get('users/' + employeeId + '/invitationhistory');
            if (res.data.data) {
                userInviteHistory.value = res.data.data
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return catchError(error, () => getTemplates());
        } finally {
            loading.value = false
        }
    }

    const createTemplates = async (command: CreateTemplatesCommand) => {
        try {
            const res: AxiosResponse<ApiResult<TemplatesDto>> = await ApiService.post('users/templates', command);
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const assignTemplatesToUser = async (employeeId: string, templateIds: Array<string>) => {
        try {
            const res: AxiosResponse<ApiResult<TemplatesDto>> = await ApiService.post('users/' + employeeId + '/templates/assign', { claimTemplateIds: templateIds });
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const updateTemplates = async (templatesId: string, command: UpdateTemplatesCommand) => {
        try {
            const res: AxiosResponse<ApiResult<TemplatesDto>> = await ApiService.put('users/templates/' + templatesId, command);
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const deleteClaimTemplates = async (templateId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('users/templates/' + templateId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const inviteUser = async (employeeId: string) => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('users/' + employeeId + '/invite', [employeeId]);
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const cancelInvite = async (employeeId: string) => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('users/invitation/cancel', { employeeId: employeeId });
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const blockedUser = async (employeeId: string) => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('users/' + employeeId + '/block', {});
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const confirmUser = async (employeeId: string) => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('users/' + employeeId + '/confirm', {});
            if (res.data.data) {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        templateList,
        userClaimCardList,
        userInviteHistory,
        loading,
        assignTemplatesToUser,
        deleteClaimTemplates,
        blockedUser,
        confirmUser,
        getTemplatesFromUser,
        inviteUser,
        getInviteUserHistory,
        cancelInvite,
        updateTemplates,
        createTemplates,
        getTemplates,
    };
});
