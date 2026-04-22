import { ActiveFiltersType, FilterItemsType, FilterItemTypeEnum, FilterOptionType } from "@/models/types"
import { useManagementDtoStore } from "@/stores/managementStores/managementDtoStore"
import { storeToRefs } from "pinia"
import { computed, markRaw, ref } from "vue"
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore"
import i18n from "../plugins/i18n"
import CustomerSelectInput from "@/components/formInput/readyInput/CustomerSelectInput.vue"
import { customerListItems } from "@/components/formInput/readyInput/CustomerSelectUtils"
import { enumToArray } from "../helpers/enumToArray"
import { ApprovementStatusEnum, EmployeeStatusTypeEnum, PeriodStatusType, PerformanceTemplateStatus } from "@/models/custom/EnumTypes"
import EmployeeSelectInput from "@/components/formInput/readyInput/EmployeeSelectInput.vue"
import { useCrmServiceStore } from "@/stores/crmStores/crmServiceStore"
import { formatterPriceForCurrencyName } from "../helpers/generalUtils"
import { formatterDate } from "../helpers/dateUtils"
import type { OfferListDto } from "@/models/entities/crm/CrmOfferDtos"

const t = i18n.global.t
const { positionList, departmentList, companyBranchList } = storeToRefs(useManagementDtoStore())
const { customerTypes, customerSectors } = storeToRefs(useCustomerDtoStore())
const { serviceGroupList } = storeToRefs(useCrmServiceStore())

export const activeFilters = ref(new Array<ActiveFiltersType>());

export const mountComponentForFilter = (tableHeader: any) => {
    activeFilters.value = new Array<ActiveFiltersType>();
    const filterColumnArray = ref([] as any);
    tableHeader.forEach((e: any) => {
        if (e.filterEnabled == true) {
            filterColumnArray.value.push(e);
        }
    });
    columnFiltersOnMount(filterColumnArray.value);
};

export const columnFiltersOnMount = (columnFilters: Array<any>) => {
    columnFilters.forEach((columnFilter: any) => {
        columnFilter.filterOption.active = false;
        columnFilter.filterOption.filters.forEach((x: any) => {
            if (typeof x.value == 'string') {
                x.value = ''
            } else if (typeof x.value == 'number') {
                x.value = 0
            } else if (Array.isArray(x.value)) {
                x.value = []
            }
        })
        columnFilter.filterOption.action = (prop) => filterAction(prop);
    })
}

const filterAction = (prop: Array<ActiveFiltersType>) => {
    if (prop.length == 0) {
        activeFilters.value = new Array<ActiveFiltersType>();
    } else {
        for (let i = 0; i < prop.length; i++) {
            const filterValue = prop[i].value;
            if (filterValue !== '' && filterValue !== undefined && filterValue !== null) {
                activeFilters.value.push(prop[i]);
            } else {
                activeFilters.value = activeFilters.value.filter((x: ActiveFiltersType) => x.field != prop[i].field);
            }
        }
    }
}

