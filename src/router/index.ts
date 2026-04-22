import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import customerRouter from "./routerItems/customerRouter";
import humanResourcesRouter from "./routerItems/humanResourcesRouter";
import crmRouter from "./routerItems/crmRouter";
import assetsRouter from "./routerItems/assetsRouter";
import definitionsRouter from "./routerItems/definitionsRouter";
import { hasClaimRouterBeforeEach, notClaimRouterBeforeEach } from "./routerItems/routerBeforeEach";
import profileRouter from "./routerItems/profileRouter";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: 'home-dashboard',
    redirect: { name: "dashboard" },
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "isAuth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: {
          pageTitle: "dashboard",
          breadcrumbs: ["dashboard"],
        },
      },
      {
        path: "/calendar",
        name: "calendar",
        component: () => import("@/views/userAccountMenuViews/CalendarView.vue"),
        meta: {
          pageTitle: "calendar",
          breadcrumbs: ["calendar"],
        },
      },
      {
        path: "/notification",
        name: "notification",
        component: () => import("@/views/userAccountMenuViews/NotificationView.vue"),
        meta: {
          pageTitle: "notification",
          breadcrumbs: ["notification"],
        },
      },
      {
        path: "/customize",
        name: "customize",
        component: () => import("@/views/userAccountMenuViews/CustomizeView.vue"),
        meta: {
          pageTitle: "customize",
          breadcrumbs: ["customize"],
        },
      },
      profileRouter,
      humanResourcesRouter,
      customerRouter,
      crmRouter,
      assetsRouter,
      definitionsRouter,
    ],
  },
  {
    path: "/",
    name: "auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    meta: {
      middleware: "notAuth",
    },
    redirect: { name: "sign-in" },
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/authenticationViews/SignIn.vue"),
        meta: {
          pageTitle: "signIn",
        },
      },
      {
        path: "/accept-invite",
        name: "accept-invite",
        component: () =>
          import("@/views/authenticationViews/AcceptInvite.vue"),
        meta: {
          pageTitle: "acceptInvite",
        },
      },
      {
        path: "/verify-password",
        name: "verify-password",
        component: () =>
          import("@/views/authenticationViews/ResetPassword.vue"),
        meta: {
          pageTitle: "verifyPassword",
        },
      },
      {
        path: "/select-tenant",
        name: "select-tenant",
        component: () =>
          import("@/views/authenticationViews/SelectTenant.vue"),
        meta: {
          pageTitle: "selectTenant",
        },
      },
      {
        path: "/reset-password",
        name: "reset-password",
        component: () =>
          import("@/views/authenticationViews/ResetPassword.vue"),
        meta: {
          pageTitle: "resetPassword",
        },
      },
      {
        path: "/forgot-password",
        name: "forgot-password",
        component: () =>
          import("@/views/authenticationViews/ForgotPassword.vue"),
        meta: {
          pageTitle: "forgotPassword",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/systemViews/Error404.vue"),
        meta: {
          pageTitle: "Error404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/systemViews/Error500.vue"),
        meta: {
          pageTitle: "Error500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll toc the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

// notClaimRouterBeforeEach(router);
hasClaimRouterBeforeEach(router);

export default router;
