<template>
    <v-row class="fill-height">
        <v-col>
            <!-- Kullanılabilir İzin Bakiyesi -->
            <v-row>
                <v-col>
                    <AvailableVacationBalanceCard :employeeLeaveSummaryDetail="employeeLeaveSummaryDetail">
                    </AvailableVacationBalanceCard>
                </v-col>
            </v-row>

            <!-- İzin Listesi -->
            <v-row class="fill-height">
                <v-col>
                    <Datatable :data="employeeLeaveList.items ?? []" :header="tableHeader"
                        @rowDoubleClicked="(item) => previewVacationEmployee(item)" :loading="loading"
                        :enable-items-per-page-dropdown="false" :checkbox-enabled="false">

                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :menuItems="filterMenuItems(data)" :data="data" :routeId="data.id">
                            </GeneralDropdown>
                        </template>
                    </Datatable>
                    <VDialogContent v-model="dialog">
                        <PreviewEmployeeVacation :dialogClose="() => { dialog = false }" :leave="selectedItem" />
                    </VDialogContent>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import { ref } from 'vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import PreviewEmployeeVacation from "@/components/dialogs/humanResources/PreviewEmployeeVacation.vue";
import { storeToRefs } from "pinia";
import { useLeaveStore } from "@/stores/humanResourcesStores/leaveStore";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { EmployeeLeaveListDto } from "@/models/entities/humanResource/LeaveDtos";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import AvailableVacationBalanceCard from "./AvailableVacationBalanceCard.vue";

const { employeeLeaveSummaryDetail, loading, employeeLeaveList } = storeToRefs(useLeaveStore())

const dialog = ref(false);

const tableHeader = ref([
    {
        columnName: "form.startDate",
        columnLabel: "startDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return formatterDateFromHours(value.startDate)
        },
    },
    {
        columnName: "form.endDate",
        columnLabel: "endDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return formatterDateFromHours(value.endDate)
        },
    },
    {
        columnName: "list.duration",
        columnLabel: "usedDays",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.vacationType",
        columnLabel: "leaveType.name",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: "form.createdAt",
        columnLabel: "createdAt",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return formatterDateFromHours(value.createdAt)
        },
    },
    {
        columnName: 'list.status',
        columnLabel: "status",
        columnWidth: 135,
        valueFormatter: (value: EmployeeLeaveListDto) => {
            return enumToArray(ApprovementStatusEnum).find((a) => a.value == value.status)?.title ?? ''
        },
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);


const addVacationEmployee = () => {
    // Todo: downloadPdf, downloadWord işlemleri yapılacak.
}

const cancelFunc = (data: EmployeeLeaveListDto) => {
    const reason = menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.descriptionField : '';
    menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = true : '';
    useLeaveStore().cancelLeave(data.id, reason ?? '').then(() => {
        if (employeeLeaveList.value.items) {
            const index = employeeLeaveList.value.items.findIndex((a) => a.id == data.id);
            if (index != -1) {
                employeeLeaveList.value.items[index].status = ApprovementStatusEnum.Cancelled;
            }
        }
    }).catch((error) => {
        return catchError(error, () => cancelFunc(data));
    }).finally(() => {
        menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = false : '';
    });
}

const selectedItem = ref(new EmployeeLeaveListDto())
const previewVacationEmployee = (e: EmployeeLeaveListDto) => {
    dialog.value = true;
    selectedItem.value = e
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.preview",
        action: previewVacationEmployee,
    },
    {
        id: 2,
        title: "general.downloadWord",
        action: addVacationEmployee,
    },
    {
        id: 3,
        title: "general.downloadPdf",
        action: addVacationEmployee,
    },
    {
        id: 4,
        title: "general.toCancel",
        confirmModalValue: {
            text: "general.cancelDescription",
            buttonLoading: false,
            descriptionField: '',
            isDescriptionField: true,
            action: cancelFunc,
        },
    },
]);


const filterMenuItems = (item: EmployeeLeaveListDto): GeneralDropdownType[] => {
    if (item.status == ApprovementStatusEnum.Approved || item.status == ApprovementStatusEnum.SendBack) {
        return menuItems.value
    } else {
        return menuItems.value.filter((a) => a.id != 4);
    }
}


</script>