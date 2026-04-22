import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import { SignInCommand, SignInResponse, PreSignInCommand, PreSignInResponse } from "@/models/entities/user/UserCommands";
import type { ApiResult, Result } from "@/models/ApiResult";
import type { AxiosResponse } from "axios";
import router from "@/router";
import { ErrorStatusResult } from "@/core/helpers/errorStatusResult";
import { catchErrorAuth, createOrUpdateResponse } from "@/core/helpers/generalResponse";
import { setUserInfoLocalStorage } from "@/core/helpers/localStorageManagement";
import { isMobileApp } from "@/assets/ts/_utils";
import { PlatformTypeEnum } from "@/models/custom/EnumTypes";

export const useAuthStore = defineStore("auth", () => {
  const user = ref({} as SignInResponse);
  const preLoginResponse = ref({} as PreSignInResponse);
  const isAuthenticated = ref(false);
  const loading = ref(false);

  const setAuth = (authUser: SignInResponse) => {
    isAuthenticated.value = true;
    user.value = authUser;
    setUserInfoLocalStorage(user.value)
  };


  const purgeAuth = () => {
    isAuthenticated.value = false;
    user.value = {} as SignInResponse;
    setUserInfoLocalStorage(new SignInResponse())
  }

  const preLogin = async (preSignInCommand: PreSignInCommand) => {
    try {
      loading.value = true;
      const res: AxiosResponse<ApiResult<PreSignInResponse>> = await ApiService.post('users/preSignIn', preSignInCommand)
      if (res.data.data) {
        preLoginResponse.value = res.data.data
        if (res.data.data.tenants.length == 1) {
          login({ email: preSignInCommand.email, password: preSignInCommand.password, tenantId: res.data.data.tenants[0].id, platformType: 0 });
        }
        else {
          router.push({ name: "select-tenant" });
          loading.value = false;
        }
      }
      else {
        ErrorStatusResult[res.status]({ message: res.data.message });
        loading.value = false;
      }
    } catch (error) {
      loading.value = false;
      return catchErrorAuth(error);
    }
  }

  const login = async (signInCommand: SignInCommand) => {
    try {
      loading.value = true;
      signInCommand.platformType = isMobileApp() ? PlatformTypeEnum.Mobile : PlatformTypeEnum.Web
      const res: AxiosResponse<ApiResult<SignInResponse>> = await ApiService.post('users/signIn', signInCommand);
      router.push({ name: "dashboard" });
      setAuth(res.data.data);
      return createOrUpdateResponse(res);
    } catch (error) {
      return catchErrorAuth(error);
    } finally {
      loading.value = false;
    }
  }

  const refreshToken = async () => {
    try {
      const platformType = isMobileApp() ? PlatformTypeEnum.Mobile : PlatformTypeEnum.Web;
      const res: AxiosResponse<ApiResult<SignInResponse>> = await ApiService.post('users/refreshToken', { platformType: platformType });
      if (res.data.data) {
        setAuth(res.data.data);
        return Promise.resolve(res.data.data);
      } else {
        ErrorStatusResult[res.status]({ message: res.data.message });
        logout();
        return Promise.reject(res.data.message);
      }
    } catch (error) {
      logout();
      return catchErrorAuth(error);
    }
  }

  const signOut = async () => {
    try {
      const res: AxiosResponse<ApiResult<SignInResponse>> = await ApiService.post('users/signOut', {});
      if (res.data.isSuccess) {
        logout();
        router.push({ name: "sign-in" });
        return Promise.resolve(res.data.data);
      } else {
        ErrorStatusResult[res.status]({ message: res.data.message });
        return Promise.reject(res.data.message);
      }
    } catch (error) {
      return catchErrorAuth(error);
    }
  }

  const logout = () => {
    localStorage.removeItem('user_info');
    sessionStorage.removeItem('create-offer-info');
    router.push({ name: "sign-in" });
    purgeAuth();
  }

  const acceptInvite = async (command: any) => {
    try {
      loading.value = true;
      const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('users/invite/accept', command);
      if (res.data.data) {
        router.push({ name: "sign-in" });
        ErrorStatusResult[res.status]();
        return Promise.resolve(res.data.data);
      } else {
        ErrorStatusResult[res.status]({ message: res.data.message });
        return Promise.reject(res.data.message);
      }
    } catch (error) {
      return catchErrorAuth(error);
    } finally {
      loading.value = false;
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      loading.value = true;
      const res: AxiosResponse<ApiResult<PreSignInResponse>> = await ApiService.post('users/' + email + '/forgotPassword', {})
      ErrorStatusResult[res.status]();
    } catch (error) {
      return catchErrorAuth(error);
    } finally {
      loading.value = false;
    }
  }

  const resetPassword = async (command: any) => {
    try {
      loading.value = true;
      const res: AxiosResponse<ApiResult<Result>> = await ApiService.post('users/resetPassword', command);
      if (res.data.isSuccess) {
        router.push({ name: "sign-in" });
        ErrorStatusResult[res.status]();
        return Promise.resolve(res.data);
      } else {
        ErrorStatusResult[res.status]({ message: res.data.message });
        return Promise.reject(res.data.message);
      }
    } catch (error) {
      return catchErrorAuth(error);
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    isAuthenticated,
    preLoginResponse,
    loading,
    acceptInvite,
    preLogin,
    login,
    signOut,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken
  };
});

