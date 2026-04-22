<template>
    <v-card :border="false">
        <v-card-text v-if="!generalLoading">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props }">
                            <PageTitleCreateButton title="general.createServiceGroup" v-bind="props">
                            </PageTitleCreateButton>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <AddServiceGroupDialog :dialogClose="() => { isActive.value = false }"
                                @create-item="useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 });" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col>
            <v-row v-if="initTableData.length > 0">
                <v-col cols="12" class="px-0">
                    <v-card class="w-100" border="false" style="overflow-x: auto;">
                        <v-card-text class="pa-0" style="min-width: 400px;">
                            <TreeListForServiceGroup :items="initTableData" :loading="loading" :menuItems="menuItems"
                                :getDetailMethod="treeListGetDetail">
                            </TreeListForServiceGroup>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class="text-h6">
                    <NoDataCard />
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
    </v-card>
    <!-- Hizmet Grubuna 1 Tane Hizmet Ekler -->
    <v-dialog v-model="addToServiceForGroupDialog" width="800">
        <AddServiceForGroupDialog :dialogClose="() => { addToServiceForGroupDialog = false }"
            :selectedItem="selectedItem" @createItem="selectedItem.subItems.unshift($event)" />
    </v-dialog>
    <!-- Hizmet Grubunu Günceller -->
    <v-dialog v-model="updateServiceGroupDialog" width="800">
        <UpdateServiceGroupDialog :dialogClose="() => { updateServiceGroupDialog = false }"
            :selectedItem="selectedItem" />
    </v-dialog>
    <!-- Hizmet Grubuna Pozisyon Ekler (Altındaki bütün hizmetlere eklenir) -->
    <v-dialog v-model="addToPositionForServiceGroupDialog" width="800">
        <AddPositionForGroupOrServiceDialog :dialogClose="() => { addToPositionForServiceGroupDialog = false }"
            :isGroup="true" :selectedItem="selectedItem" />
    </v-dialog>
    <!-- Hizmete Pozisyon Ekler -->
    <v-dialog v-model="addToPositionForServiceDialog" width="800">
        <AddPositionForGroupOrServiceDialog :dialogClose="() => { addToPositionForServiceDialog = false }"
            :isGroup="false" :selectedItem="selectedItem" />
    </v-dialog>
    <!-- Hizmeti Günceller -->
    <v-dialog v-model="updateServiceDialog" width="800">
        <UpdateServiceDialog :dialogClose="() => { updateServiceDialog = false }" :selectedItem="selectedItem" />
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { GeneralDropdownType } from "@/models/types";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import AddServiceGroupDialog from "@/components/dialogs/crm/AddServiceGroupDialog.vue"
import TreeListForServiceGroup from "@/components/list/treeViews/TreeListForServiceGroup.vue";
import { useCrmServiceStore } from "@/stores/crmStores/crmServiceStore";
import { storeToRefs } from "pinia";
import type { LookupDto, PaginatedList } from "@/models/ApiResult";
import type { ServiceDto, ServiceGroupDto } from "@/models/entities/crm/CrmServiceDtos";
import NoDataCard from '@/components/list/cards/NoDataCard.vue';
import { catchError } from "@/core/helpers/generalResponse";
import AddServiceForGroupDialog from "@/components/dialogs/crm/AddServiceForGroupDialog.vue"
import AddPositionForGroupOrServiceDialog from "@/components/dialogs/crm/AddPositionForGroupOrServiceDialog.vue"
import UpdateServiceDialog from "@/components/dialogs/crm/UpdateServiceDialog.vue"
import UpdateServiceGroupDialog from "@/components/dialogs/crm/UpdateServiceGroupDialog.vue"
import { clientFilter } from "@/core/helpers/generalUtils";
import { onMounted } from "vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";

const { serviceGroupList } = storeToRefs(useCrmServiceStore());
const generalLoading = ref(true)
useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 }).finally(() => {
    generalLoading.value = false
})

const loading = ref(false);
const selectedItem = ref(null as any);
const addToServiceForGroupDialog = ref(false);
const addToPositionForServiceGroupDialog = ref(false);
const addToPositionForServiceDialog = ref(false);
const updateServiceGroupDialog = ref(false);
const updateServiceDialog = ref(false);

const treeListGetDetail = (item: any) => {
    loading.value = true;
    if (!item.subItems) {
        if (Object.keys(item).includes('companyBranch')) {
            useCrmServiceStore().getServiceList({ pageSize: 1000, pageNumber: 1, serviceGroupId: item.id }).then((res: PaginatedList<ServiceDto>) => {
                item.subItems = res.items;
            }).catch((error) => {
                catchError(error, () => { treeListGetDetail(item) })
            }).finally(() => {
                loading.value = false
            })
        } else if (Object.keys(item).includes('inRotation')) {
            useCrmServiceStore().getPositionListForService(item.id).then((res: Array<LookupDto>) => {
                const response = res.map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        service: { id: item.id, name: item.title },
                        serviceGroup: { id: item.serviceGroup.id, name: item.serviceGroup.title, }
                    }
                })
                item.subItems = response;
            }).catch((error) => {
                catchError(error, () => { treeListGetDetail(item) })
            }).finally(() => {
                loading.value = false
            })
        }
    }
}

const initTableData = ref(new Array<ServiceGroupDto>())

watch(() => serviceGroupList.value.totalCount, () => {
    initTableData.value = serviceGroupList.value.items ?? []
});

