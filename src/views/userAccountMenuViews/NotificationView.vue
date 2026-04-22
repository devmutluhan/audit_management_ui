<template>
    <v-card class="fill-height" border="false">
        <v-card-text class="fill-height">
            <v-row class="fill-height">
                <v-col cols="12">
                    <NotificationListTablePage :loading="loading" :tableData="notificationList"
                        @on-items-per-page-change="initListQuery.pageSize = $event; initListQuery.pageNumber = 1; isChange(activeFilters)"
                        @page-change="initListQuery.pageNumber = $event; isChange(activeFilters, true)"
                        @read-notification="readNotification($event)" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import NotificationListTablePage from "@/components/list/dataTables/NotificationListTablePage.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import type { ActiveFiltersType } from "@/models/types";
import { filterQuery } from "@/core/helpers/generalUtils";
import { activeFilters } from "@/core/data/readyFilterColumnObject";
import type { PaginatedList } from "@/models/ApiResult";
import { useGeneralStore } from "@/stores/generalStores/generalStore";
import type { NotificationsDto } from "@/models/entities/general/GeneralDtos";
import { catchError } from "@/core/helpers/generalResponse";
import { NotificationTypeEnum } from "@/models/custom/EnumTypes";

const { notificationList, loading, dashboardItems } = storeToRefs(useGeneralStore());
notificationList.value = {} as PaginatedList<NotificationsDto>;
const listQuery = ref({} as any);
const initListQuery = ref({} as any);
initListQuery.value.pageSize = 15;
initListQuery.value.pageNumber = 1;
initListQuery.value.notificationType = NotificationTypeEnum.InApp;

const isChange = (filterItems?: Array<ActiveFiltersType>, isPageChange?: boolean) => {
    if (filterItems && !isPageChange)
        initListQuery.value.pageNumber = 1

    const filters = filterItems ? filterItems : new Array<ActiveFiltersType>();
    listQuery.value = filterQuery(filters, initListQuery.value);

    useGeneralStore().getNotificationList(listQuery.value);
}
isChange();

watch(() => activeFilters.value.length, (newValue) => {
    isChange(activeFilters.value);
});


const readNotification = (item: NotificationsDto) => {
    useGeneralStore().readNotifications([item.id]).then((res) => {
        item.readAt = new Date().toString();
        // dashboardItems.value.notificationCount--
    }).catch((error) => {
        return catchError(error, () => { readNotification(item) })
    }).finally(() => { })
}

</script>