<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <v-row>
                <v-col cols="6" sm="6" md="3" class="pr-1">
                    <SingleSelectInput v-model="initListQuery.isTerminated" :items="isPassiveFilterItems"
                        item-title="title" item-value="value" inputLabel="general.activeOrTerminated" clearable
                        hide-details @update:model-value="isChange(activeFilters)"
                        @click-clear="initListQuery.isTerminated = null; isChange(activeFilters)" />
                </v-col>
                <v-col cols="6" sm="6" md="3" class="pr-1">
                    <SingleSelectInput v-model="initListQuery.withoutClaimTemplate" :items="isWithoutClaimItems"
                        item-title="title" item-value="value" inputLabel="general.withoutClaimTemplate" clearable
                        hide-details @update:model-value="isChange(activeFilters)"
                        @click-clear="initListQuery.withoutClaimTemplate = null; isChange(activeFilters)" />
                </v-col>
            </v-row>
            <v-row class="fill-height">
                <v-col>
                    <Datatable :data="employeeDropdownList.items ? employeeDropdownList.items : []"
                        :header="tableHeader" :enable-items-per-page-dropdown="true" :loading="loading"
                        :currentPage="employeeDropdownList.pageNumber" :total="employeeDropdownList.totalCount"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)">
                        <template v-slot:fullName="{ row: data }">
                            {{ data.firstName + ' ' + data.lastName }}
                        </template>
                        <template v-slot:appUserState="{ row: data }">
                            <v-chip :color="getChipColor(data.appUserState)"
                                @click="historyDialog = true; selectedEmployee = data">
                                {{
                                    enumToArray(EmployeeStatusTypeEnum).find((x: any) => x.value ==
                                        data.appUserState)?.title
                                }}
                            </v-chip>
                        </template>
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="filterMenuItems(data.appUserState)" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
        <VDialogContent v-model="historyDialog">
            <InviteHistoryDialog :dialogClose="() => { historyDialog = false }" :selectedItem="selectedEmployee" />
        </VDialogContent>
        <VDialogContent v-model="updateDialog">
            <UpdateClaimCardFromUserDialog :dialogClose="() => { updateDialog = false }"
                :selectedItem="selectedEmployee" />
        </VDialogContent>
        <ConfirmDialog v-model="confirmDialog" :modal="confirmDialogValue" />
    </v-card>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ConfirmModalType, type ActiveFiltersType, type GeneralDropdownType } from '@/models/types';
import InviteHistoryDialog from '@/components/dialogs/definitions/InviteHistoryDialog.vue';
import UpdateClaimCardFromUserDialog from '@/components/dialogs/definitions/UpdateClaimCardFromUserDialog.vue';
import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { EmployeeDropdownListDto } from '@/models/entities/humanResource/EmployeeDtos';
import { activeFilters, employeeFullNameColumnFilter, employeePositionColumnFilter, employeeStatusColumnFilter, mountComponentForFilter } from '@/core/data/readyFilterColumnObject';
import { filterQuery } from '@/core/helpers/generalUtils';
import type { PaginatedList } from '@/models/ApiResult';
import { enumToArray } from '@/core/helpers/enumToArray';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';

import { useUserStore } from '@/stores/userStores/userStore';
import { catchError } from '@/core/helpers/generalResponse';
import i18n from '@/core/plugins/i18n';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
const t = i18n.global.t;

const isPassiveFilterItems = ref([
    { title: t('general.activeEmployee'), value: false },
    { title: t('general.terminatedEmployee'), value: true }
]);
const isWithoutClaimItems = ref([
    { title: t('general.hasClaim'), value: true },
    { title: t('general.hasNotClaim'), value: false }
]);

const confirmDialogValue = ref(new ConfirmModalType());
const confirmDialog = ref(false);
const historyDialog = ref(false);
const updateDialog = ref(false);
const selectedEmployee = ref(new EmployeeDropdownListDto());
const { employeeDropdownList, loading } = storeToRefs(useEmployeeDtoStore())
employeeDropdownList.value = {} as PaginatedList<EmployeeDropdownListDto>;

const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 10;
initListQuery.value.pageNumber = 1;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value)

    useEmployeeDtoStore().getEmployeeDropdownList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value)
});

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.update",
        action: (item: any) => {
            selectedEmployee.value = item
            updateDialog.value = true;
        },
    },
    {
        id: 2,
        title: "general.invite",
        action: (item: EmployeeDropdownListDto) => {
            if (item.workEmail) {
                selectedEmployee.value = item;
                confirmDialog.value = true;
                confirmDialogValue.value = {
                    title: "general.invite",
                    text: "general.inviteDescription",
                    icon: "mdi-account-arrow-left-outline",
                    buttonLoading: false,
                    action: () => inviteEmployee()
                }
            } else {
                ErrorStatusResult[400]({ message: 'statusCode.notFoundWorkEmail' })
            }
        },
    },
    {
        id: 3,
        title: "general.cancelInvite",
        action: (item: EmployeeDropdownListDto) => {
            if (item.workEmail) {
                selectedEmployee.value = item;
                confirmDialog.value = true;
                confirmDialogValue.value = {
                    title: "general.cancelInvite",
                    text: "general.cancelInviteDescription",
                    icon: "mdi-account-arrow-left-outline",
                    buttonLoading: false,
                    action: () => cancelInviteEmployee()
                }
            } else {
                ErrorStatusResult[400]({ message: 'statusCode.notFoundWorkEmail' })
            }
        },
    },
    {
        id: 4,
        title: "general.blockedUser",
        action: (item: EmployeeDropdownListDto) => {
            selectedEmployee.value = item;
            confirmDialog.value = true;
            confirmDialogValue.value = {
                title: "general.blockedUser",
                text: "general.blockDescription",
                icon: "mdi-account-lock",
                buttonLoading: false,
                action: () => blockedUser()
            }
        },
    },
    {
        id: 5,
        title: "general.confirmUser",
        action: (item: EmployeeDropdownListDto) => {
            selectedEmployee.value = item;
            confirmDialog.value = true;
            confirmDialogValue.value = {
                title: "general.confirmUser",
                text: "general.confirmDescription",
                icon: "mdi-account-lock-open",
                buttonLoading: false,
                action: () => unBlockedUser()
            }
        },
    }
]);