onMounted(() => {
    initTableData.value = serviceGroupList.value.items ?? [];
})

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(serviceGroupList.value.items ?? [], 'title', searchName);
    } else {
        initTableData.value = serviceGroupList.value.items ?? []
    }
}

const deleteServiceGroup = (data: any) => {
    menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = true : '';
    useCrmServiceStore().deleteServiceGroup(data.id).then(() => {
        if (serviceGroupList.value.items) {
            let serviceGroupIndex = serviceGroupList.value.items.findIndex((x: any) => x.id == data.id);
            serviceGroupList.value.items.splice(serviceGroupIndex, 1);
            serviceGroupList.value.totalCount -= 1
        }
    }).catch((error) => {
        return catchError(error, () => { deletePosition(data) })
    }).finally(() => {
        menuItems.value[3].confirmModalValue ? menuItems.value[3].confirmModalValue.buttonLoading = false : '';
    })
}

const deleteService = (data: any) => {
    menuItems.value[6].confirmModalValue ? menuItems.value[6].confirmModalValue.buttonLoading = true : '';
    useCrmServiceStore().deleteService(data.serviceGroup.id, data.id).then(() => {
        if (serviceGroupList.value.items) {
            let serviceGroupIndex = serviceGroupList.value.items.findIndex((x: any) => x.id == data.serviceGroup.id);
            let serviceIndex = serviceGroupList.value.items[serviceGroupIndex].subItems.findIndex((a: any) => a.id == data.id);
            serviceGroupList.value.items[serviceGroupIndex].subItems.splice(serviceIndex, 1)
            if (serviceGroupList.value.items[serviceGroupIndex].subItems.length == 0) {
                serviceGroupList.value.items[serviceGroupIndex].hasChild = false;
            }
        }
    }).catch((error) => {
        return catchError(error, () => { deletePosition(data) })
    }).finally(() => {
        menuItems.value[6].confirmModalValue ? menuItems.value[6].confirmModalValue.buttonLoading = false : '';
    })
}

const deletePosition = (data: any) => {
    menuItems.value[7].confirmModalValue ? menuItems.value[7].confirmModalValue.buttonLoading = true : '';
    useCrmServiceStore().deletePositionForService(data.serviceGroup.id, data.service.id, data.id).then(() => {
        if (serviceGroupList.value.items) {
            let serviceGroupIndex = serviceGroupList.value.items.findIndex((x: any) => x.id == data.serviceGroup.id);
            if (serviceGroupList.value.items[serviceGroupIndex].subItems) {
                let serviceIndex = serviceGroupList.value.items[serviceGroupIndex].subItems.findIndex((a: any) => a.id == data.service.id);
                let positionIndex = serviceGroupList.value.items[serviceGroupIndex].subItems[serviceIndex].subItems.findIndex((x: any) => x.id == data.id)
                serviceGroupList.value.items[serviceGroupIndex].subItems[serviceIndex].subItems.splice(positionIndex, 1)
                if (serviceGroupList.value.items[serviceGroupIndex].subItems[serviceIndex].subItems.length == 0) {
                    serviceGroupList.value.items[serviceGroupIndex].subItems[serviceIndex].hasChild = false;
                }
            }
        }
    }).catch((error) => {
        return catchError(error, () => { deletePosition(data) })
    }).finally(() => {
        menuItems.value[7].confirmModalValue ? menuItems.value[7].confirmModalValue.buttonLoading = false : '';
    })
}


const menuItems = ref<GeneralDropdownType[]>([
    // Hizmet grubunda gözükecekler
    {
        id: 1,
        title: "list.addToServiceForGroup", // hizmet ekle - sadece 1 tane hizmet ekleyecek seçili gruba  POST /api/crm/service-groups/{serviceGroupId}/services
        action: (item: any) => {
            addToServiceForGroupDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        id: 2,
        title: "list.addToPositionForServiceGroup", // pozisyon ekle - hizmet grubundaki bütün hizmetlere pozisyonlar seçip ekleyecek (serviceId null yolla) POST /api/crm/service-groups/{serviceGroupId}/services/positions
        action: (item: any) => {
            addToPositionForServiceGroupDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        id: 3,
        title: "general.update", // güncelle - sadece title güncelleyebilecek  PUT /api/crm/service-groups/{id}
        action: (item: any) => {
            updateServiceGroupDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        id: 4,
        title: "general.delete", // sil - hizmet grubunu silecek Delete /api/crm/service-groups/{id}
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteServiceGroup,
        },
    },
    // Hizmette gözükecek butonlar
    {
        id: 5,
        title: "list.addToPositionForService", // pozisyon ekle - hizmete (serviceId null olmamalı) pozisyonlar seçip ekleyecek POST /api/crm/service-groups/{serviceGroupId}/services/positions
        action: (item: any) => {
            addToPositionForServiceDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        id: 6,
        title: "general.update", // güncelle - sadece hizmeti güncelleyebilecek  PUT /api/crm/service-groups/{serviceGroupId}/services/{id}
        action: (item: any) => {
            updateServiceDialog.value = true;
            selectedItem.value = item;
        }
    },
    {
        id: 7,
        title: "general.delete", // sil - hizmeti silebilecek  DELETE /api/crm/service-groups/{serviceGroupId}/services/{id}
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteService,
        },
    },
    // Pozisyonda gözükecek butonlar
    {
        id: 8,
        title: "general.delete", // pozisyon sil - sadece 1 tane hizmet ekleyecek seçili gruba  DELETE /api/crm/service-groups/{serviceGroupId}/services/{id}/positions/{positionId}
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deletePosition,
        },
    },
]);
</script>