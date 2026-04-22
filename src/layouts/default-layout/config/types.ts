export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route: string;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

interface General {
  mode: "dark" | "light" | "system";
  pageWidth: 'fluid' | 'default' | 'fixed';
  layout: "dark-sidebar" | "light-sidebar" | "light-header" | "dark-header";
  iconsType: "duotone" | "solid" | "outline";
  tableFilter: 'unVisible' | 'visible' | 'navDrawer'
}


interface ScrollTop {
  display: boolean;
}

interface Header {
  display: boolean;
  default: {
    container: "fixed" | "fluid";
    fixed: {
      desktop: boolean;
      mobile: boolean;
    };
    menu: {
      display: boolean;
      iconType: "keenthemes" | "bootstrap";
    };
    color: {
      iconColor: string;
      backgroundColor: string;
      itemBackground: string;
    }
  };
}

interface PageTitle {
  display: boolean;
  breadcrumb: boolean;
  direction: string;
}

interface Sidebar {
  display: boolean;
  default: {
    minimize: {
      desktop: {
        enabled: boolean;
        default: boolean;
        hoverable: boolean;
      };
    };
    menu: {
      iconType: "keenthemes" | "bootstrap";
    };
    color: {
      iconColor: string;
      backgroundColor: string;
      itemBackground: string;
    }
  };
}

interface Illustrations {
  set: "dozzy-1" | "sigma-1" | "sketchy-1" | "unitedpalms-1";
}

interface Content {
  container: "fixed" | "fluid";
}

interface Toolbar {
  display: boolean;
  container: "fixed" | "fluid";
  fixed: {
    desktop: boolean;
    mobile: boolean;
  };
}
interface LayoutConfig {
  general: General;
  illustrations: Illustrations;
  scrolltop: ScrollTop;
  header: Header;
  toolbar: Toolbar;
  sidebar: Sidebar;
  content: Content;
}

export default LayoutConfig;

export type {
  General,
  Illustrations,
  ScrollTop,
  Header,
  Sidebar,
  Content,
  Toolbar,
  LayoutConfig,
};
