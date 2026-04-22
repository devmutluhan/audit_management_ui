<template>
    <v-col class="fill-height">
        <v-row>
            <v-card class="w-100" height="220px" color="transparent" :image="bgImage">
                <v-card-text class="fill-height d-flex align-center">
                    <v-row class="d-flex align-center">
                        <v-col cols="12" class="py-1" align="center">
                            <ImageCard size="120" font-size="30px" :first-value="employeeDetail.firstName"
                                style="border: 3px solid green;" :second-value="employeeDetail.lastName"
                                :avatar-text="employeeDetail.avatarUrl" rounded="circle" />
                        </v-col>
                        <v-col cols="12" class="py-1 text-h6 font-weight-bold" align="center">
                            {{ employeeDetail.fullName ?? '--' }}
                        </v-col>
                        <v-col cols="12"
                            class="py-1 text-body-1 d-flex align-center justify-center flex-wrap text-center"
                            style="white-space: normal;">
                            <span class="mx-2 d-flex align-center">
                                <v-icon>mdi-account-tie-outline</v-icon>
                                <span class="ml-1">
                                    {{ employeeDetail.currentExperience ? employeeDetail.currentExperience.position :
                                        '--'
                                    }}
                                </span>
                            </span>

                            <span class="mx-2 d-flex align-center">
                                <v-icon>mdi-map-marker-radius-outline</v-icon>
                                <span class="ml-1">
                                    {{ employeeDetail.country ? employeeDetail.country.name + ' / ' +
                                        employeeDetail.city :
                                        '--'
                                    }}
                                </span>
                            </span>

                            <span class="mx-2 d-flex align-center">
                                <v-icon>mdi-email-outline</v-icon>
                                <span class="ml-1">
                                    {{ employeeDetail.workEmail ?? '--' }}
                                </span>
                            </span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>
        <v-row>
            <v-col cols="12">
                <Tabs2 :pages="menuArray"></Tabs2>
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col cols="12">
                <RouterView />
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import ImageCard from '@/components/cards/ImageCard.vue';
import Tabs2 from '@/components/tabs/Tabs2.vue';
import { getAssetPath } from '@/core/helpers/assets';
import { userInfo } from '@/core/helpers/localStorageManagement';
import { filteredAccountMenu } from '@/core/menuPageManagement/moduleClaimUtils';
import { themeMode } from '@/layouts/default-layout/config/helper';
import { computed } from 'vue';
import { ref } from 'vue';

const employeeDetail = userInfo.value.employeeDetail;

const menuArray = ref(filteredAccountMenu.value.find((x: any) => x.route == 'profile').children.map((a: any) => {
    return {
        name: a.title.slice(5, a.title.length),
        to: { name: a.route }
    }
}));

const bgImage = computed(() => {
    if (themeMode.value !== 'dark') {
        return getAssetPath("media/auth/bg9.jpg")
    } else {
        return getAssetPath("media/auth/bg5-dark.jpg");
    }
})

</script>