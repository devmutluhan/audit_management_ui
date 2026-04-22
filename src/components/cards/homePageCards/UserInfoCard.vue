<template>
    <v-card height="100%" width="100%" class="d-flex flex-column">
        <v-toolbar align="start" color="transparent">
            <v-col cols="auto" class="pr-0">
                <v-img :src="getGeneralProfilePhoto(true)" width="40"></v-img>
            </v-col>
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.myEmployeeInfo') }}</p>
            </v-col>
        </v-toolbar>
        <v-card-text class="flex-grow-1 overflow-y-auto pa-4 d-flex align-center">
            <v-row align="center">
                <v-col>
                    <v-row>
                        <v-col cols="6" md="6" lg="8" class="pr-0" align="left">
                            <p class="fw-bold d-flex align-items-center fs-4 ma-0 mt-2">{{ employeeDetail.fullName }}
                            </p>
                            <p class="ma-0 mt-2 fw-semibold text-muted text-hover-primary fs-7">{{
                                employeeDetail.workEmail }}
                            </p>
                            <p class="fs-6 fw-semibold mt-2 mb-0">
                                {{ employeeDetail.currentExperience?.department ?? '--' }}
                            </p>
                            <p class="fs-7 fw-semibold ma-0">{{ employeeDetail.currentExperience?.position ?? '--' }}
                            </p>
                        </v-col>
                        <v-col cols="6" md="6" lg="4" align="right" class="pl-0">
                            <ImageCard :first-value="employeeDetail.firstName" :second-value="employeeDetail.lastName"
                                :avatar-text="employeeDetail.avatarUrl" size="120" font-size="30px" />
                        </v-col>
                    </v-row>
                    <v-row class="mt-4">
                        <v-col cols="auto" class="fs-7 fw-semibold">
                            {{ $t('general.myManager') }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto" class="text-primary font-weight-bold text-body-1">
                            {{ employeeDetail.currentExperience?.manager ?
                                employeeDetail.currentExperience?.manager?.firstName + ' ' +
                                employeeDetail.currentExperience?.manager?.lastName : '--' }}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar align="end" class="elevation-1" color="transparent" height="10%">
            <v-col cols="12" align="end" class="py-2">
                <router-link class="text-primary font-weight-bold" :to="{ name: 'profile-view' }">
                    {{ $t('general.myAccount') }}
                    <v-icon>mdi-chevron-right</v-icon>
                </router-link>
            </v-col>
        </v-toolbar>
    </v-card>
</template>

<script lang="ts" setup>
import { userInfo } from '@/core/helpers/localStorageManagement';
import { watch } from 'vue';
import { ref } from 'vue';
import ImageCard from '../ImageCard.vue';
import { getGeneralProfilePhoto } from '@/core/helpers/assets';

const employeeDetail = ref(userInfo.value.employeeDetail);

watch(() => userInfo.value.employeeDetail, () => {
    employeeDetail.value = userInfo.value.employeeDetail;
})

</script>