import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import { mapQueryString } from '@/core/helpers/generalUtils';
import ApiService from '@/core/services/ApiService';
import type { ApiResult, GeneralFileResponse } from '@/models/ApiResult';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';

export const useFileStore = defineStore('fileStore', () => {

    const downloadFile = async (query: any) => {
        try {
            const queryString = mapQueryString(query);

            const res: AxiosResponse<ApiResult<string>> = await ApiService.get('fileStorage/download' + queryString);
            if (res.data) {
                // ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.resolve(res);
            } else {
                // ErrorStatusResult[res.status]({ message: res.data.message });
                // return Promise.reject(res.data.message);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const uploadFiles = async (command: any) => {
        try {
            // todo: employee avatar ve fiş belgeleri backendi yapıldı
            const res: AxiosResponse<ApiResult<GeneralFileResponse>> = await ApiService.post('fileStorage/upload', command);
            if (res.data.data) {
                ErrorStatusResult[res.status]();
                return Promise.resolve(res.data.data);
            } else {
                ErrorStatusResult[res.status]({ message: res.data.message });
                return Promise.reject(res.data.message);
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    const uploadFileBase64 = async (command: any) => {
        try {
            const res: AxiosResponse<ApiResult<string>> = await ApiService.post('fileStorage/uploadBase64', command);
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
    return {
        uploadFiles,
        uploadFileBase64,
        downloadFile
    };
});
