import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchError, createOrUpdateResponse, deleteResponse } from "@/core/helpers/generalResponse";
import { mapQueryString } from "@/core/helpers/generalUtils";
import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList } from "@/models/ApiResult";
import { CreateAssignmentsForEmployeesCommand, UpdateAssignmentsCommand, CreateOrUpdateTrainingCommand, GetTrainingDto, TrainingAssignmentsDto } from "@/models/entities/humanResource/TrainingModels";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTrainingStore = defineStore("training", () => {
    const loading = ref(false)
    const trainingAssignmentsList = ref({} as PaginatedList<TrainingAssignmentsDto>);
    const trainingList = ref({} as PaginatedList<GetTrainingDto>);
    const trainingDetail = ref(new GetTrainingDto());

    const getTrainingList = async (filterQuery: any): Promise<PaginatedList<GetTrainingDto>> => {
        try {
            loading.value = true;
            trainingList.value = {} as PaginatedList<GetTrainingDto>;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<GetTrainingDto>>> = await ApiService.get(`trainings${queryString}`);
            if (res.data.data) {
                trainingList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTrainingList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getTrainingDetail = async (filterQuery: any): Promise<PaginatedList<GetTrainingDto>> => {
        try {
            loading.value = true;
            trainingDetail.value = new GetTrainingDto();
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<GetTrainingDto>>> = await ApiService.get(`trainings${queryString}`);
            if (res.data.data) {
                if (res.data.data.items)
                    trainingDetail.value = res.data.data.items[0];
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTrainingList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getTrainingAssignments = async (filterQuery: any): Promise<PaginatedList<TrainingAssignmentsDto>> => {
        try {
            loading.value = true;
            trainingAssignmentsList.value = {} as PaginatedList<TrainingAssignmentsDto>;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<TrainingAssignmentsDto>>> = await ApiService.get('trainings/assignments' + queryString);
            if (res.data.data) {
                trainingAssignmentsList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getTrainingAssignments(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const updateTraining = async (id: string, command: CreateOrUpdateTrainingCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('trainings/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }
    const createTraining = async (command: CreateOrUpdateTrainingCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('trainings', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteTraining = async (trainingId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('trainings/' + trainingId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateTrainingAssignments = async (id: string, command: UpdateAssignmentsCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('trainings/' + id + '/assignments/', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const createTrainingAssignmentsForEmployees = async (command: CreateAssignmentsForEmployeesCommand, trainingId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('trainings/' + trainingId + '/assignments', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteTrainingAssignments = async (trainingId: string, assignmentId: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('trainings/' + trainingId + '/assignments/' + assignmentId);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        loading,
        trainingList,
        trainingDetail,
        trainingAssignmentsList,
        getTrainingList,
        updateTrainingAssignments,
        getTrainingDetail,
        deleteTrainingAssignments,
        createTraining,
        updateTraining,
        deleteTraining,
        getTrainingAssignments,
        createTrainingAssignmentsForEmployees
    };
});
