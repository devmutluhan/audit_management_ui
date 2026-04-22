<template>
    <v-card :border="false">
        <PageTitleTeleport>
            <template v-slot:component>
                <VDialogContent>
                    <template v-slot:activator="{ props }">
                        <PageTitleCreateButton title="general.createConflict" v-bind="props">
                        </PageTitleCreateButton>
                    </template>
                    <template v-slot:default="{ isActive }">
                        <AddServiceConflictDialog :dialogClose="() => { isActive.value = false }"
                            @createItem="addConflict" />
                    </template>
                </VDialogContent>
            </template>
        </PageTitleTeleport>
        <v-card-text v-if="!loading">
            <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <VuetifyTable :data="initTableData" :headers="tableHeader" :group-by="groupBy">
                    </VuetifyTable>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
    </v-card>
    <VDialogContent v-model="updateDialog">
        <AddServiceConflictDialog :dialogClose="() => { updateDialog = false }" :selectedItem="selectedItem"
            @create-item="addConflict" />
    </VDialogContent>
    <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { clientFilter } from "@/core/helpers/generalUtils";
import AddServiceConflictDialog from "@/components/dialogs/crm/AddServiceConflictDialog.vue";
import { storeToRefs } from "pinia";
import { useCrmServiceStore } from "@/stores/crmStores/crmServiceStore";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { ConfirmModalType } from '@/models/types';
import VuetifyTable from "@/components/kt-datatable/VuetifyTable.vue";
import type { ConflictServiceDto } from "@/models/entities/crm/CrmServiceDtos";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { catchError } from "@/core/helpers/generalResponse";
import type { CreateConflictCommand } from "@/models/entities/crm/CrmServiceCommands";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";


const confirmDialog = ref(false);
const confirmModalValue = ref(new ConfirmModalType());
const groupBy = ref([{
    key: 'serviceName',
    groupMenuItems: [{
        title: "general.update",
        action: (item: ConflictServiceDto) => {
            updateDialog.value = true;
            selectedItem.value = item
        }
    },
    {
        title: "general.delete",
        action: (item: ConflictServiceDto) => {
            deleteFunc(item);
        }
    }]
}]);

const { conflictList, loading } = storeToRefs(useCrmServiceStore())
useCrmServiceStore().getConflictList();

const selectedItem = ref({} as ConflictServiceDto);
const updateDialog = ref(false);

const tableHeader = ref([
    {
        title: 'list.service',
        key: "service",
        sortable: true
    },
    {
        title: 'form.serviceGroup',
        key: "serviceGroupName",
        sortable: true
    },
    {
        title: 'list.actions',
        key: "actions",
        columnWidth: 135,
    }
])

const initTableData = ref([] as Array<ConflictServiceDto>)

watch(() => conflictList.value, () => {
    initTableData.value = conflictList.value;
});

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(conflictList.value, 'serviceName', searchName);
    } else {
        initTableData.value = conflictList.value
    }
}

const addConflict = (event: any) => {
    conflictList.value = conflictList.value.filter((x) => x.serviceId != event.serviceId);
    if (event.serviceGroups) {
        event.serviceGroups.forEach((x) => {
            conflictList.value.unshift(x);
        })
    }
}

const deleteFunc = (item: ConflictServiceDto) => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.delete',
        text: "general.deleteDescription",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            let command = {
                serviceId: item.serviceId,
                conflictedServiceGroupIds: []
            } as CreateConflictCommand
            useCrmServiceStore().createConflict(command).then(() => {
                confirmDialog.value = false;
                conflictList.value = conflictList.value.filter((a) => a.serviceId != item.serviceId);
            }).catch((error) => {
                return catchError(error, () => { deleteFunc(item) })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

</script>