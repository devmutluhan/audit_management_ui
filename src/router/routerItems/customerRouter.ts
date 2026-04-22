const customerRouter = {
    path: "/customer",
    name: "customer",
    component: () => import("@/views/customerViews/CustomerView.vue"),
    meta: {
        pageTitle: "customer",
        breadcrumbs: ["customer"],
    },
    redirect: { name: "customer-list" },
    children: [
        {
            path: "list",
            name: "customer-list",
            component: () =>
                import("@/views/customerViews/pages/CustomerList.vue"),
            meta: {
                pageTitle: "customerList",
            },
        },
        {
            path: "create",
            name: "customer-create",
            component: () =>
                import("@/views/customerViews/pages/CustomerCreate.vue"),
            meta: {
                pageTitle: "customerCreate",
                backRoute: "customer-list",
            },
        },
        {
            path: "definition",
            name: "customer-definition",
            component: () =>
                import("@/views/customerViews/pages/CustomerDefinition.vue"),
            meta: {
                pageTitle: "customerDefinition",
            },
            redirect: { name: "customer-type-definition" },
            children: [
                {
                    path: "type",
                    name: "customer-type-definition",
                    component: () => import("@/views/customerViews/pages/customerDefinitionPages/CustomerTypeDef.vue"),
                    meta: {
                        breadcrumbs: ["customer", "definition"],
                        pageTitle: "customerType",
                    },
                },
                {
                    path: "sector",
                    name: "customer-sector-definition",
                    component: () =>
                        import("@/views/customerViews/pages/customerDefinitionPages/CustomerSectorDef.vue"),
                    meta: {
                        breadcrumbs: ["customer", "definition"],
                        pageTitle: "customerSector",
                    },
                },
                {
                    path: "tax-office",
                    name: "customer-tax-office-definition",
                    component: () =>
                        import("@/views/customerViews/pages/customerDefinitionPages/CustomerTaxOfficeDef.vue"),
                    meta: {
                        breadcrumbs: ["customer", "definition"],
                        pageTitle: "customerTaxOffice",
                    },
                },
            ]
        },
        {
            path: "detail/:id",
            name: "customer-detail",
            component: () =>
                import("@/views/customerViews/pages/CustomerDetail.vue"),
            meta: {
                breadcrumbs: ["customer", "customerDetail"],
                pageTitle: "customerDetail",
                backRoute: "customer-list",
            },
            redirect: { name: "customer-information" },
            children: [
                {
                    path: "information",
                    name: "customer-information",
                    component: () =>
                        import("@/views/customerViews/pages/customerDetailPages/CustomerInformationComp.vue"),
                    meta: {
                        breadcrumbs: ["customer", "customerDetail"],
                        pageTitle: "customerDetail",
                    },
                },
            ],

        }
    ]
}

export default customerRouter;