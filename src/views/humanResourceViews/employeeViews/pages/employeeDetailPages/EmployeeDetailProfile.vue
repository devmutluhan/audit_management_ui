<template>
    <v-row>
        <v-col md="8" cols="12" class="mt-6">
            <!-- Kariyer Bilgileri -->
            <CareerInfoCard :employee-detail="employeeDetail" />
        </v-col>
        <v-col md="4" cols="12" class="mt-6">
            <!-- Yöneticisi -->
            <ManagerCard :employee-detail="employeeDetail" />

            <!-- İletişim -->
            <CommunicationCard :employee-detail="employeeDetail" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import CareerInfoCard from '@/components/cards/employeeDetailCards/CareerInfoCard.vue';
import CommunicationCard from '@/components/cards/employeeDetailCards/CommunicationCard.vue';
import ManagerCard from '@/components/cards/employeeDetailCards/ManagerCard.vue';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { storeToRefs } from 'pinia';

const { employeeDetail } = storeToRefs(useEmployeeDtoStore());
</script>