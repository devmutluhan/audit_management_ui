import type { MenuItem } from "@/layouts/default-layout/config/types";
import { ClaimsEnum, ModulesEnum } from "@/core/menuPageManagement/moduleAndClaimEnums";
import freePages from "@/core/menuPageManagement/freePages";
import MainMenuConfig, { UserAccountMenu } from "@/layouts/default-layout/config/MainMenuConfig";
import { ref } from "vue";
import { getClaimArray, getModuleArray, userInfo } from "../helpers/localStorageManagement";

const pagesToModules = new Array<string>();
let pagesToClaims = new Array<string>();

export const filteredMenu = ref(new Array<MenuItem>());
export const filteredAccountMenu = ref(new Array<any>());

export const getModulePages = () => {
    getModuleArray().map((item: any) => ModulesEnum[item] && ModulesEnum[item].map((i: string) => pagesToModules.push(i)));

    return pagesToModules;
}

export const getClaimPages = () => {
    pagesToClaims = new Array<string>()
    getClaimArray().map((item: any) => ClaimsEnum[item] && ClaimsEnum[item].map((i: string) => pagesToClaims.push(i)));

    return pagesToClaims;
}

export const filterMenu = (pages: Array<PagesType>): Array<PagesType> => {
    const filteredPage = new Array<PagesType>();
    pages.forEach((page: PagesType) => {
        const index = getClaimPages().findIndex((a: string) => a == page.to.name);
        if (index != -1) {
            filteredPage.push(page)
        }
    })
    return filteredPage;
}

export const setMenuArray = () => {
    const newMenu = new Array<MenuItem>();
    const newUserAccountMenu = new Array<any>();
    const isIncludeMethod = (routeName: string): boolean => {
        return pagesToModules.includes(routeName) || pagesToClaims.includes(routeName) || freePages.includes(routeName);
    }

    const hasSubItem = (menuItem: MenuItem): any => {
        const mainMenu = {
            sectionTitle: menuItem.sectionTitle,
            heading: menuItem.heading,
            bootstrapIcon: menuItem.bootstrapIcon,
            keenthemesIcon: menuItem.keenthemesIcon,
            route: menuItem.route,
            sub: menuItem.sub?.map((it: MenuItem) => {
                return subFilter(it)
            })
        };
        if (mainMenu.sub?.some((value) => value === undefined)) {
            mainMenu.sub = mainMenu.sub.filter((value) => value !== undefined)
        }
        return mainMenu
    }


    const subFilter = (menuItem: MenuItem): any => {
        if (isIncludeMethod(menuItem.route)) {
            if (menuItem.sub && menuItem.sub.length) {
                return hasSubItem(menuItem)
            } else {
                return menuItem
            }
        }
    };

    const menuFilter = (menuItems: MenuItem[]): MenuItem[] => {
        menuItems.forEach((item: MenuItem) => {
            if (isIncludeMethod(item.route)) {
                if (item.sub && item.sub.length > 0) {
                    newMenu.push(hasSubItem(item))
                } else {
                    newMenu.push(item)
                }
            }
        });
        return newMenu;
    };


    const filteredUserAccountMenu = (menuItems: any) => {
        menuItems.forEach((item: any) => {
            const childItems = new Array<any>()
            if (isIncludeMethod(item.route)) {
                if (item.children && item.children.length > 0) {
                    item.children.forEach((it: any) => {
                        if (isIncludeMethod(it.route)) {
                            childItems.push(it);
                        }
                    });
                    item.children = childItems
                    newUserAccountMenu.push(item)
                } else {
                    newUserAccountMenu.push(item)
                }
            }
        });
        return newUserAccountMenu;
    }

    if (userInfo.value.claims && userInfo.value.claims.length > 0) {
        filteredMenu.value = menuFilter(MainMenuConfig ?? new Array<MenuItem>());
        filteredAccountMenu.value = filteredUserAccountMenu(UserAccountMenu);
    }
}

interface PagesType {
    name: string;
    to: { name: string }
}