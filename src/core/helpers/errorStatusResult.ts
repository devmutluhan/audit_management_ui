import { useMainStore } from "@/stores/mainStore";

const defaultModels: { [key: number]: ChangeProp } = {
    200: {
        icon: "mdi-emoticon-happy-outline",
        iconColor: "success",
        snackbarColor: "success",
        title: "statusCode.successTitle",
        message: "statusCode.successDescription",
        timeout: '2000'
    },
    204: {
        icon: "mdi-emoticon-happy-outline",
        iconColor: "success",
        snackbarColor: "success",
        title: "statusCode.successTitle",
        message: "statusCode.successDescription",
        timeout: '2000'
    },
    400: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error400Title",
        message: "statusCode.error400Description",
        timeout: '2000'
    },
    401: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error401Title",
        message: "statusCode.error401Description",
        timeout: '2000'
    },
    403: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error403Title",
        message: "statusCode.error403Description",
        timeout: '2000'
    },
    404: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error404Title",
        message: "statusCode.error404Description",
        timeout: '2000'
    },
    405: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error405Title",
        message: "statusCode.error405Description",
        timeout: '2000'
    },
    409: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error409Title",
        message: "statusCode.error409Description",
        timeout: '2000'
    },
    422: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error422Title",
        message: "statusCode.error422Description",
        timeout: '2000'
    },
    429: {
        icon: "mdi-alert-circle-outline",
        iconColor: "error",
        snackbarColor: "warning",
        title: "statusCode.error429Title",
        message: "statusCode.error429Description",
        timeout: '2000'
    },
    500: {
        icon: "mdi-emoticon-sad-outline",
        iconColor: "error",
        snackbarColor: "error",
        title: "statusCode.error500Title",
        message: "statusCode.error500Description",
        timeout: '2000'
    },
    503: {
        icon: "mdi-emoticon-sad-outline",
        iconColor: "error",
        snackbarColor: "error",
        title: "statusCode.error503Title",
        message: "statusCode.error503Description",
        timeout: '2000'
    },
    999: {
        icon: "mdi-alert-box-outline",
        iconColor: "error",
        snackbarColor: "error",
        title: "statusCode.generalErrorTitle",
        message: "statusCode.generalErrorDescription",
        timeout: '2000'
    },
};

function setResponseResult(status: number, changeProp?: ChangeProp, response?: any) {
    const mainStore = useMainStore();
    const defaultModel = defaultModels[status] || defaultModels[999];
    let responseModel: ChangeProp = {
        ...defaultModel,
        ...changeProp,
        buttonAction: changeProp?.buttonAction || defaultButtonAction,
    };
    if (response !== undefined && response !== '' && response !== null) { // Eğer response yollandıysa ve doluysa
        if (response.isSuccess === false && (status == 200 || status == 204)) { // İstek başarılı 200 dönmüş ancak isSuccess false geliyorsa
            responseModel.message = 'statusCode.' + response.message;
        } else if (response.isSuccess === true && (status == 200 || status == 204)) { // İstek başarılı 200 dönmüş ve isSuccess true geliyorsa
            responseModel.message = defaultModels[200].message;
        } else { // Hata varsa
            if (response.errors) { // errors geliyorsa hata mesajını errors'dan al
                const firstObjectKey = Object.keys(response.errors)[0];
                responseModel.message = 'statusCode.' + response.errors[firstObjectKey][0].code + `*${firstObjectKey}`;
            } else { // errors yoksa
                responseModel.message = 'statusCode.' + response.code;
            }
        }
    }
    // response message backendden undefined gelirse yine default message basılıyor. 
    if (!responseModel?.message) {
        responseModel.message = defaultModel.message;
    }
    mainStore.setResponseResultModel(responseModel);
    if (status !== 401)
        mainStore.setResponseResultSheet(true);
}

export const ErrorStatusResult: { [key: number | string]: (changeProp?: ChangeProp, response?: any) => void } = {
    200: (changeProp?: ChangeProp, response?: any) => setResponseResult(200, changeProp, response),
    204: (changeProp?: ChangeProp, response?: any) => setResponseResult(204, changeProp, response),
    400: (changeProp?: ChangeProp, response?: any) => setResponseResult(400, changeProp, response),
    401: (changeProp?: ChangeProp, response?: any) => setResponseResult(401, changeProp, response),
    403: (changeProp?: ChangeProp, response?: any) => setResponseResult(403, changeProp, response),
    404: (changeProp?: ChangeProp, response?: any) => setResponseResult(404, changeProp, response),
    405: (changeProp?: ChangeProp, response?: any) => setResponseResult(405, changeProp, response),
    409: (changeProp?: ChangeProp, response?: any) => setResponseResult(409, changeProp, response),
    422: (changeProp?: ChangeProp, response?: any) => setResponseResult(422, changeProp, response),
    429: (changeProp?: ChangeProp, response?: any) => setResponseResult(429, changeProp, response),
    500: (changeProp?: ChangeProp, response?: any) => setResponseResult(500, changeProp, response),
    503: (changeProp?: ChangeProp, response?: any) => setResponseResult(503, changeProp, response),
    999: (changeProp?: ChangeProp, response?: any) => setResponseResult(999, changeProp, response),
};

export class ResponseResultModel {
    icon: string;
    iconColor: string;
    title: string;
    message: string;
    snackbarColor: string;
    buttonText: string;
    buttonAction: () => void;
    timeout: string;

    constructor() {
        this.icon = 'mdi-emoticon-sad-outline';
        this.iconColor = 'error';
        this.snackbarColor = 'error';
        this.title = 'statusCode.generalErrorTitle';
        this.message = 'statusCode.generalErrorDescription';
        this.buttonText = '';
        this.buttonAction = defaultButtonAction;
        this.timeout = '2000'
    }
}

export interface ChangeProp {
    icon?: string;
    iconColor?: string;
    snackbarColor?: string;
    title?: string;
    message?: string;
    buttonText?: string;
    buttonAction?: () => void;
    timeout?: string
}

const defaultButtonAction = () => {
    useMainStore().setResponseResultSheet(false);
};