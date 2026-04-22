import { ref } from "vue";
import ApiService from "./ApiService";
import { useAuthStore } from "@/stores/auth";
import { failedQueue } from "../helpers/generalResponse";

export const pendingRequestLength = ref(0);

if (!sessionStorage.getItem('failedLog') || !sessionStorage.getItem('notFailedLog')) {
  sessionStorage.setItem('failedLog', JSON.stringify(new Array<PendingRequestDto>))
  sessionStorage.setItem('notFailedLog', JSON.stringify(new Array<PendingRequestDto>))
}

export const pendingRequestList = ref(new Array<PendingRequestDto>);
export const failedRequestList = ref(JSON.parse(sessionStorage.getItem('failedLog') ?? ''));
export const notFailedRequestList = ref(JSON.parse(sessionStorage.getItem('notFailedLog') ?? ''));

export let isRefreshing = false;

export const RequestHandler = async (request) => {
  const requestItem = createRequestItem(request);
  const requestHistory = findRequestItem(requestItem);
  pendingRequestLength.value++;
  pendingRequestList.value.push(requestItem);

  return request
}

export const ErrorRequestHandler = async (error) => {
  pendingRequestLength.value--
  const requestItem = createRequestItem(error.config, error)

  const requestHistory = findRequestItem(requestItem)
  if (requestHistory) {
    requestHistory.isFinish = true;
    failedRequestList.value.push(requestItem)
  }
  setSessionStorage()
  return error
}

export const ResponseHandler = async (response) => {
  pendingRequestLength.value--
  const requestItem = createRequestItem(response.config)

  const requestHistory = findRequestItem(requestItem)
  if (requestHistory) {
    requestHistory.isFinish = true;
    notFailedRequestList.value.push(requestItem)
  }

  setSessionStorage();
  return response
}

export const ErrorResponseHandler = async (error) => {
  pendingRequestLength.value--;
  if (error.response) {

    const requestItem = createRequestItem(error.config, error)
    const requestHistory = findRequestItem(requestItem)

    if (requestHistory) {
      requestHistory.isFinish = true;
      failedRequestList.value.push(requestItem)
    }

    if (error.response.status === 401 && !isRefreshing) {

      isRefreshing = true;
      try {
        await useAuthStore().refreshToken();

        failedQueue.value.forEach(element => element());

        return Promise.reject(error);

      } catch (error) {
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Eğer 401 hatası alındı ama token yenilenemedi ya da başka bir hata varsa
    if (error.response.status === 401 && error.request.responseURL.includes("refreshToken")) {
      ApiService.vueInstance.config.globalProperties.$router.push({ name: "sign-in" });
      return Promise.reject(error);
    }
  }

  setSessionStorage();
  return Promise.reject(error);
}

export class PendingRequestDto {
  constructor() {
    this.requestUrl = ""
    this.isFinish = false
    this.method = ""
    this.error = null
  }
  requestUrl: string
  isFinish: boolean
  method: string
  error: any | null
}

const createRequestItem = (config: any, error?: any) => {
  return { requestUrl: config.baseURL + '/' + config.url, isFinish: false, method: config.method, error: error, curl: getCurl(config) }
}

const getCurl = (config: any) => {
  let curlCommand = `curl '${config.baseURL}/${config.url}'` + ' \\' + '\n';
  curlCommand += `  -X '${config.method?.toUpperCase()}'` + ' \\' + '\n';
  if (config.headers) {
    Object.keys(config.headers).forEach((key) => {
      if (config.headers[key] != null)
        curlCommand += `  -H '${key}: ${config.headers[key]}'` + ' \\' + '\n';
    });
  }
  if (config.data) {
    curlCommand += `  --data-raw ${JSON.stringify(config.data)}`;
  }
  return curlCommand;
}

const findRequestItem = (requestItem: any) => {
  return pendingRequestList.value.find((x: PendingRequestDto) => x.requestUrl == requestItem.requestUrl && x.method == requestItem.method);
}

const setSessionStorage = () => {
  sessionStorage.setItem('failedLog', JSON.stringify(failedRequestList.value))
  sessionStorage.setItem('notFailedLog', JSON.stringify(notFailedRequestList.value))
}