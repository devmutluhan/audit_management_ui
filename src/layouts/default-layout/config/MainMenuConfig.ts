import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    heading: "menu",
    route: "menu",
    sub: [
      {
        heading: "dashboard",
        route: "dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        sectionTitle: "customer",
        route: "customer",
        keenthemesIcon: "user-tick",
        bootstrapIcon: "bi-person-check",
        sub: [
          {
            heading: "customerList",
            route: "customer-list",
            keenthemesIcon: "people",
            bootstrapIcon: "bi-people",
          },
          {
            heading: "customerDefinition",
            route: "customer-definition",
            keenthemesIcon: "user-edit",
            bootstrapIcon: "bi-person-add",
          },
        ],
      },
      {
        sectionTitle: "humanResource",
        route: "human-resource",
        keenthemesIcon: "user-square",
        bootstrapIcon: "bi-person-hearts",
        sub: [
          {
            // sectionTitle: "employee",
            heading: "employee",
            route: "employee",
            keenthemesIcon: "user",
            bootstrapIcon: "bi-person-vcard",
            // sub: [
            // {
            //   heading: "employeeList",
            //   route: "employee-list",
            // },
            // {
            //   heading: "employeeCreate",
            //   route: "employee-create",
            // },
            // {
            //   heading: "employeeRequestList",
            //   route: "employee-request-list",
            // },
            // {
            //   heading: "employeeRequestCreate",
            //   route: "employee-request-create",
            // },
            // {
            //   heading: "applicantEmployeeList",
            //   route: "applicant-employee-list",
            // },
            // {
            //   heading: "applicantEmployeeCreate",
            //   route: "applicant-employee-create",
            // },
            // ]
          },
          {
            // sectionTitle: "vacation",
            heading: "vacation",
            route: "vacation",
            keenthemesIcon: "airplane-square",
            bootstrapIcon: "bi-airplane",
            // sub: [
            //   {
            //     heading: "vacationList",
            //     route: "vacation-list",
            //   },
            //   {
            //     heading: "vacationCreate",
            //     route: "vacation-create",
            //   },
            // ]
          },
          {
            // sectionTitle: "advance",
            heading: "payment",
            route: "payment",
            keenthemesIcon: "wallet",
            bootstrapIcon: "bi-wallet",
            // sub: [
            //   {
            //     heading: "advanceList",
            //     route: "advance-list",
            //   },
            //   {
            //     heading: "advanceCreate",
            //     route: "advance-create",
            //   },
            // ]
          },
          {
            // sectionTitle: "poll",
            heading: "poll",
            route: "poll",
            keenthemesIcon: "clipboard",
            bootstrapIcon: "bi-clipboard-data",
            // sub: [
            //   {
            //     heading: "pollList",
            //     route: "poll-list",
            //   },
            //   {
            //     heading: "pollCreate",
            //     route: "poll-create",
            //   },
            // ]
          },
          {
            // sectionTitle: "training",
            heading: "training",
            route: "training",
            keenthemesIcon: "medal-star",
            bootstrapIcon: "bi-bookmark-star",
            // sub: [
            //   {
            //     heading: "trainingList",
            //     route: "training-list",
            //   },
            //   {
            //     heading: "trainingCreate",
            //     route: "training-create",
            //   },
            // ]
          },
          {
            heading: "performance",
            route: "performance",
            keenthemesIcon: "chart-line-up",
            bootstrapIcon: "bi-graph-up-arrow",
          },
          {
            heading: "hrDefinition",
            route: "hr-definition",
            keenthemesIcon: "office-bag",
            bootstrapIcon: "bi-suitcase-lg",
          },
        ],
      },
      {
        sectionTitle: "crm",
        route: "crm",
        keenthemesIcon: "graph-up",
        bootstrapIcon: "bi-graph-up",
        sub: [
          {
            heading: "service",
            route: "service",
            keenthemesIcon: "delivery-3",
            bootstrapIcon: "bi-file-earmark-zip",
          },
          {
            // sectionTitle: "offer",
            heading: "offer",
            route: "offer",
            keenthemesIcon: "delivery-3",
            bootstrapIcon: "bi-file-earmark-zip",
            // sub: [
            //   {
            //     heading: "offerList",
            //     route: "offer-list",
            //   },
            //   {
            //     heading: "offerCreate",
            //     route: "offer-create",
            //   },
            // ]
          },
          {
            // sectionTitle: "agreement",
            heading: "agreement",
            route: "agreement",
            keenthemesIcon: "file-added",
            bootstrapIcon: "bi-file-earmark-check",
            // sub: [
            //   {
            //     heading: "agreementList",
            //     route: "agreement-list",
            //   },
            //   {
            //     heading: "agreementCreate",
            //     route: "agreement-create",
            //   },
            // ]
          },
          {
            // sectionTitle: "project",
            heading: "project",
            route: "project",
            keenthemesIcon: "courier",
            bootstrapIcon: "bi-person-walking",
            // sub: [
            //   {
            //     heading: "projectList",
            //     route: "project-list",
            //   },
            // ]
          },
          {
            heading: "crmDefinition",
            route: "crm-definition",
            keenthemesIcon: "office-bag",
            bootstrapIcon: "bi-suitcase-lg",
          },
        ],
      },
      {
        heading: "assets",
        route: "assets",
        keenthemesIcon: "monitor-mobile",
        bootstrapIcon: "bi-tv",
      },
      {
        heading: "definitions",
        route: "definitions",
        keenthemesIcon: "switch",
        bootstrapIcon: "bi-toggles",
      },
    ],
  },
];

export const UserAccountMenu: Array<any> = [
  {
    title: "menu.myProfile",
    route: "profile",
    icon: "bi bi-person",
    children: [
      {
        title: "menu.generalInformation",
        route: "profile-info",
      },
      {
        title: "menu.myVacations",
        route: "profile-vacation",
      },
      {
        title: "menu.myCourses",
        route: "profile-training",
      },
      {
        title: "menu.myExpenses",
        route: "profile-expense",
      },
      {
        title: "menu.myAdvances",
        route: "profile-advance",
      },
      {
        title: "menu.myAssets",
        route: "profile-assets",
      },
      {
        title: "menu.myDocuments",
        route: "profile-documents",
      },
      {
        title: "menu.myPolls",
        route: "profile-polls",
      },
    ],
  },
  {
    title: "menu.approvalRequest",
    route: "approval-request",
    icon: "bi bi-person",
    children: [
      {
        title: "menu.vacationRequest",
        route: "vacation-request",
      },
      {
        title: "menu.expenseRequest",
        route: "expense-request",
      },
      {
        title: "menu.advanceRequest",
        route: "advance-request",
      },
      {
        title: "menu.offerRequest",
        route: "offer-request",
      }
    ],
  },
  {
    title: "menu.myTimeSheet",
    route: "profile-timeSheet",
    icon: "bi bi-clock",
  }
]

export default MainMenuConfig
