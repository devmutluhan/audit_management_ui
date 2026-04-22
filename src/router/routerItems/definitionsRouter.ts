const definitionsRouter =
{
    path: "/definitions",
    name: "definitions",
    component: () => import("@/views/definitionViews/DefinitionView.vue"),
    meta: {
        pageTitle: "definitions",
        breadcrumbs: ["definitions"],
    },
    redirect: { name: "general-definition" },
    children: [
        {
            path: "general",
            name: "general-definition",
            component: () =>
                import("@/views/definitionViews/pages/GeneralSettingsDef.vue"),
            meta: {
                pageTitle: "generalDefinition",
            },
        },
        {
            path: "company-branch",
            name: "company-branch-definition",
            component: () =>
                import("@/views/definitionViews/pages/CompanyBranchDef.vue"),
            meta: {
                pageTitle: "companyBranchDefinition",
            },
        },
        {
            path: "public-holiday",
            name: "public-holiday-definition",
            component: () =>
                import("@/views/humanResourceViews/vacationViews/pages/PublicHolidayList.vue"),
            meta: {
                pageTitle: "publicHoliday",
            },
        },
        {
            path: "tax",
            name: "tax-definition",
            component: () =>
                import("@/views/definitionViews/pages/TaxDef.vue"),
            meta: {
                breadcrumbs: ["definition", "tax"],
                pageTitle: "taxDefinition",
            },
        },
        {
            path: "approvement-card",
            name: "approvement-card-definition",
            component: () =>
                import("@/views/definitionViews/pages/ApprovalProcessDef.vue"),
            meta: {
                pageTitle: "approvementCardDefinition",
            },
        },
        {
            path: "claim-card",
            name: "claim-card-definition",
            component: () =>
                import("@/views/definitionViews/pages/ClaimCardDef.vue"),
            meta: {
                pageTitle: "claimCardDefinition",
            },
        },
        {
            path: "user-claim",
            name: "user-claim-definition",
            component: () =>
                import("@/views/definitionViews/pages/UserClaimCardDef.vue"),
            meta: {
                pageTitle: "userClaimDefinition",
            },
        },
    ]
}

export default definitionsRouter;