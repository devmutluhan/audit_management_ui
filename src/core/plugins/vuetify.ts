import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          dropdownCard: "#FAFAFA",
          toolbarButton: "#005D9F",
          cardToolbar: "#F5F5F5",
          tabsBackground: "#F5F5F5",
          selectedTab: "#1E1B8E",
          approverCard: "#E3F2FD",
          alertIconColor: "#FFC107",

          // Button
          addButtonColor: "#005D9F",
          cancelButtonColor: "#9E9E9E",
          confirmButtonColor: "#00796B",
          approveButtonColor: "#4CAF50",
          rejectButtonColor: "#F44336",
          deleteButtonColor: "#F44336",
          editButtonColor: "#2196F3",
          buttonChipColor: "#005D9F",

          // Table
          priceTextColor: "#2E7D32",
          headerBgColor: "#FFFFFF",
          headerTextColor: "#616161",
          singleRowBgColor: "#FBFBFB", // tek sayıdaki row color
          pairRowBgColor: "#FFFFFF", // çift sayıdaki row color
          rowTextColor: "#757575",
          groupRowTextColor: "#666666",
          hoverRowColor: "#E3F2FD",
          selectedRowColor: "#eaf6faff",
          singleGroupRowColor: "#e2eaf3",
          pairGroupRowColor: "#f0f3f6",
          lastRowColor: "#595c62",
          warningTableColor: '#FFCDD2',

          okrColor: "#E0F2F1",
          kpiColor: "#E8EAF6",
          competencyColor: "#EDE7F6",
          pageTitleColor: "#1E1B8E",
          breadcrumbsColor: "#757575",

          logoBlue: "#1E1B8E",
          logoGreen: "#0EA04B"
        },
      } as ThemeDefinition,
      dark: {
        dark: true,
        colors: {
          dropdownCard: "#212121",
          toolbarButton: "#2979FF",
          cardToolbar: "#212121",
          tabsBackground: "#263238",
          selectedTab: "#2979FF",
          approverCard: "#000001ff",
          alertIconColor: "#FFC107",

          // Button
          addButtonColor: "#2979FF",
          confirmButtonColor: "#1B5E20",
          cancelButtonColor: "#424242",
          approveButtonColor: "#81C784",
          rejectButtonColor: "#EF5350",
          deleteButtonColor: "#EF5350",
          editButtonColor: "#64B5F6",
          buttonChipColor: "#2979FF",

          // Table
          priceTextColor: "#81C784",
          headerBgColor: "#15171C",
          headerTextColor: "#E0E0E0",
          singleRowBgColor: "#191B20", // tek sayıdaki row color
          pairRowBgColor: "#15171C", // çift sayıdaki row color
          rowTextColor: "#E0E0E0",
          groupRowTextColor: "#F3F3F3",
          hoverRowColor: "#090d44ff",
          selectedRowColor: "#1e2149ff",
          singleGroupRowColor: "#212121",
          pairGroupRowColor: "#252525",
          warningTableColor: '#542a30ff',

          okrColor: "#80CBC4",
          kpiColor: "#9FA8DA",
          competencyColor: "#B39DDB",
          pageTitleColor: "#AAAAAA",
          breadcrumbsColor: "#757575",

          logoBlue: "#757575",
          logoGreen: "#AAAAAA"
        },
      } as ThemeDefinition,
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      variant: 'flat',
      color: 'transparent',
      border: true,
      class: "w-100"
    },
    VSelect: {
      hideDetails: true,
      variant: 'outlined',
      density: 'compact'
    },
    VBtn: {
      variant: 'flat',
      color: 'addButtonColor',
      class: 'text-capitalize text-subtitle-1',
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: true
    },
    VSwitch: {
      color: 'success',
      density: 'compact',
      hideDetails: true
    },
    VAutocomplete: {
      variant: 'outlined'
    },
    VListItem: {
      variant: 'tonal'
    },
    VDataTable: {
      border: true,
      density: 'compact',
      class: 'd-inline-block text-truncate'
    },
    VToolbar: {
      floating: true,
      density: 'compact',
      color: 'cardToolbar',
      height: 80,
    },
    VTabs: {
      class: "text-capitalize",
      height: 50,
    },
    VDialog: {
      width: 800,
    },
    VWindow: {
      touch: false
    }
  }
});
