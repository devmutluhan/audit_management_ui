const assetsRouter = {
    path: "/assets",
    name: "assets",
    component: () => import("@/views/assetsViews/AssetsView.vue"),
    meta: {
        pageTitle: "assets",
        breadcrumbs: ["assets"],
    },
    redirect: { name: "product-list" },
    children: [
        {
            path: "list",
            name: "product-list",
            component: () =>
                import("@/views/assetsViews/pages/AssetsList.vue"),
            meta: {
                pageTitle: "productList",
            },
        },
        {
            path: "category",
            name: "product-category",
            component: () => import("@/views/assetsViews/pages/AssetsCategoryDef.vue"),
            meta: {
                breadcrumbs: ["assets"],
                pageTitle: "productCategory",
            },
        }
    ]
}

export default assetsRouter;