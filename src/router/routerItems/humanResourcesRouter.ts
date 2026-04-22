const humanResourcesRouter = {
    path: "/human-resource",
    name: "human-resource",
    component: () => import("@/views/humanResourceViews/HumanResourceView.vue"),
    meta: {
        pageTitle: "humanResource",
        breadcrumbs: ["humanResource"],
    },
    redirect: { name: "employee" },
    children: [
        {
            path: "employee",
            name: "employee",
            component: () => import("@/views/humanResourceViews/employeeViews/EmployeeView.vue"),
            meta: {
                pageTitle: "employee",
                breadcrumbs: ["humanResource", "employee"],
            },
            redirect: { name: "employee-list" },
            children: [
                {
                    path: "list",
                    name: "employee-list",
                    component: () =>
                        import("@/views/humanResourceViews/employeeViews/pages/EmployeeList.vue"),
                    meta: {
                        pageTitle: "employeeList",
                    },
                },
                {
                    path: "create",
                    name: "employee-create",
                    component: () =>
                        import("@/views/humanResourceViews/employeeViews/pages/EmployeeCreate.vue"),
                    meta: {
                        pageTitle: "employeeCreate",
                        backRoute: "employee-list",
                    },
                },
                {
                    path: "detail/:id",
                    name: "employee-detail",
                    component: () =>
                        import("@/views/humanResourceViews/employeeViews/pages/EmployeeDetail.vue"),
                    meta: {
                        breadcrumbs: ["humanResource", "employee", "employeeDetail"],
                        pageTitle: "employeeDetail",
                        backRoute: "employee-list",
                    },
                    redirect: { name: "employee-profile" },
                    children: [
                        {
                            path: "profile",
                            name: "employee-profile",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailProfile.vue"),
                            meta: {
                                pageTitle: "employeeProfile",
                            },
                        },
                        {
                            path: "information",
                            name: "employee-information",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailInformation.vue"),
                            meta: {
                                pageTitle: "employeeInformation",
                            },
                        },
                        {
                            path: "career",
                            name: "employee-career",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailCareer.vue"),
                            meta: {
                                pageTitle: "employeeCareer",
                            },
                            redirect: { name: "employee-position" },
                            children: [
                                {
                                    path: "position",
                                    name: "employee-position",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/careerPages/EmployeePositionPage.vue"),
                                    meta: {
                                        pageTitle: "employeePosition",
                                    },
                                },
                                {
                                    path: "pay",
                                    name: "employee-pay",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/careerPages/EmployeePayPage.vue"),
                                    meta: {
                                        pageTitle: "employeePay",
                                    },
                                }
                            ]
                        },
                        {
                            path: "vacation",
                            name: "personel-vacation",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailVacation.vue"),
                            meta: {
                                pageTitle: "employeeVacation",
                            },
                            redirect: { name: "personel-vacations" },
                            children: [
                                {
                                    path: "summary",
                                    name: "personel-vacation-summary",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/vacationPages/EmployeeVacationSummaryPage.vue"),
                                    meta: {
                                        pageTitle: "employeeVacationSummary",
                                    },
                                },
                                {
                                    path: "vacations",
                                    name: "personel-vacations",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/vacationPages/EmployeeVacationsPage.vue"),
                                    meta: {
                                        pageTitle: "employeeVacations",
                                    },
                                }
                            ]
                        },
                        {
                            path: "payment",
                            name: "personel-payment",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailPayment.vue"),
                            meta: {
                                pageTitle: "employeePayments",
                            },
                            redirect: { name: "personel-expenses" },
                            children: [
                                {
                                    path: "expense",
                                    name: "personel-expenses",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/paymentPages/EmployeeExpensePage.vue"),
                                    meta: {
                                        pageTitle: "employeePaymentExpense",
                                    },
                                },
                                {
                                    path: "advance",
                                    name: "personel-advances",
                                    component: () =>
                                        import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/paymentPages/EmployeeAdvancePage.vue"),
                                    meta: {
                                        pageTitle: "employeePaymentAdvance",
                                    },
                                }
                            ]
                        },
                        {
                            path: "training",
                            name: "personel-training",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailCourses.vue"),
                            meta: {
                                pageTitle: "employeeCourses",
                            },
                        },
                        {
                            path: "debits",
                            name: "personel-assets",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailAssets.vue"),
                            meta: {
                                pageTitle: "employeeAssets",
                            },
                        },
                        {
                            path: "documents",
                            name: "employee-documents",
                            component: () =>
                                import("@/views/humanResourceViews/employeeViews/pages/employeeDetailPages/EmployeeDetailDocuments.vue"),
                            meta: {
                                pageTitle: "employeeDocuments",
                            },
                        },
                    ]
                },
            ]
        },
        {
            path: "vacation",
            name: "vacation",
            component: () =>
                import("@/views/humanResourceViews/vacationViews/VacationView.vue"),
            meta: {
                breadcrumbs: ["humanResource", "vacationList"],
                pageTitle: "vacationList",
            },
            redirect: { name: "vacation-list" },
            children: [
                {
                    path: "list",
                    name: "vacation-list",
                    component: () =>
                        import("@/views/humanResourceViews/vacationViews/pages/VacationList.vue"),
                    meta: {
                        pageTitle: "vacationList",
                    }
                },
                {
                    path: "rules",
                    name: "vacation-rules",
                    component: () =>
                        import("@/views/humanResourceViews/vacationViews/pages/VacationRules.vue"),
                    meta: {
                        pageTitle: "vacationRulesList",
                    },
                    redirect: { name: "vacation-rules-list" },
                    children: [
                        {
                            path: "list",
                            name: "vacation-rules-list",
                            component: () =>
                                import("@/views/humanResourceViews/vacationViews/pages/vacationRulesPages/VacationRulesList.vue"),
                        },
                        {
                            path: "leave-type/:id",
                            name: "leave-type-detail",
                            component: () =>
                                import("@/views/humanResourceViews/vacationViews/pages/vacationRulesPages/UpdateVacationType.vue"),
                        },
                        {
                            path: "leave-type-create",
                            name: "leave-type-create",
                            component: () =>
                                import("@/views/humanResourceViews/vacationViews/pages/vacationRulesPages/AddVacationType.vue"),
                        }
                    ]
                },
                {
                    path: "public-holiday",
                    name: "vacation-public-holiday",
                    component: () =>
                        import("@/views/humanResourceViews/vacationViews/pages/PublicHolidayList.vue"),
                    meta: {
                        pageTitle: "publicHoliday",
                    },
                },
                {
                    path: "calendar",
                    name: "vacation-calendar",
                    component: () =>
                        import("@/views/humanResourceViews/vacationViews/pages/VacationCalendar.vue"),
                    meta: {
                        pageTitle: "calendar",
                    },
                }
            ]
        },
        {
            path: "payment",
            name: "payment",
            component: () =>
                import("@/views/humanResourceViews/paymentViews/PaymentView.vue"),
            meta: {
                breadcrumbs: ["humanResource", "payment"],
                pageTitle: "payment",
            },
            redirect: { name: "payment-expense-list" },
            children: [
                {
                    path: "expense-list",
                    name: "payment-expense-list",
                    component: () =>
                        import("@/views/humanResourceViews/paymentViews/pages/ExpenseListView.vue"),
                    meta: {
                        pageTitle: "expenseList",
                    }
                },
                {
                    path: "advance-list",
                    name: "payment-advance-list",
                    component: () =>
                        import("@/views/humanResourceViews/paymentViews/pages/AdvanceListView.vue"),
                    meta: {
                        pageTitle: "advanceList",
                    }
                }
            ]
        },
        {
            path: "training",
            name: "training",
            component: () =>
                import("@/views/humanResourceViews/trainingViews/TrainingView.vue"),
            meta: {
                breadcrumbs: ["humanResource", "training"],
                pageTitle: "training",
            },
            redirect: { name: "training-list" },
            children: [
                {
                    path: "list",
                    name: "training-list",
                    component: () =>
                        import("@/views/humanResourceViews/trainingViews/pages/TrainingList.vue"),
                    meta: {
                        pageTitle: "trainingList",
                    },
                },
                {
                    path: "detail/:id",
                    name: "training-detail",
                    component: () =>
                        import("@/views/humanResourceViews/trainingViews/pages/TrainingDetail.vue"),
                    meta: {
                        pageTitle: "trainingDetail",
                        backRoute: "training-list",
                    },
                }
            ]
        },
        {
            path: "performance",
            name: "performance",
            component: () =>
                import("@/views/humanResourceViews/performanceViews/PerformanceView.vue"),
            meta: {
                breadcrumbs: ["humanResource", "performance"],
                pageTitle: "performance",
            },
            redirect: { name: "performance-list" },
            children: [
                {
                    path: "list",
                    name: "performance-list",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/performancePages/PerformancePeriodList.vue"),
                    meta: {
                        pageTitle: "performanceList",
                    },
                },
                {
                    path: "detail/:id",
                    name: "performance-detail",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/performancePages/PerformancePeriodDetail.vue"),
                    meta: {
                        breadcrumbs: ["humanResource", "performance"],
                        pageTitle: "performanceDetail",
                        backRoute: "performance-list",
                    },
                    redirect: { name: "performance-reviews" },
                    children: [
                        {
                            path: "reviews",
                            name: "performance-reviews",
                            component: () =>
                                import("@/views/humanResourceViews/performanceViews/pages/performancePages/performanceDetailPages/PerformancePlanningDetailPage.vue"),
                            meta: {
                                pageTitle: "performanceReviews",
                            },
                        },
                    ]
                },
                {
                    path: "evaluation-template-list",
                    name: "evaluation-template-list",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/EvaluationTemplateList.vue"),
                    meta: {
                        pageTitle: "evaluationTemplateList",
                    },
                },
                {
                    path: "competency-template-list",
                    name: "competency-template-list",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/competencyTemplatePages/CompetencyTemplateList.vue"),
                    meta: {
                        pageTitle: "competencyTemplateList",
                    },
                },
                {
                    path: "competency-template-create",
                    name: "competency-template-create",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/competencyTemplatePages/CompetencyTemplateCreate.vue"),
                    meta: {
                        pageTitle: "competencyTemplateCreate",
                        backRoute: "competency-template-list",
                    },
                },
                {
                    path: "competency-template-update/:id",
                    name: "competency-template-update",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/competencyTemplatePages/CompetencyTemplateUpdate.vue"),
                    meta: {
                        pageTitle: "competencyTemplateUpdate",
                        backRoute: "competency-template-list",
                    },
                },
                {
                    path: "competency-template-detail/:id",
                    name: "competency-template-detail",
                    component: () =>
                        import("@/views/humanResourceViews/performanceViews/pages/competencyTemplatePages/CompetencyTemplateDetail.vue"),
                    meta: {
                        breadcrumbs: ["humanResource", "performance", "competencyTemplate"],
                        pageTitle: "competencyTemplateDetail",
                        backRoute: "competency-template-list",
                    },
                }
            ]
        },
        {
            path: "definition",
            name: "hr-definition",
            component: () =>
                import("@/views/humanResourceViews/HumanResourceDefinition.vue"),
            meta: {
                breadcrumbs: ["humanResource", "hrDefinition"],
                pageTitle: "hrDefinition",
            },
            redirect: { name: "hr-working-day-definition" },
            children: [
                {
                    path: "working-day",
                    name: "hr-working-day-definition",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/WorkWeekPlanDef.vue"),
                    meta: {
                        pageTitle: "hrWorkingDay",
                    },
                },
                {
                    path: "position",
                    name: "hr-position-definition",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/PositionDef.vue"),
                    meta: {
                        pageTitle: "hrPosition",
                    },
                },
                {
                    path: "department",
                    name: "hr-department-definition",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/DepartmentDef.vue"),
                    meta: {
                        pageTitle: "hrDepartment",
                    },
                },
                {
                    path: "expense-category",
                    name: "payment-expense-category",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/ExpenseCategoryDef.vue"),
                    meta: {
                        pageTitle: "hrExpenseCategory",
                    },
                },
                {
                    path: "leave-work-reason",
                    name: "hr-leave-work-reason-definition",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/LeaveWorkReasonDef.vue"),
                    meta: {
                        pageTitle: "hrLeaveWorkReason",
                    },
                },
                {
                    path: "document-definition",
                    name: "hr-document-definition",
                    component: () =>
                        import("@/views/humanResourceViews/definitionViews/DocumentsDef.vue"),
                    meta: {
                        pageTitle: "hrDocumentDefinition",
                    },
                }
            ]
        }
    ]
}

export default humanResourcesRouter;