import ApiService from "@/core/services/ApiService";
import type { ApiResult, PaginatedList, SendToApprovementResponse } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { createOrUpdateResponse, deleteResponse, catchError } from "@/core/helpers/generalResponse";
import { ApproveOfferCommand, CheckConflictCommand, CheckConflictResponse, CreateOfferCommand, CreateOfferRequest, OfferItemCommand, UpdateOfferInfoCommand } from "@/models/entities/crm/CrmOfferCommands";
import { OfferDetailDto, OfferItemDto, OfferListDto } from "@/models/entities/crm/CrmOfferDtos";
import { mapQueryString } from "@/core/helpers/generalUtils";
import type { OfferRiskAnswersDto } from "@/models/entities/crm/CrmRiskFormModels";

export const useOfferStore = defineStore("offer", () => {
    const loading = ref(false);
    const createOfferCommand = ref(new CreateOfferRequest());
    const offerList = ref({} as PaginatedList<OfferListDto>)
    const offerDetail = ref(new OfferDetailDto());
    const offerApprovalRequestList = ref({} as PaginatedList<OfferListDto>);
    const selectedItemsForConvertAgreement = ref(new Array<OfferItemDto>())

    const getOfferList = async (filterQuery: any): Promise<PaginatedList<OfferListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<OfferListDto>>> = await ApiService.get(`crm/offers${queryString}`);
            if (res.data.data) {
                offerList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getOfferList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getOfferRequestList = async (filterQuery: any): Promise<PaginatedList<OfferListDto>> => {
        try {
            loading.value = true;
            const queryString = mapQueryString(filterQuery);
            const res: AxiosResponse<ApiResult<PaginatedList<OfferListDto>>> = await ApiService.get(`crm/offers/approval-requests${queryString}`);
            if (res.data.data) {
                offerApprovalRequestList.value = res.data.data;
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getOfferRequestList(filterQuery));
        } finally {
            loading.value = false;
        }
    }

    const getOfferDetail = async (offerId: string): Promise<OfferDetailDto> => {
        try {
            loading.value = true;
            offerDetail.value = new OfferDetailDto();
            const res: AxiosResponse<ApiResult<OfferDetailDto>> = await ApiService.get(`crm/offers/${offerId}`);
            if (res.data.data) {
                offerDetail.value = res.data.data;
                offerDetail.value.items.sort((a, b) => {
                    if (a.position === null && b.position !== null) {
                        return -1;
                    } else if (a.position !== null && b.position === null) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getOfferDetail(offerId));
        } finally {
            loading.value = false;
        }
    }

    const getOfferRiskAnswers = async (offerId: string): Promise<OfferRiskAnswersDto> => {
        try {
            loading.value = true;
            const res: AxiosResponse<ApiResult<OfferRiskAnswersDto>> = await ApiService.get(`crm/offers/${offerId}/risk-level`);
            if (res.data.data) {
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error: any) {
            return catchError(error, () => getOfferRiskAnswers(offerId));
        } finally {
            loading.value = false;
        }
    }

    const createOffer = async (command: CreateOfferCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/offers', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const checkConflict = async (command: CheckConflictCommand): Promise<ApiResult<Array<CheckConflictResponse>>> => {
        try {
            const res: AxiosResponse<ApiResult<Array<CheckConflictResponse>>> = await ApiService.post('crm/offers/check-conflicts', command);
            return Promise.resolve(res.data);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateOffer = async (command: UpdateOfferInfoCommand, id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/offers/' + id, command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const updateOfferItems = async (command: Array<OfferItemCommand>, id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.put('crm/offers/' + id + '/items', { items: command });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const deleteOffer = async (id: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.delete('crm/offers/' + id);
            return deleteResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const sendApproveOffer = async (id: string): Promise<ApiResult<SendToApprovementResponse>> => {
        try {
            const res: AxiosResponse<ApiResult<SendToApprovementResponse>> = await ApiService.post('crm/offers/' + id + '/approvement/send', {});
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const approveOffer = async (id: string, command: ApproveOfferCommand): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/offers/' + id + '/approvement/approve', command);
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const rejectOffer = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/offers/' + id + '/approvement/reject', { rejectionReason: reason });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const sendbackOffer = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/offers/' + id + '/approvement/sendback', { sendBackReason: reason });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    const cancelOffer = async (id: string, reason: string): Promise<ApiResult<string>> => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('crm/offers/' + id + '/cancel', { cancellationReason: reason });
            return createOrUpdateResponse(res);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    return {
        createOfferCommand,
        loading,
        offerList,
        offerApprovalRequestList,
        offerDetail,
        selectedItemsForConvertAgreement,
        deleteOffer,
        createOffer,
        updateOffer,
        getOfferRiskAnswers,
        checkConflict,
        getOfferDetail,
        updateOfferItems,
        getOfferList,
        sendApproveOffer,
        getOfferRequestList,
        approveOffer,
        cancelOffer,
        sendbackOffer,
        rejectOffer,
    };
});
