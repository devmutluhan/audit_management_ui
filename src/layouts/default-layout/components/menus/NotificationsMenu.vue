<template>
  <v-card class="bg-dropdownCard">
    <v-card-text>
      <v-toolbar color="transparent">
        <h3 class="fw-semibold px-9 mt-10 mb-6 text-headerTextColor">
          {{ $t('general.notifications') }}
        </h3>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card v-if="!loading" border="false" color="dropdownCard" class="w-350px w-lg-375px overflow-auto"
        max-height="50vh">
        <v-card-text max-height="50vh" v-if="notificationList.items ? notificationList.items.length > 0 : false">
          <v-row>
            <v-col cols="12" v-for="(item, index) in notificationList.items" :key="index">
              <v-card border @click="!item.readAt ? readNotification(item) : null">
                <template #append v-if="!item.readAt">
                  <v-icon color="primary">mdi-record</v-icon>
                </template>
                <template #title>
                  <p class="text-body-1 font-weight-bold mb-1 text-headerTextColor">
                    {{ item.title }}
                  </p>
                </template>
                <template #text>
                  <p class="text-caption font-weight-bold text-rowTextColor ma-0">
                    {{ item.message }}
                  </p>
                </template>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          <v-alert color="warning" variant="outlined">
            {{ $t('general.noDataNotification') }}
          </v-alert>
        </v-card-text>
      </v-card>
      <v-card v-else border="false" color="dropdownCard" class="w-350px w-lg-375px" max-height="50vh">
        <Loading></Loading>
      </v-card>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" align="end">
          <router-link class="text-success font-weight-bold" :to="{ name: 'notification' }">
            {{ $t('list.viewAll') }}
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';
import { catchError } from '@/core/helpers/generalResponse';
import type { PaginatedList } from '@/models/ApiResult';
import { NotificationStatusEnum, NotificationTypeEnum } from '@/models/custom/EnumTypes';
import type { NotificationsDto } from '@/models/entities/general/GeneralDtos';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { dashboardItems } = storeToRefs(useGeneralStore());
const loading = ref(false);
const notificationList = ref({} as PaginatedList<NotificationsDto>);

const readNotification = (item: NotificationsDto) => {
  useGeneralStore().readNotifications([item.id]).then((res) => {
    item.readAt = new Date().toString();
    // dashboardItems.value.notificationCount--
  }).catch((error) => {
    return catchError(error, () => { readNotification(item) })
  }).finally(() => { })
}

const getNotificationList = () => {
  notificationList.value = {} as PaginatedList<NotificationsDto>;
  loading.value = true
  useGeneralStore().getNotificationList({ pageSize: 1000, pageNumber: 1, notificationType: NotificationTypeEnum.InApp, status: NotificationStatusEnum.Sent }).then((res) => {
    if (res) {
      notificationList.value = res
      // dashboardItems.value.notificationCount = res.totalCount;
    }
  }).catch((error) => {
    return catchError(error, () => { getNotificationList() })
  }).finally(() => {
    loading.value = false
  })
}
getNotificationList();

</script>
