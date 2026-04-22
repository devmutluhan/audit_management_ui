<template>
    <v-col>
        <v-col class="pa-0" cols="6" sm="8" md="4">
            <SearchInput @update:model-value="searchFunc" />
        </v-col>
        <PageTitleTeleport>
            <template v-slot:component>
                <VDialogContent>
                    <template v-slot:activator="{ props }">
                        <PageTitleCreateButton v-bind="props" title="general.newApprovalProcess">
                        </PageTitleCreateButton>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddApprovalProcesses :dialogClose="() => { isActive.value = false }"
                            @createItem="useApprovalProcessStore().getProcessList()" />
                    </template>
                </VDialogContent>
            </template>
        </PageTitleTeleport>
        <Loading v-if="loading"></Loading>
        <v-row v-if="initApprovalProcessList.length > 0 && !loading">
            <v-col cols="12" v-for="(item, index) in initApprovalProcessList" :key="index">
                <v-card>
                    <v-card-text>
                        <v-row class="d-flex align-center">
                            <v-col cols="auto" class="text-h6 font-weight-bold">
                                {{ item.name }}
                            </v-col>
                            <v-col cols="auto" v-if="item.isPrivate" class="text-h6 font-weight-bold text-red">
                                *
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto" v-if="item.id !== '0'">
                                <GeneralDropdown :menu-items="menuItems" :data="item"></GeneralDropdown>
                            </v-col>
                        </v-row>
                        <v-col>
                            <v-row class="d-flex align-center">
                                <v-col cols="6" sm="3" lg="2">
                                    <v-row class="d-flex align-center">
                                        <v-col class="px-1">
                                            <v-card border="false" color="approverCard">
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="3" class="pa-0 d-inline-flex">
                                                            <v-card color="blue" align="center"
                                                                class="d-flex align-center justify-center">
                                                                <v-icon size="22">mdi-account-heart-outline</v-icon>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col>
                                                            {{ $t('list.employee') }}
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="auto" class="px-1">
                                            <v-icon color="toolbarButton">mdi-arrow-right</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" sm="3" lg="2" v-for="(employee, i) in item.approvers" :key="i">
                                    <v-row class="d-flex align-center">
                                        <v-col class="px-1">
                                            <v-card border="false" color="approverCard">
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="3" class="pa-0 d-inline-flex">
                                                            <ImageCard :firstValue="employee.approver.firstName"
                                                                :secondValue="employee.approver.lastName"
                                                                :avatarText="employee.approver.avatarUrl" />
                                                        </v-col>
                                                        <v-col>
                                                            {{ employee.approver.firstName }}
                                                            {{ employee.approver.lastName }}
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="auto" class="px-1">
                                            <v-icon color="toolbarButton">mdi-arrow-right</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6" sm="3" lg="2">
                                    <v-row class="d-flex align-center">
                                        <v-col class="px-1">
                                            <v-card border="false" color="approverCard">
                                                <v-card-text>
                                                    <v-row>
                                                        <v-col cols="3" class="pa-0 d-inline-flex">
                                                            <v-card color="success" align="center"
                                                                class="d-flex align-center justify-center">
                                                                <v-icon>mdi-check</v-icon>
                                                            </v-card>
                                                        </v-col>
                                                        <v-col>
                                                            {{ $t('enums.Onaylandi') }}
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else-if="!loading">
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-row class="d-flex align-center">
                            <v-col cols="12" class="text-h6 font-weight-bold text-center">
                                {{ $t('general.noData') }}
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <VDialogContent v-model="updateDialog">
            <UpdateApprovalProcesses :dialogClose="() => { updateDialog = false }" :updateItem="updateItem"
                @createItem="useApprovalProcessStore().getProcessList()" />
        </VDialogContent>
    </v-col>
</template>

<script lang="ts" setup>

import GeneralDropdown from '@/components/dropdown/GeneralDropdown.vue';
import AddApprovalProcesses from '@/components/dialogs/definitions/AddApprovalProcesses.vue';
import { ref } from 'vue';
import { useApprovalProcessStore } from '@/stores/approvalProcessStores/approvalProcessStore';
import ImageCard from '@/components/cards/ImageCard.vue';
import { storeToRefs } from 'pinia';
import { ApprovalProcessDto } from '@/models/entities/approvalProcess/ApprovalProcessDtos';
import { catchError } from '@/core/helpers/generalResponse';
import type { GeneralDropdownType } from '@/models/types';
import UpdateApprovalProcesses from '@/components/dialogs/definitions/UpdateApprovalProcesses.vue';
import { clientFilter } from '@/core/helpers/generalUtils';
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import PageTitleTeleport from '@/components/teleports/PageTitleTeleport.vue';
import PageTitleCreateButton from '@/components/formInput/generalInputs/PageTitleCreateButton.vue';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const { approvalProcessList, initApprovalProcessList, loading } = storeToRefs(useApprovalProcessStore())
approvalProcessList.value = new Array<ApprovalProcessDto>();
initApprovalProcessList.value = new Array<ApprovalProcessDto>();

useApprovalProcessStore().getProcessList()
const updateDialog = ref(false)
const updateItem = ref(new ApprovalProcessDto())
const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: ApprovalProcessDto) => {
            updateItem.value = item;
            updateDialog.value = true;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: (item: ApprovalProcessDto) => deleteApprovalProcess(item),
        },
    }
]);

const deleteApprovalProcess = (approvalProcess: ApprovalProcessDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useApprovalProcessStore().deleteApprovalProcess(approvalProcess.id).then(() => {
        approvalProcessList.value = approvalProcessList.value.filter((item: any) => item.id !== approvalProcess.id);
        initApprovalProcessList.value = initApprovalProcessList.value.filter((item: any) => item.id !== approvalProcess.id);
    }).catch((error) => {
        return catchError(error, () => deleteApprovalProcess(approvalProcess));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initApprovalProcessList.value = clientFilter(approvalProcessList.value, 'name', searchName);
    } else {
        initApprovalProcessList.value = approvalProcessList.value
    }
}

</script>