export const employeePositionColumnFilter = {
    columnName: 'list.position',
    columnLabel: "position",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useManagementDtoStore().getPositionList({ pageSize: 1000, pageNumber: 1 }),
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "positionIds",
                items: computed(() => positionList.value),
                value: [],
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const employeeStatusColumnFilter = {
    columnName: 'list.status',
    columnLabel: "appUserState",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "appUserState",
                items: enumToArray(EmployeeStatusTypeEnum),
                value: null,
                fieldTitle: "title",
                fieldValue: "value"
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const serviceFilterForServiceGroupColumnFilter = {
    columnName: 'list.serviceGroup',
    columnLabel: "serviceGroup.name",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 }),
        isFetch: true,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "serviceGroupId",
                items: computed(() => serviceGroupList.value.items ?? []),
                value: null,
                fieldTitle: "title",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const employeeDepartmentColumnFilter = {
    columnName: 'form.department',
    columnLabel: "department",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useManagementDtoStore().getDepartmentList({ pageSize: 1000, pageNumber: 1 }),
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "departmentIds",
                items: computed(() => departmentList.value),
                value: [],
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const employeeFullNameColumnFilter = {
    columnName: 'general.employeeFullName',
    columnLabel: "fullName",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "fullName",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const employeeFullNameColumnFilterForExpense = {
    columnName: 'list.requester',
    columnLabel: "employee.fullName",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "employeeFullName",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const employeeFullNameColumnFilterForVacation = {
    columnName: 'list.requester',
    columnLabel: "employee.fullName",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "employeeFullName",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const customerNameColumnFilter = {
    columnName: 'general.customerName',
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "name",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const titleColumnFilter = {
    columnName: 'general.title',
    columnLabel: "title",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "title",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const nameColumnFilter = {
    columnName: 'general.title',
    columnLabel: "name",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "name",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}


export const customerTypeColumnFilter = {
    columnName: 'general.customerType',
    columnLabel: "customerType",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useCustomerDtoStore().getCustomerTypes(),
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "customerTypeIds",
                items: computed(() => customerTypes.value),
                value: null,
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const customerSectorColumnFilter = {
    columnName: 'general.sector',
    columnLabel: "sector",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useCustomerDtoStore().getCustomerSectors(),
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "sectorIds",
                items: computed(() => customerSectors.value),
                value: null,
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const customerParentColumnFilter = {
    columnName: 'general.parentCustomer',
    columnLabel: "parent",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                components: markRaw(CustomerSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "parentIds",
                items: computed(() => customerListItems.value),
                value: null,
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const customerIsPassiveColumnFilter = {
    columnName: 'general.status',
    columnLabel: "isPassive",
    valueFormatter: (value: any) => {
        return value.isPassive == false ? t('general.isActive') : t('general.passive')
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "isPassive",
                items: [{ title: t('general.activeCustomers'), value: 'false' }, { title: t('general.passiveCustomers'), value: 'true' }],
                value: null,
                fieldTitle: "title",
                fieldValue: "value"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const employeeColumnFilter = {
    columnName: 'list.employeeName',
    columnLabel: "employee.name",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                components: markRaw(EmployeeSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "employeeIds",
                value: []
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const companyBranchColumnFilter = {
    columnName: 'list.companyBranch',
    columnLabel: "companyBranch.name",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        getItems: () => useManagementDtoStore().getCompanyBranchList({ pageSize: 1000, pageNumber: 1 }),
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "companyBranchIds",
                items: computed(() => companyBranchList.value),
                value: [],
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}


export const documentNumberColumnFilter = {
    columnName: 'form.documentNumber',
    columnLabel: "offerCode",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "offerCode",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const agreementCodeColumnFilter = {
    columnName: 'form.code',
    columnLabel: "agreementCode",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "agreementCode",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const projectCodeColumnFilter = {
    columnName: 'form.code',
    columnLabel: "projectCode",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.Text,
                field: "projectCode",
                value: "",
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const offerListCustomerColumnFilter = {
    columnName: 'form.customerName',
    columnLabel: "customer.name",
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                components: markRaw(CustomerSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "customerIds",
                items: computed(() => customerListItems.value),
                value: [],
                fieldTitle: "name",
                fieldValue: "id"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}


export const offerListEmployeeColumnFilter = {
    columnName: 'form.salesRepresentative',
    columnLabel: "salesRepresentative",
    valueFormatter: (value) => {
        return value.salesRepresentative.firstName + ' ' + value.salesRepresentative.lastName
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                components: markRaw(EmployeeSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "salesRepresentativeIds",
                value: []
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}


export const documentStatusColumnFilter = {
    columnName: 'list.documentStatus',
    columnLabel: "status",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "status",
                items: enumToArray(ApprovementStatusEnum),
                value: null,
                fieldTitle: "title",
                fieldValue: "value",
                isEnum: true
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const approvementStatusColumnFilter = {
    columnName: 'form.status',
    columnLabel: "status",
    sortEnabled: false,
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "approvementStatus",
                items: enumToArray(ApprovementStatusEnum),
                value: null,
                fieldTitle: "title",
                fieldValue: "value",
                isEnum: true
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}


export const agreementListManagerColumnFilter = {
    columnName: 'form.manager',
    columnLabel: "manager",
    valueFormatter: (value) => {
        return value.manager.firstName + ' ' + value.manager.lastName
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                components: markRaw(EmployeeSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "managerIds",
                value: []
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const agreementListPartnerColumnFilter = {
    columnName: 'form.partner',
    columnLabel: "partner",
    valueFormatter: (value) => {
        return value.partner.firstName + ' ' + value.partner.lastName
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                components: markRaw(EmployeeSelectInput),
                type: FilterItemTypeEnum.MultipleSelect,
                field: "partnerIds",
                value: []
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const offerDocumentDateColumnFilter = {
    columnName: 'form.documentDate',
    columnLabel: "documentDate",
    valueFormatter: (value) => {
        return formatterDate(value.documentDate)
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.DateRange,
                field: ["documentStartDate", "documentEndDate"],
                value: [],
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}

export const offerTotalAmountColumnFilter = {
    columnName: 'form.totalAmount',
    columnLabel: "finalTotal",
    valueFormatter: (value: OfferListDto) => {
        return formatterPriceForCurrencyName(value.finalTotal, value.defaultCurrency.code)
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.NumberRange,
                field: ["finalTotalStart", "finalTotalEnd"],
                value: [],
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}


export const performanceStartDateColumnFilter = {
    columnName: 'form.startEndDate',
    columnLabel: "startEndDate",
    valueFormatter: (value) => {
        return formatterDate(value.startDate)
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.DateRange,
                field: ["startDate", "endDate"],
                value: [],
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}


export const performanceStatusColumnFilter = {
    columnName: 'list.status',
    columnLabel: "status",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    valueFormatter: (value) => {
        return t('enums.' + PeriodStatusType[value.status])
    },
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "statuses",
                items: enumToArray(PeriodStatusType),
                value: null,
                fieldTitle: "title",
                fieldValue: "value",
                isEnum: true
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}

export const templateStatusColumnFilter = {
    columnName: 'list.status',
    columnLabel: "status",
    sortEnabled: true,
    columnWidth: 175,
    filterEnabled: true,
    valueFormatter: (value) => {
        return t('enums.' + PerformanceTemplateStatus[value.status])
    },
    filterOption: {
        isFetch: false,
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.MultipleSelect,
                field: "templateStatuses",
                items: enumToArray(PerformanceTemplateStatus),
                value: null,
                fieldTitle: "title",
                fieldValue: "value",
                isEnum: true
            },
        ] as FilterItemsType[],
        action: (prop: ActiveFiltersType) => { },
    } as FilterOptionType,
}


export const isPassiveColumnFilter = {
    columnName: 'general.status',
    columnLabel: "isPassive",
    valueFormatter: (value: any) => {
        return value.isPassive == false ? t('general.isActive') : t('general.passive')
    },
    columnWidth: 175,
    filterEnabled: true,
    filterOption: {
        active: false,
        filters: [
            {
                type: FilterItemTypeEnum.SingleSelect,
                field: "isPassive",
                items: [{ title: t('general.isActive'), value: 'false' }, { title: t('general.passive'), value: 'true' }],
                value: null,
                fieldTitle: "title",
                fieldValue: "value"
            },
        ] as FilterItemsType[],
        action: (prop: any) => { }
    } as FilterOptionType,
}