
const profileRouter = {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/profileViews/AccountView.vue"),
    meta: {
        pageTitle: "myProfile",
        breadcrumbs: ["myProfile"],
    },
    redirect: { name: "profile-view" },
    children: [
        {
            path: "",
            name: "profile-view",
            component: () => import("@/views/profileViews/profilePages/ProfileView.vue"),
            meta: {
                pageTitle: "myProfile",
            },
            redirect: { name: "profile-info" },
            children: [
                {
                    path: "info",
                    name: "profile-info",
                    component: () => import("@/views/profileViews/profilePages/ProfileInfo.vue"),
                    meta: {
                        pageTitle: "generalInformation",
                    }
                },
                {
                    path: "vacation",
                    name: "profile-vacation",
                    component: () => import("@/views/profileViews/profilePages/ProfileVacation.vue"),
                    meta: {
                        pageTitle: "myVacations",
                    }
                },
                {
                    path: "training",
                    name: "profile-training",
                    component: () => import("@/views/profileViews/profilePages/ProfileCourses.vue"),
                    meta: {
                        pageTitle: "myCourses",
                    }
                },
                {
                    path: "expense",
                    name: "profile-expense",
                    component: () => import("@/views/profileViews/profilePages/ProfileExpense.vue"),
                    meta: {
                        pageTitle: "myExpenses",
                    }
                },
                {
                    path: "advance",
                    name: "profile-advance",
                    component: () => import("@/views/profileViews/profilePages/ProfileAdvance.vue"),
                    meta: {
                        pageTitle: "myAdvances",
                    }
                },
                {
                    path: "documents",
                    name: "profile-documents",
                    component: () => import("@/views/profileViews/profilePages/ProfileDocuments.vue"),
                    meta: {
                        pageTitle: "myDocuments",
                    }
                },
                // {
                //     path: "polls",
                //     name: "profile-polls",
                //     component: () => import("@/views/profileViews/profilePages/ProfileVacation.vue"),
                //     meta: {
                //         pageTitle: "myPolls",
                //     }
                // },
                {
                    path: "debits",
                    name: "profile-assets",
                    component: () => import("@/views/profileViews/profilePages/ProfileAssets.vue"),
                    meta: {
                        pageTitle: "myAssets",
                    }
                },
            ]

        },
        {
            path: "approval-request",
            name: "approval-request",
            component: () => import("@/views/profileViews/approvalRequestPages/ApprovalRequestView.vue"),
            meta: {
                pageTitle: "myApprovalRequest",
            },
            redirect: { name: "vacation-request" },
            children: [
                {
                    path: "vacation",
                    name: "vacation-request",
                    component: () => import("@/views/profileViews/approvalRequestPages/VacationRequestList.vue"),
                    meta: {
                        pageTitle: "vacationRequest",
                    }
                },
                {
                    path: "expense",
                    name: "expense-request",
                    component: () => import("@/views/profileViews/approvalRequestPages/ExpenseRequestList.vue"),
                    meta: {
                        pageTitle: "expenseRequest",
                    }
                },
                {
                    path: "advance",
                    name: "advance-request",
                    component: () => import("@/views/profileViews/approvalRequestPages/AdvanceRequestList.vue"),
                    meta: {
                        pageTitle: "advanceRequest",
                    }
                },
                {
                    path: "offer",
                    name: "offer-request",
                    component: () => import("@/views/profileViews/approvalRequestPages/OfferRequestList.vue"),
                    meta: {
                        pageTitle: "offerRequest",
                    }
                }
            ]

        },
        {
            path: "timeSheet",
            name: "profile-timeSheet",
            component: () => import("@/views/profileViews/profilePages/TimeSheetView.vue"),
            meta: {
                pageTitle: "myTimeSheet",
            }
        },
    ]
}

export default profileRouter;