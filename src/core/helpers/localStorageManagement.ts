import type { SignInResponse } from "@/models/entities/user/UserCommands";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { EmployeeDetailDto } from "@/models/entities/humanResource/EmployeeDtos";
export class UserInfoLocalStorage {
    constructor() {
        this.fullName = "";
        this.email = "";
        this.claims = new Array<string>();
        this.modules = new Array<string>();
        this.tenantId = null;
        this.userId = '';
        this.employeeId = '';
        this.employeeDetail = new EmployeeDetailDto();
    }
    fullName: string;
    email: string;
    tenantId: string | null;
    userId: string;
    employeeId: string;
    claims: Array<string>;
    modules: Array<string>;
    employeeDetail: EmployeeDetailDto;
}

const USER_INFO = "user_info" as string;
export const DASHBOARD_LAYOUTS = 'dashboard_layouts' as string;
export const LAYOUT_VERSION = 2 as number;

export const userInfo = ref(new UserInfoLocalStorage());


export const setUserInfoLocalStorage = (user: SignInResponse) => {
    if (!user.employeeId) { // logout işlemi yapılmışsa burası çalışır.
        userInfo.value.employeeDetail = {} as EmployeeDetailDto;
    }
    Object.entries(user).forEach(([key, value]) => {
        userInfo.value[key] = value;
    });
    localStorage.setItem(USER_INFO, JSON.stringify(userInfo.value))
}

export const getUserInfo = (): UserInfoLocalStorage => {
    if (localStorage.getItem(USER_INFO)) {
        const user = localStorage.getItem(USER_INFO) ?? '';
        userInfo.value = JSON.parse(user);
        return JSON.parse(user)
    }
    else {
        useAuthStore().logout();
        return new UserInfoLocalStorage()
    }
}

export const getClaimArray = (): Array<string> => {
    const user = getUserInfo();
    return user.claims
}

export const getModuleArray = (): Array<string> => {
    const user = getUserInfo();
    return user.modules;
}

export const hasClaimOrModules = (claims: Array<string>) => {
    const claimArray = getClaimArray();
    const moduleArray = getModuleArray();
    const resultClaim = claimArray.some((claim: string) => claims.includes(claim));
    const resultModule = moduleArray.some((claim: string) => claims.includes(claim));
    return resultClaim || resultModule;
};

export const setDashboardLayouts = (layouts: any) => {
    localStorage.setItem(DASHBOARD_LAYOUTS + '_v' + LAYOUT_VERSION, JSON.stringify(layouts));
}

export const getDashboardLayouts = (): any => {
    if (localStorage.getItem(DASHBOARD_LAYOUTS + '_v' + LAYOUT_VERSION)) {
        const layouts = localStorage.getItem(DASHBOARD_LAYOUTS + '_v' + LAYOUT_VERSION) ?? '';
        return JSON.parse(layouts)
    } else {
        return null;
    }
}
export const clearPastDashboardLayouts = () => {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(DASHBOARD_LAYOUTS)) {
            // Versiyon numarasını yakala (örnek: "_v1", "_v2")
            const match = key.match(/_v(\d+)$/);
            if (match) {
                const version = parseInt(match[1], 10);
                if (version != LAYOUT_VERSION) {
                    localStorage.removeItem(key);
                }
            } else {
                // Versiyon içermeyen eski formatları da silebilirsin
                localStorage.removeItem(key);
            }
        }
    });
};