import ApiService from "@/core/services/ApiService";
import type { ApiResult } from "@/models/ApiResult";
import type { CreateApprovalProcessCommand, UpdateApprovalProcessCommand } from "@/models/entities/approvalProcess/ApprovalProcessCommands";
import type { ApprovalProcessDto } from "@/models/entities/approvalProcess/ApprovalProcessDtos";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import i18n from '@/core/plugins/i18n';
const t = i18n.global.t;

export const useApprovalProcessStore = defineStore("aprovalProcess", () => {
    const loading = ref(false);
    const approvalProcessList = ref([] as ApprovalProcessDto[]);
    const initApprovalProcessList = ref([] as ApprovalProcessDto[]);

    const getProcessList = async (): Promise<ApprovalProcessDto[]> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<ApprovalProcessDto[]>> = await ApiService.get('approval-processes');
            if (res.data.data) {
                approvalProcessList.value = JSON.parse(JSON.stringify(res.data.data));
                initApprovalProcessList.value = JSON.parse(JSON.stringify(res.data.data));
                initApprovalProcessList.value.unshift({
                    id: "0",
                    name: t("general.defaultApprovalProcess"),
                    isPrivate: false,
                    approvers: [{
                        order: 1,
                        approver: {
                            id: '0',
                            avatarUrl: '',
                            workEmail: '',
                            firstName: 'Yönetici',
                            lastName: ' ',
                            fullName: '',
                            positionName: ''
                        },
                        replacedFor: {
                            id: '0',
                            avatarUrl: '',
                            workEmail: '',
                            firstName: 'Yönetici',
                            lastName: ' ',
                            fullName: '',
                            positionName: ''
                        }
                    }]
                })
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return catchError(error, () => getProcessList());
        } finally {
            loading.value = false;
        }
    }

    const createApprovalProcess = async (command: CreateApprovalProcessCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('approval-processes', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const updateApprovalProcess = async (approvalProcessId: string, command: UpdateApprovalProcessCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('approval-processes/' + approvalProcessId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    const deleteApprovalProcess = async (approvalProcessId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('approval-processes/' + approvalProcessId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error)
        }
    }

    return {
        loading,
        approvalProcessList,
        initApprovalProcessList,
        getProcessList,
        createApprovalProcess,
        updateApprovalProcess,
        deleteApprovalProcess
    };
});
