import type { App } from "vue";
import type { AxiosResponse } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import type { Result } from "@/models/ApiResult";
import { ErrorRequestHandler, ErrorResponseHandler, RequestHandler, ResponseHandler } from "@/core/services/ServiceSettings"
import { commandStringTrimFunc } from "../helpers/generalUtils";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.setHeader();
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.withCredentials = true;
    ApiService.vueInstance.axios.interceptors.request.use(
      async (request) => RequestHandler(request),
      async (error) => ErrorRequestHandler(error)
    );

    ApiService.vueInstance.axios.interceptors.response.use(
      async (response) => ResponseHandler(response),
      async (error) => ErrorResponseHandler(error)
    );
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
    ApiService.vueInstance.axios.defaults.headers.common["Accept-Language"] =
      "tr,en;q=0.9,en-GB;q=0.8,tr-TR;q=0.7";
    // ApiService.vueInstance.axios.defaults.headers.common["Content-Type"] =
    //   "application/json"; // bu kodu açınca fileType bozuluyor 415 dönüyor ona göre
    // ApiService.vueInstance.axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${JwtService.getToken()}`;
    // ApiService.vueInstance.axios.defaults.headers.common["Origin"] =
    //   import.meta.env.VITE_APP_LOCAL_NAME;
    // ApiService.vueInstance.axios.defaults.headers.common["Referer"] =
    //   import.meta.env.VITE_APP_LOCAL_NAME;

  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(resource: string, params: any): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    slug = "" as string
  ): Promise<AxiosResponse> {
    if (slug == "")
      return ApiService.vueInstance.axios.get(`${resource}`);
    else
      return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(resource: string, params: any): Promise<AxiosResponse> {
    const trimParams = commandStringTrimFunc(params);
    const config: any = {};
    if (typeof trimParams === 'string') {
      config.headers = { "Content-Type": "application/json" };
    }
    return ApiService.vueInstance.axios.post(`${resource}`, trimParams, config).then((response) => {
      if (response.status === 204) {
        response.data = { data: {} as Result }
      }
      return response;
    });
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any
  ): Promise<AxiosResponse> {
    const trimParams = commandStringTrimFunc(params);
    const config: any = {};
    if (typeof trimParams === 'string') {
      config.headers = { "Content-Type": "application/json" };
    }
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, trimParams, config).then((response) => {
      if (response.status === 204) {
        response.data = { data: {} as Result }
      }
      return response;
    });
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(resource: string, params: any): Promise<AxiosResponse> {
    const trimParams = commandStringTrimFunc(params);
    return ApiService.vueInstance.axios.put(`${resource}`, trimParams).then((response) => {
      if (response.status === 204) {
        response.data = { data: {} as Result }
      }
      return response;
    });;
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource).then((response) => {
      if (response.status === 204) {
        response.data = { data: {} as Result, isSuccess: true }
      }
      return response;
    });
  }
}

export default ApiService;
