<template>
    <v-row>
        <v-col md="8" cols="12" class="mt-6">
            <!-- Vatandaşlık -->
            <CitizenshipInfoCard :employee-detail="employeeDetail" />

            <!-- Eğitim -->
            <EducationInfoCard :employee-detail="employeeDetail" />

            <!-- Aile -->
            <FamilyInfoCard :employee-detail="employeeDetail" />

            <!-- Adres -->
            <AddressInfoCard :employee-detail="employeeDetail" />

            <!-- Banka Hesabı -->
            <BankAccountInfoCard :employee-detail="employeeDetail" />
        </v-col>
        <v-col md="4" cols="12" class="mt-6">

            <!-- Özlük Doluluk Oranı -->
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar class="d-flex align-center">
                            <v-col cols="auto">
                                <v-icon>mdi-check-circle</v-icon>
                            </v-col>
                            <v-col cols="auto">
                                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.personnelOccupancyRate') }}</p>
                            </v-col>
                        </v-toolbar>
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="12" class="pb-0">
                                    <p class="text-red mb-1 text-h3">%{{ employeeDetail.personalOccupancyRate }}</p>
                                    <v-progress-linear :model-value="employeeDetail.personalOccupancyRate"
                                        color="red"></v-progress-linear>
                                </v-col>
                                <v-col cols="12" class="pt-5 px-6">
                                    <v-row>
                                        <p class="mb-1"> {{ $t('list.complated') }}</p>
                                        <v-spacer></v-spacer>
                                        <p class="mb-1"> {{ $t('list.remainder') }} </p>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- İletişim -->
            <v-row>
                <v-col>
                    <v-card>
                        <v-toolbar class="d-flex align-center">
                            <v-col cols="auto">
                                <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.communication') }}</p>
                            </v-col>
                        </v-toolbar>
                        <v-card-text>
                            <v-row class="d-flex align-center">
                                <v-col cols="12">
                                    <v-row class="d-flex align-center">
                                        <v-col cols="auto">
                                            <v-icon>mdi-eye-off-outline</v-icon>
                                        </v-col>
                                        <v-col cols="auto">
                                            <p class="mb-1"> {{ $t('form.email') }} </p>
                                            <p class="mb-0 font-weight-medium text-toolbarButton">
                                                {{ employeeDetail.workEmail ?? '--' }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" class="py-0 my-n3">
                                    <v-divider></v-divider>
                                </v-col>
                                <v-col cols="12">
                                    <v-row class="d-flex align-center">
                                        <v-col cols="auto">
                                            <v-icon>mdi-eye-off-outline</v-icon>
                                        </v-col>
                                        <v-col cols="auto">
                                            <p class="mb-1"> {{ $t('form.phoneNumber') }} </p>
                                            <p class="mb-0 font-weight-medium text-toolbarButton">
                                                {{ employeeDetail.workPhone ?? '--' }}
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Acil Durum -->
            <EmergencyInfoCard :employee-detail="employeeDetail" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import CitizenshipInfoCard from '@/components/cards/employeeDetailCards/CitizenshipInfoCard.vue';
import FamilyInfoCard from '@/components/cards/employeeDetailCards/FamilyInfoCard.vue';
import EducationInfoCard from '@/components/cards/employeeDetailCards/EducationInfoCard.vue';
import AddressInfoCard from '@/components/cards/employeeDetailCards/AddressInfoCard.vue';
import BankAccountInfoCard from '@/components/cards/employeeDetailCards/BankAccountInfoCard.vue';
import EmergencyInfoCard from '@/components/cards/employeeDetailCards/EmergencyInfoCard.vue';

const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

</script>