const cancelInviteEmployee = () => {
    confirmDialogValue.value.buttonLoading = true;
    useUserStore().cancelInvite(selectedEmployee.value.id).then((res) => {
        confirmDialog.value = false;
        if (employeeDropdownList.value.items) {
            const index = employeeDropdownList.value.items?.findIndex((a) => a.id == selectedEmployee.value.id)
            if (index != -1) {
                employeeDropdownList.value.items[index].appUserState = EmployeeStatusTypeEnum.NoneEmployee;
            }
        }
    }).catch((error) => {
        return catchError(error, () => { cancelInviteEmployee() })
    }).finally(() => {
        confirmDialogValue.value.buttonLoading = false;
    })
}

const inviteEmployee = () => {
    confirmDialogValue.value.buttonLoading = true;
    useUserStore().inviteUser(selectedEmployee.value.id).then((res) => {
        confirmDialog.value = false;
        if (employeeDropdownList.value.items) {
            const index = employeeDropdownList.value.items?.findIndex((a) => a.id == selectedEmployee.value.id)
            if (index != -1) {
                employeeDropdownList.value.items[index].appUserState = EmployeeStatusTypeEnum.Invited;
            }
        }
    }).catch((error) => {
        return catchError(error, () => { inviteEmployee() })
    }).finally(() => {
        confirmDialogValue.value.buttonLoading = false;
    })
}

const blockedUser = () => {
    confirmDialogValue.value.buttonLoading = true;
    useUserStore().blockedUser(selectedEmployee.value.id).then((res) => {
        confirmDialog.value = false;
        if (employeeDropdownList.value.items) {
            const index = employeeDropdownList.value.items?.findIndex((a) => a.id == selectedEmployee.value.id)
            if (index != -1) {
                employeeDropdownList.value.items[index].appUserState = EmployeeStatusTypeEnum.Locked;
            }
        }
    }).catch((error) => {
        return catchError(error, () => { blockedUser() })
    }).finally(() => {
        confirmDialogValue.value.buttonLoading = false;
    })
}

const unBlockedUser = () => {
    confirmDialogValue.value.buttonLoading = true;
    useUserStore().confirmUser(selectedEmployee.value.id).then((res) => {
        confirmDialog.value = false;
        if (employeeDropdownList.value.items) {
            const index = employeeDropdownList.value.items?.findIndex((a) => a.id == selectedEmployee.value.id)
            if (index != -1) {
                employeeDropdownList.value.items[index].appUserState = EmployeeStatusTypeEnum.Valid;
            }
        }
    }).catch((error) => {
        return catchError(error, () => { unBlockedUser() })
    }).finally(() => {
        confirmDialogValue.value.buttonLoading = false;
    })
}

const tableHeader = ref([
    employeeFullNameColumnFilter,
    employeePositionColumnFilter,
    {
        columnName: 'form.workingEmail',
        columnLabel: "workEmail",
        sortEnabled: true,
        columnWidth: 175,
    },
    employeeStatusColumnFilter,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 1,
    },
]);

const getChipColor = (status: Number) => {
    if (EmployeeStatusTypeEnum.NoneEmployee == status)
        return 'warning'
    else if (EmployeeStatusTypeEnum.Locked == status)
        return 'error'
    else if (EmployeeStatusTypeEnum.Valid == status)
        return 'success'
    else if (EmployeeStatusTypeEnum.Invited == status)
        return 'primary'
    else
        return 'red'
}

const filterMenuItems = (status: Number): (GeneralDropdownType[]) => {
    if (EmployeeStatusTypeEnum.NoneEmployee == status)
        return menuItems.value.filter((x: any) => x.id !== 3 && x.id !== 4 && x.id !== 5)
    else if (EmployeeStatusTypeEnum.Invited == status)
        return menuItems.value.filter((x: any) => x.id !== 2 && x.id !== 4 && x.id !== 5)
    else if (EmployeeStatusTypeEnum.Valid == status)
        return menuItems.value.filter((x: any) => x.id !== 2 && x.id !== 3 && x.id !== 5)
    else if (EmployeeStatusTypeEnum.Locked == status)
        return menuItems.value.filter((x: any) => x.id !== 2 && x.id !== 3 && x.id !== 4)
    else
        return menuItems.value
}

onMounted(() => {
    mountComponentForFilter(tableHeader.value)
});

</script>