import assetsRouter from "@/router/routerItems/assetsRouter";
import crmRouter from "@/router/routerItems/crmRouter";
import customerRouter from "@/router/routerItems/customerRouter";
import definitionsRouter from "@/router/routerItems/definitionsRouter";
import humanResourcesRouter from "@/router/routerItems/humanResourcesRouter";

export const filterClaimPages = (pagesList: Array<string>, filterPages: Array<string>) => {
    return pagesList.filter((x: string) => !filterPages.some((a: string) => x.includes(a)));;
}

const customerRouterPages = (router: any): Array<string> => {
    const pages = new Array<string>();
    const childRoute = (route: any) => {
        route.children.forEach((element: any) => {
            if (element.children)
                childRoute(element);
            pages.push(element.name)
        });
    }

    if (router.children) {
        router.children.forEach((element: any) => {
            if (element.children)
                childRoute(element);
            pages.push(element.name)
        });
    }
    pages.push(router.name);
    return pages;
}

export const hrRouterPages = (router: any, filterNamed: string[]): Array<string> => {
    const pages = new Array<string>();
    const childRoute = (route: any) => {
        route.children.forEach((element: any) => {
            if (element.children)
                childRoute(element);

            if (!filterNamed.some((a) => element.name.includes(a)))
                pages.push(element.name)
        });
    }

    if (router.children) {
        router.children.forEach((element: any) => {
            if (element.children)
                childRoute(element);

            if (!filterNamed.some((a) => element.name.includes(a)))
                pages.push(element.name)
        });
    }

    if (!filterNamed.some((a) => router.name.includes(a)))
        pages.push(router.name);

    return pages;
}

export const CustomerPages = customerRouterPages(customerRouter);
export const CrmPages = customerRouterPages(crmRouter);
export const GeneralDefinitionPages = customerRouterPages(definitionsRouter);

export const HrEmployeePages = hrRouterPages(humanResourcesRouter, ['vacation', 'payment', 'asset', 'training', 'poll', 'performance']);
export const HrVacationPages = hrRouterPages(humanResourcesRouter, ['payment', 'employee', 'asset', 'training', 'poll', 'performance']);
export const HrAssetPages = hrRouterPages(humanResourcesRouter, ['vacation', 'employee', 'payment', 'training', 'poll', 'performance']);
export const HrPaymentPages = hrRouterPages(humanResourcesRouter, ['vacation', 'employee', 'asset', 'training', 'poll', 'performance']);
export const HrTrainingPages = hrRouterPages(humanResourcesRouter, ['vacation', 'employee', 'asset', 'payment', 'poll', 'performance']);
export const PollPages = hrRouterPages(humanResourcesRouter, ['vacation', 'employee', 'asset', 'payment', 'training', 'performance']);
export const PerformancePages = hrRouterPages(humanResourcesRouter, ['vacation', 'employee', 'asset', 'payment', 'training', 'poll']);

export const CrmDefinitionPages = hrRouterPages(crmRouter, ['agreement', 'offer', 'project'])
export const CrmOfferPages = hrRouterPages(crmRouter, ['agreement', 'service', 'definition', 'project']);
export const CrmAgreementPages = hrRouterPages(crmRouter, ['offer', 'service', 'definition', 'project']);
export const CrmProjectPages = hrRouterPages(crmRouter, ['offer', 'service', 'definition', 'agreement']);
export const AssetPages = hrRouterPages(assetsRouter, []);