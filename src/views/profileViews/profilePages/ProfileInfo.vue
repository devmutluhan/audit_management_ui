<template>
    <v-row>
        <v-col md="8" cols="12" class="mt-6">
            <CareerInfoCard :employee-detail="employeeDetail" />
        </v-col>
        <v-col md="4" cols="12" class="mt-6">
            <ManagerCard :employee-detail="employeeDetail" />

            <CommunicationCard :employee-detail="employeeDetail" />
        </v-col>
        <v-col cols="12" md="8">
            <CitizenshipInfoCard :employee-detail="employeeDetail" />

            <EducationInfoCard :employee-detail="employeeDetail" />

            <BankAccountInfoCard :employee-detail="employeeDetail" />
        </v-col>
        <v-col md="4" cols="12">
            <FamilyInfoCard :employee-detail="employeeDetail" />

            <AddressInfoCard :employee-detail="employeeDetail" />

            <EmergencyInfoCard :employee-detail="employeeDetail" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import CareerInfoCard from '@/components/cards/employeeDetailCards/CareerInfoCard.vue';
import CommunicationCard from '@/components/cards/employeeDetailCards/CommunicationCard.vue';
import ManagerCard from '@/components/cards/employeeDetailCards/ManagerCard.vue';
import CitizenshipInfoCard from '@/components/cards/employeeDetailCards/CitizenshipInfoCard.vue';
import EmergencyInfoCard from '@/components/cards/employeeDetailCards/EmergencyInfoCard.vue';
import AddressInfoCard from '@/components/cards/employeeDetailCards/AddressInfoCard.vue';
import BankAccountInfoCard from '@/components/cards/employeeDetailCards/BankAccountInfoCard.vue';
import EducationInfoCard from '@/components/cards/employeeDetailCards/EducationInfoCard.vue';
import FamilyInfoCard from '@/components/cards/employeeDetailCards/FamilyInfoCard.vue';
import { userInfo } from '@/core/helpers/localStorageManagement';

const employeeDetail = userInfo.value.employeeDetail;
</script>