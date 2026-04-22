<template>
    <v-row class="fill-height">
        <v-col>
            <Datatable :data="advanceList.items ?? []" :loading="loading" :header="tableHeader"
                :enable-items-per-page-dropdown="false" :checkbox-enabled="false">
                <template v-slot:actions="{ row: data }">
                    <GeneralDropdown :menuItems="filterMenuItems(data)" :routeId="data.id" :data="data">
                    </GeneralDropdown>
                </template>
                <template v-slot:isPaid="{ row: data }">
                    <span :class="data.isPaid ? 'text-priceTextColor' : 'text-error'">
                        {{ data.isPaid ? $t('list.isPaid') : $t('list.notPaid') }}
                    </span>
                </template>
                <template v-slot:approvementStatus="{ row: data }">
                    <v-chip class="font-weight-bold" :color="getChipColor(data.approvementStatus)">
                        {{enumToArray(ApprovementStatusEnum).find((a) => a.value ==
                            data.approvementStatus)?.title}}
                    </v-chip>
                </template>
            </Datatable>
            <VDialogContent v-model="previewDialog">
                <PreviewAdvanceDialog :dialogClose="() => { previewDialog = false }" :selectedItem="selectedItem" />
            </VDialogContent>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { GeneralDropdownType } from "@/models/types";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { formatterPriceForCurrencyName, getChipColor } from "@/core/helpers/generalUtils";
import { catchError } from "@/core/helpers/generalResponse";
import { enumToArray } from "@/core/helpers/enumToArray";
import { ApprovementStatusEnum } from "@/models/custom/EnumTypes";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PreviewAdvanceDialog from "@/components/dialogs/humanResources/PreviewAdvanceDialog.vue";
import { usePaymentStore } from "@/stores/humanResourcesStores/paymentStore";
import { AdvanceListDto } from "@/models/entities/humanResource/PaymentModels";

const route = useRoute()
const previewDialog = ref(false);

const { advanceList } = storeToRefs(usePaymentStore())
const loading = ref(false)
const getEmployeeAdvance = () => {
    loading.value = true;
    usePaymentStore().getAdvanceList({ employeeId: route.params.id.toString(), pageNumber: 1, pageSize: 1000 }).catch((error) => {
        return catchError(error, () => { getEmployeeAdvance() })
    }).finally(() => {
        loading.value = false
    })
}
getEmployeeAdvance();

const tableHeader = ref([
    {
        columnName: "form.isPaidStatus",
        columnLabel: "isPaid",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: "list.creator",
        columnLabel: "creator.fullName",
        columnWidth: 175,
        filterEnabled: false,
    },
    {
        columnName: "form.amount",
        columnLabel: "amount",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: AdvanceListDto) => {
            return formatterPriceForCurrencyName(value.amount);
        }
    },
    {
        columnName: "list.startsAt",
        columnLabel: "startsAt",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: AdvanceListDto) => {
            return formatterDateFromHours(value.startsAt);
        }
    },
    {
        columnName: "form.createdAt",
        columnLabel: "createdAt",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: AdvanceListDto) => {
            return formatterDateFromHours(value.createdAt);
        }
    },
    {
        columnName: "form.approvementStatus",
        columnLabel: "approvementStatus",
        columnWidth: 175,
        filterEnabled: false
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
]);

const selectedItem = ref(new AdvanceListDto());

const deleteFunc = (data: AdvanceListDto) => {
    const findIndex = menuItems.value.findIndex((a) => a.id == 2);
    const confirmModal = menuItems.value[findIndex].confirmModalValue;
    if (findIndex != -1) {
        confirmModal ? confirmModal.buttonLoading = true : null;
        usePaymentStore().deleteAdvance(data.id).then(() => {
            if (advanceList.value.items) {
                advanceList.value.items = advanceList.value.items.filter((a: AdvanceListDto) => a.id != data.id);
            }
        }).catch((error) => {
            return catchError(error, () => deleteFunc(data))
        }).finally(() => {
            confirmModal ? confirmModal.buttonLoading = false : null;
        });
    }
}

const sendApproveFunc = (data: AdvanceListDto) => {
    usePaymentStore().sendAdvance(data.id).then((res: any) => {
        if (advanceList.value.items) {
            const index = advanceList.value.items.findIndex((a) => a.id == data.id);
            if (index != -1) {
                advanceList.value.items[index].approvementStatus = res.data.status
            }
        }
    }).catch((error) => {
        return catchError(error, () => sendApproveFunc(data))
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        id: 1,
        title: "general.detailView",
        action: (data) => {
            selectedItem.value = data;
            previewDialog.value = true;
        },
    },
    {
        id: 2,
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
    {
        id: 3,
        title: "general.sendForApproval",
        action: sendApproveFunc,
    },
    {
        id: 4,
        title: "general.toCancel",
        confirmModalValue: {
            text: "general.cancelDescription",
            buttonLoading: false,
            isDescriptionField: true,
            descriptionField: "",
            action: (data) => {
                const findIndex = menuItems.value.findIndex((a) => a.id == 4);
                if (findIndex != -1) {
                    const confirmModal = menuItems.value[findIndex].confirmModalValue;
                    const reason = confirmModal ? confirmModal.descriptionField : '';
                    confirmModal ? confirmModal.buttonLoading = true : ''
                    usePaymentStore().cancelAdvance(data.id, reason ?? '').then(() => {
                        if (advanceList.value.items) {
                            const index = advanceList.value.items.findIndex((a) => a.id == data.id);
                            if (index != -1) {
                                advanceList.value.items[index].approvementStatus = ApprovementStatusEnum.Cancelled;
                            }
                        }
                    }).catch((error) => {
                        return catchError(error, () => { confirmModal ? confirmModal.action : '' })
                    }).finally(() => {
                        confirmModal ? confirmModal.buttonLoading = false : ''
                    });
                }
            },
        },
    },
]);


const filterMenuItems = (item: AdvanceListDto): GeneralDropdownType[] => {
    if (item.approvementStatus == ApprovementStatusEnum.Draft) {
        return menuItems.value.filter((a) => a.id != 4);
    } else if (item.approvementStatus == ApprovementStatusEnum.Waiting || item.approvementStatus == ApprovementStatusEnum.Cancelled || item.approvementStatus == ApprovementStatusEnum.Rejected) {
        return menuItems.value.filter((a) => a.id == 1);
    } else if (item.approvementStatus == ApprovementStatusEnum.Approved || item.approvementStatus == ApprovementStatusEnum.SendBack) {
        return menuItems.value.filter((a) => a.id == 1 || a.id == 4)
    } else {
        return menuItems.value
    }
}


</script>