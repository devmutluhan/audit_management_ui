import type LayoutConfigTypes from "@/layouts/default-layout/config/types";

const config: LayoutConfigTypes = {
  general: {
    mode: "light",
    pageWidth: "fluid",
    layout: "light-header",
    iconsType: "duotone",
    tableFilter: "visible",
  },
  header: {
    display: true,
    default: {
      container: "fluid",
      fixed: {
        desktop: true,
        mobile: false,
      },
      menu: {
        display: true,
        iconType: "keenthemes",
      },
      color: {
        iconColor: '',
        backgroundColor: '',
        itemBackground: '',
      }
    },
  },
  sidebar: {
    display: true,
    default: {
      minimize: {
        desktop: {
          enabled: true,
          default: false,
          hoverable: true,
        },
      },
      menu: {
        iconType: "keenthemes",
      },
      color: {
        iconColor: '',
        backgroundColor: '',
        itemBackground: '',
      }
    },
  },
  toolbar: {
    display: true,
    container: "fluid",
    fixed: {
      desktop: false,
      mobile: false,
    },
  },
  content: {
    container: "fluid",
  },
  illustrations: {
    set: "sketchy-1",
  },
  scrolltop: {
    display: true,
  },
};

export default config;
