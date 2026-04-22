const crmRouter = {
    path: "/crm",
    name: "crm",
    component: () => import("@/views/crmViews/CrmView.vue"),
    meta: {
        pageTitle: "crm",
        breadcrumbs: ["crm"],
    },
    redirect: { name: "service-list" },
    children: [
        {
            path: "service",
            name: "service",
            component: () =>
                import("@/views/crmViews/serviceViews/ServiceView.vue"),
            meta: {
                breadcrumbs: ["crm", "service"],
                pageTitle: "service",
            },
            redirect: { name: "service-group-list" },
            children: [
                {
                    path: "list",
                    name: "service-list",
                    component: () =>
                        import("@/views/crmViews/serviceViews/pages/ServiceList.vue"),
                    meta: {
                        pageTitle: "serviceList",
                    },
                },
                {
                    path: "group-list",
                    name: "service-group-list",
                    component: () =>
                        import("@/views/crmViews/serviceViews/pages/ServiceGroupList.vue"),
                    meta: {
                        pageTitle: "serviceGroupList",
                    },
                },
                {
                    path: "conflict-list",
                    name: "service-conflict-list",
                    component: () =>
                        import("@/views/crmViews/serviceViews/pages/ServiceConflictList.vue"),
                    meta: {
                        pageTitle: "serviceConflictList",
                    },
                },
                {
                    path: "position-price-list",
                    name: "service-position-price-list",
                    component: () =>
                        import("@/views/crmViews/serviceViews/pages/PositionPriceList.vue"),
                    meta: {
                        pageTitle: "positionPriceList",
                    },
                },
            ]
        },
        {
            path: "offer",
            name: "offer",
            component: () =>
                import("@/views/crmViews/offerViews/OfferView.vue"),
            meta: {
                breadcrumbs: ["crm", "offer"],
                pageTitle: "offer",
            },
            redirect: { name: "offer-list" },
            children: [
                {
                    path: "list",
                    name: "offer-list",
                    component: () =>
                        import("@/views/crmViews/offerViews/pages/OfferList.vue"),
                    meta: {
                        pageTitle: "offerList",
                    },
                },
                {
                    path: "create",
                    name: "offer-create",
                    component: () =>
                        import("@/views/crmViews/offerViews/pages/OfferCreateWizard.vue"),
                    meta: {
                        backRoute: "offer-list",
                        pageTitle: "offerCreate",
                    },
                },
                {
                    path: "detail/:id",
                    name: "offer-detail",
                    component: () =>
                        import("@/views/crmViews/offerViews/pages/OfferDetail.vue"),
                    meta: {
                        breadcrumbs: ["crm", "offer", "offerDetail"],
                        backRoute: "offer-list",
                        pageTitle: "offerDetail",
                    },
                },
            ]
        },
        {
            path: "agreement",
            name: "agreement",
            component: () =>
                import("@/views/crmViews/agreementViews/AgreementView.vue"),
            meta: {
                breadcrumbs: ["crm", "agreement"],
                pageTitle: "agreement",
            },
            redirect: { name: "agreement-list" },
            children: [
                {
                    path: "list",
                    name: "agreement-list",
                    component: () =>
                        import("@/views/crmViews/agreementViews/pages/AgreementList.vue"),
                    meta: {
                        pageTitle: "agreementList",
                    },
                },
                {
                    path: "detail/:id",
                    name: "agreement-detail",
                    component: () =>
                        import("@/views/crmViews/agreementViews/pages/AgreementDetail.vue"),
                    meta: {
                        breadcrumbs: ["crm", "agreement", "agreementDetail"],
                        backRoute: "agreement-list",
                        pageTitle: "agreementDetail",
                    }
                }
            ]
        },
        {
            path: "project",
            name: "project",
            component: () =>
                import("@/views/crmViews/projectViews/ProjectView.vue"),
            meta: {
                breadcrumbs: ["crm", "project"],
                pageTitle: "project",
            },
            redirect: { name: "project-list" },
            children: [
                {
                    path: "list",
                    name: "project-list",
                    component: () =>
                        import("@/views/crmViews/projectViews/pages/ProjectList.vue"),
                    meta: {
                        pageTitle: "projectList",
                    },
                },
                {
                    path: "detail/:id",
                    name: "project-detail",
                    component: () =>
                        import("@/views/crmViews/projectViews/pages/ProjectDetail.vue"),
                    meta: {
                        breadcrumbs: ["crm", "project", "projectDetail"],
                        backRoute: "project-list",
                        pageTitle: "projectDetail",
                    },
                    redirect: { name: "project-information" },
                    children: [
                        {
                            path: "info",
                            name: "project-information",
                            component: () =>
                                import("@/views/crmViews/projectViews/pages/projectDetailPages/ProjectInformation.vue"),
                            meta: {
                                pageTitle: "projectInformation",
                            },
                        },
                        {
                            path: "cost",
                            name: "project-cost",
                            component: () =>
                                import("@/views/crmViews/projectViews/pages/projectDetailPages/ProjectCost.vue"),
                            meta: {
                                pageTitle: "projectCost",
                            },
                        }
                    ]
                }
            ]
        },
        {
            path: "definition",
            name: "crm-definition",
            component: () =>
                import("@/views/crmViews/CrmDefinition.vue"),
            meta: {
                breadcrumbs: ["crm", "crmDefinition"],
                pageTitle: "crmDefinition",
            },
            redirect: { name: "crm-claim-definition" },
            children: [
                {
                    path: "crm-claim",
                    name: "crm-claim-definition",
                    component: () =>
                        import("@/views/crmViews/definitionViews/CrmClaimDef.vue"),
                    meta: {
                        pageTitle: "crmClaimDef",
                    },
                },
                {
                    path: "risk-form",
                    name: "crm-risk-form-definition",
                    component: () =>
                        import("@/views/crmViews/definitionViews/RiskFormDef.vue"),
                    meta: {
                        pageTitle: "riskFormDef",
                    },
                },
            ]
        },
    ]
}
export default crmRouter;