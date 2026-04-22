import { filteredAccountMenu, filteredMenu, getClaimPages, getModulePages, setMenuArray } from "@/core/menuPageManagement/moduleClaimUtils";
import freePages from "@/core/menuPageManagement/freePages";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import MainMenuConfig, { UserAccountMenu } from "@/layouts/default-layout/config/MainMenuConfig";
import i18n from "@/core/plugins/i18n";
import { userInfo } from "@/core/helpers/localStorageManagement";

export const notClaimRouterBeforeEach = (router) => {
    router.beforeEach((to, from, next) => {
        const authStore = useAuthStore();
        const configStore = useConfigStore();
        filteredMenu.value = MainMenuConfig;
        filteredAccountMenu.value = UserAccountMenu;
        configStore.resetLayoutConfig();
        document.title = `${i18n.global.t('menu.' + to.meta.pageTitle)}`;
        if (to.meta.middleware == "auth") {
            if (userInfo.value.employeeId || authStore.isAuthenticated) {
                next()
            } else {
                next({ name: "sign-in" });
            }
        } else if (to.meta.middleware == "notAuth") {
            if (userInfo.value.employeeId || authStore.isAuthenticated) {
                next({ name: 'home-dashboard' });
            } else {
                next()
            }
        } else {
            next()
        }
    });
}

export const hasClaimRouterBeforeEach = (router) => {
    router.beforeEach((to, from, next) => {
        const authStore = useAuthStore();
        const configStore = useConfigStore();
        const modulePages = getModulePages();
        const claimPages = getClaimPages();
        setMenuArray();
        configStore.resetLayoutConfig();

        document.title = `${i18n.global.t('menu.' + to.meta.pageTitle)}`;
        if (to.meta.middleware == "isAuth") {
            if (userInfo.value.employeeId || authStore.isAuthenticated) {
                const openPages = modulePages.concat(claimPages).concat(freePages)
                to.matched.map((item: any) => {
                    if (item.children.length == 0)
                        if (openPages.includes(item.name)) {
                            next();
                        } else {
                            if (to.params.id) {
                                const detail = to.matched.find((x: any) => x.path.includes('/:id')) ?? { name: 'home-dashboard' }
                                router.push({
                                    name: detail.name,
                                    params: detail.name != 'home-dashboard' ? { id: to.params.id } : {},
                                    replace: true,
                                });
                            } else {
                                const backRoute = item.meta.backRoute ? item.meta.backRoute : 'home-dashboard'
                                router.push({ name: backRoute, replace: true });
                            }
                        }
                })
            } else {
                next({ name: "sign-in" });
            }
        } else if (to.meta.middleware == "notAuth") {
            if (userInfo.value.employeeId || authStore.isAuthenticated) {
                next({ name: 'home-dashboard' });
            } else {
                next()
            }
        } else {
            next()
        }
    });
}