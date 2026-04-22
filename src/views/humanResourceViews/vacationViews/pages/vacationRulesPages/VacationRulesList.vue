<template>
    <v-col>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text class="pa-2">
                        <v-row class="d-flex align-center">
                            <v-col cols="auto">
                                <v-card color="primary" border="false">
                                    <v-card-text class="d-flex align-center justify-center">
                                        <v-icon color="white" size="60">mdi-airplane-cog</v-icon>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="auto" class="px-6">
                                <p class="text-h5 font-weight-bold ma-0">
                                    {{ leavePolicy.name }}
                                </p>
                                <p class="text-body-1 ma-0 mt-1">
                                    {{ leavePolicy.description }}
                                </p>
                                <p class="text-body-1 ma-0 mt-4 font-weight-bold text-primary">
                                    {{ $t('list.vacationRuleTypeCount', { count: leavePolicy.leaveTypeCount }) }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col cols="12">
                <v-card class="fill-height">
                    <v-card-text class="fill-height">
                        <v-row class="d-flex align-center">
                            <v-col cols="auto">
                                <p class="text-h5 font-weight-bold ma-0">
                                    {{ $t('list.vacationTypes') }}
                                </p>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="auto">
                                <PageTitleCreateButton title="general.addVacationType"
                                    :to="{ name: 'leave-type-create' }"></PageTitleCreateButton>
                            </v-col>
                        </v-row>
                        <v-row class="fill-height">
                            <v-col>
                                <Datatable :data="leavePolicy.leaveTypes ?? []" :header="tableHeader"
                                    :enable-items-per-page-dropdown="true">
                                    <template v-slot:name="{ row: data }">
                                        <router-link class="text-rowTextColor font-weight-black"
                                            :to="{ name: 'leave-type-detail', params: { id: data.id } }">
                                            {{ data.name }}
                                        </router-link>
                                    </template>
                                    <template v-slot:isEnabled="{ row: data }">
                                        <span :class="data.isEnabled ? 'text-green' : 'text-red'" class="ma-0">
                                            {{ data.isEnabled ? $t('general.isActive') :
                                                $t('general.isDisabled') }}</span>
                                    </template>
                                    <template v-slot:isPaid="{ row: data }">
                                        <span :class="data.isPaid ? 'text-green' : 'text-red'" class="ma-0">
                                            {{ data.isPaid ? $t('form.paid') :
                                                $t('form.unPaid') }}</span>
                                    </template>
                                    <template v-slot:actions="{ row: data }">
                                        <GeneralDropdown :menuItems="menuItems" :routeId="data.id" :data="data">
                                        </GeneralDropdown>
                                    </template>
                                </Datatable>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from "@/models/types";
import { storeToRefs } from 'pinia';
import { useLeavePolicyStore } from '@/stores/humanResourcesStores/leavePolicyStore';
import { useRouter } from 'vue-router';
import type { LeaveTypeDto } from '@/models/entities/humanResource/LeavePolicyDtos';
import { catchError } from '@/core/helpers/generalResponse';
import PageTitleCreateButton from '@/components/formInput/generalInputs/PageTitleCreateButton.vue';
const router = useRouter()
const { leavePolicy } = storeToRefs(useLeavePolicyStore());

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        to: "leave-type-detail",
    },
    {
        title: "general.delete",
        confirmModalValue: {
            buttonLoading: false,
            action: (item: LeaveTypeDto) => {
                deleteVacationType(item)
            },
        },
    },
]);

const deleteVacationType = (item: LeaveTypeDto) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useLeavePolicyStore().deleteLeaveType(leavePolicy.value.id, item.id).then((res) => {
        const index = leavePolicy.value.leaveTypes.findIndex((a) => a.id == item.id);
        if (index != -1) {
            leavePolicy.value.leaveTypes.splice(index, 1);
            leavePolicy.value.leaveTypeCount--
        }
    }).catch((error) => {
        return catchError(error, () => { deleteVacationType(item) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : ''
    })
}


const tableHeader = ref([
    {
        columnName: 'list.type',
        columnLabel: "name",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.status',
        columnLabel: "isEnabled",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.paidOrFree',
        columnLabel: "isPaid",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.dayLimit',
        columnLabel: "dayLimit",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.accrualFrequency',
        columnLabel: "accrualFrequency",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.leastDayCount',
        columnLabel: "leastDayCount",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'list.mostDayCount',
        columnLabel: "mostDayCount",
        sortEnabled: false,
        columnWidth: 175,
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 100,
    }
]);

</script>