import type { ApiResult } from "@/models/ApiResult";
import { type ChangeProp, ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { ref } from "vue";
import { isRefreshing } from "@/core/services/ServiceSettings";

const failedQueue = ref([] as any)

const createOrUpdateResponse = (res: any, changeProp?: ChangeProp): Promise<ApiResult<any>> => {
    const changeProperty = changeProp ? changeProp : {};
    if (res.data.isSuccess && res.data.data) {
        ErrorStatusResult[res.status](changeProperty, res.data);
        return Promise.resolve(res.data);
    } else {
        if (res.status === 204) {
            ErrorStatusResult[res.status](changeProperty, {
                isSuccess: true,
                message: 'successDescription',
            });
            return Promise.resolve(res.data);
        } else {
            ErrorStatusResult[res.status]({}, res.data);
            return Promise.resolve(res.data.message);
        }
    }
}

const deleteResponse = (res: any, changeProp?: ChangeProp): Promise<ApiResult<string>> => {
    const changeProperty = changeProp ? changeProp : {};
    if (res.data.isSuccess) {
        ErrorStatusResult[res.status](changeProperty, res.data);
        return Promise.resolve(res.data);
    } else {
        ErrorStatusResult[res.status](changeProperty, res.data);
        return Promise.reject(res.data.message);
    }
}

const catchError = (error: any, returnRequest: () => void, changeProp?: ChangeProp): any => {
    if (error.response) {
        if (error.response.status === 401) {
            if (!error.config.url.includes('refreshToken')) {
                failedQueue.value.push(() => returnRequest())

                if (!isRefreshing) {
                    returnRequest();
                    failedQueue.value = [] as any
                }
            }
        }
        if (error.response.status !== 401) {
            const changeProperty = changeProp ? changeProp : {};
            ErrorStatusResult[error.response.status](changeProperty, error.response.data);
        }
        return Promise.reject(error);
    } else {
        ErrorStatusResult[500]();
        return Promise.reject(error)
    }
}


const catchErrorAuth = (error: any, changeProp?: ChangeProp): any => {
    const changeProperty = changeProp ? changeProp : {};
    if (error.response) {
        ErrorStatusResult[error.response.status](changeProperty, error.response.data);
    } else {
        ErrorStatusResult[500]({ message: error.message })
    }
    return Promise.reject(error);
}


export { createOrUpdateResponse, deleteResponse, catchError, catchErrorAuth, failedQueue };

