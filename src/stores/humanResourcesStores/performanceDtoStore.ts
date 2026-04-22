import { defineStore } from "pinia";
import { ref } from "vue";
import ApiService from "@/core/services/ApiService";
import type { AxiosResponse } from "axios";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";

import {
    PeriodDto,
    PeriodDetailDto,
    CompetencyTemplateDto,
    CompetencyTemplateDropdownDto,
    ReviewSummaryDto,
    PeriodCompetencyTemplateDto,
    EvaluationTemplateDto,
    GoalSectionForPeriodDto
} from "@/models/entities/humanResource/PerformanceDtos";

export const usePerformanceDtoStore = defineStore("performanceDto", () => {
    const loading = ref(false);

    const evaluationTempList = ref({} as PaginatedList<EvaluationTemplateDto>);

    const periodList = ref({} as PaginatedList<PeriodDto>);
    const periodDetail = ref(new PeriodDetailDto());
    const periodCompetencyTemplate = ref(new PeriodCompetencyTemplateDto());

    const periodReviewList = ref(new Array<ReviewSummaryDto>());
    const periodGoalSection = ref(new GoalSectionForPeriodDto());
    const competencyTemplateDetail = ref(new CompetencyTemplateDto());
    const competencyTemplateDropdownList = ref({} as PaginatedList<CompetencyTemplateDropdownDto>);

    const getPeriodList = async (filterQuery: any): Promise<PaginatedList<PeriodDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<PeriodDto>>> = await ApiService.get(`performance/period${queryString}`);
            if (res.data.data) {
                periodList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPeriodList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getEvaluationTemplateList = async (filterQuery: any): Promise<PaginatedList<EvaluationTemplateDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<EvaluationTemplateDto>>> = await ApiService.get(`performance/evaluation-template${queryString}`);
            if (res.data.data) {
                evaluationTempList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getEvaluationTemplateList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getPeriodDetail = async (id: string): Promise<PeriodDetailDto> => {
        try {
            loading.value = true;
            periodDetail.value = new PeriodDetailDto();
            const res: AxiosResponse<ApiResult<PeriodDetailDto>> = await ApiService.get(`performance/period/${id}`);
            if (res.data.data) {
                periodDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPeriodDetail(id));
        } finally {
            loading.value = false;
        }
    }

    const getPeriodReview = async (id: string): Promise<Array<ReviewSummaryDto>> => {
        try {
            loading.value = true;
            periodReviewList.value = new Array<ReviewSummaryDto>();
            const res: AxiosResponse<ApiResult<Array<ReviewSummaryDto>>> = await ApiService.get(`performance/reviews/${id}/summary`);
            if (res.data.data) {
                periodReviewList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPeriodReview(id));
        } finally {
            loading.value = false;
        }
    }

    const getPeriodCompetencySection = async (periodId: string): Promise<PeriodCompetencyTemplateDto> => {
        try {
            loading.value = true;
            periodCompetencyTemplate.value = new PeriodCompetencyTemplateDto();
            const res: AxiosResponse<ApiResult<PeriodCompetencyTemplateDto>> = await ApiService.get(`performance/competency-section/` + periodId);
            if (res.data.data) {
                periodCompetencyTemplate.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPeriodCompetencySection(periodId));
        } finally {
            loading.value = false;
        }
    }

    const getPeriodGoalSection = async (periodId: string): Promise<GoalSectionForPeriodDto> => {
        try {
            loading.value = true;
            periodGoalSection.value = new GoalSectionForPeriodDto();
            const res: AxiosResponse<ApiResult<GoalSectionForPeriodDto>> = await ApiService.get(`performance/goal-section/` + periodId);
            if (res.data.data) {
                periodGoalSection.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getPeriodCompetencySection(periodId));
        } finally {
            loading.value = false;
        }
    }

    const getCompetencyTemplateDetail = async (id: string): Promise<CompetencyTemplateDto> => {
        try {
            loading.value = true;
            competencyTemplateDetail.value = new CompetencyTemplateDto();
            const res: AxiosResponse<ApiResult<CompetencyTemplateDto>> = await ApiService.get(`performance/competency-template/${id}`);
            if (res.data.data) {
                competencyTemplateDetail.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCompetencyTemplateDetail(id));
        } finally {
            loading.value = false;
        }
    }

    const getCompetencyTemplateDropdownList = async (filterQuery: any): Promise<PaginatedList<CompetencyTemplateDropdownDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<CompetencyTemplateDropdownDto>>> = await ApiService.get(`performance/competency-template/dropdown${queryString}`);
            if (res.data.data) {
                competencyTemplateDropdownList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getCompetencyTemplateDropdownList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        periodList,
        periodDetail,
        evaluationTempList,
        competencyTemplateDetail,
        competencyTemplateDropdownList,
        periodReviewList,
        periodCompetencyTemplate,
        periodGoalSection,
        getPeriodList,
        getPeriodDetail,
        getPeriodReview,
        getEvaluationTemplateList,
        getCompetencyTemplateDetail,
        getPeriodGoalSection,
        getPeriodCompetencySection,
        getCompetencyTemplateDropdownList
    };
});