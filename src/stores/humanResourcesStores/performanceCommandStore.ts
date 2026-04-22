import { defineStore } from "pinia";
import type {
    CreatePeriodCommand,
    UpdatePeriodCommand,
    CreateCompetencyTemplateCommand,
    UpdateCompetencyTemplateCommand,
    UpdateReviewWeightsCommand,
    AssignRevieweesCommand,
    PeriodReviewCompetencySectionCommand,
    UpdateReviewGoalSectionCommand,
    CreateOrUpdateEvaluationTemplateCommand,
    ChangeEvaluationTemplateStatusCommand,
    RemoveRevieweesCommand
} from "@/models/entities/humanResource/PerformanceCommands";
import ApiService from "@/core/services/ApiService";
import type { AxiosResponse } from "axios";
import { createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import type { ApiResult } from "@/models/ApiResult";

export const usePerformanceCommandStore = defineStore("performanceCommand", () => {

    const createPeriod = async (command: CreatePeriodCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/period', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createEvaluationTemplate = async (command: CreateOrUpdateEvaluationTemplateCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/evaluation-template', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateEvaluationTemplate = async (id: string, command: CreateOrUpdateEvaluationTemplateCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('performance/evaluation-template/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const changeEvaluationTemplateStatus = async (id: string, command: ChangeEvaluationTemplateStatusCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/evaluation-template/' + id + '/change-status', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const startPerformancePeriod = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/period/' + id + '/start-goal-setting', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updatePeriod = async (id: string, command: UpdatePeriodCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('performance/period/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deletePeriod = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('performance/period/' + id);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const movePeriodToStatus = async (id: string, statusPayload: any): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/period/' + id + '/move-to-status', statusPayload);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createCompetencyTemplate = async (command: CreateCompetencyTemplateCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/competency-template', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateCompetencyTemplate = async (id: string, command: UpdateCompetencyTemplateCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('performance/competency-template/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const archiveCompetencyTemplate = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/competency-template/' + id + '/archive', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const activateCompetencyTemplate = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/competency-template/' + id + '/activate', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const completeToPeriod = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/period/' + id + '/complete-the-period', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateReviewWeights = async (periodId: string, command: UpdateReviewWeightsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('performance/reviews/' + periodId, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const assignReviewees = async (periodId: string, command: AssignRevieweesCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/reviews/' + periodId + '/assign-reviewees', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const removeReviewees = async (periodId: string, command: RemoveRevieweesCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/reviews/' + periodId + '/remove-reviewees', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const periodReviewCompetencySection = async (periodId: string, command: PeriodReviewCompetencySectionCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/reviews/' + periodId + '/competency-section', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createSyncGoal = async (reviewId: string, command: any): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('performance/reviews/' + reviewId + '/sync-goal', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        createPeriod,
        updatePeriod,
        deletePeriod,
        movePeriodToStatus,
        createCompetencyTemplate,
        updateCompetencyTemplate,
        archiveCompetencyTemplate,
        activateCompetencyTemplate,
        updateReviewWeights,
        startPerformancePeriod,
        createEvaluationTemplate,
        updateEvaluationTemplate,
        removeReviewees,
        changeEvaluationTemplateStatus,
        assignReviewees,
        periodReviewCompetencySection,
        completeToPeriod
    };
});