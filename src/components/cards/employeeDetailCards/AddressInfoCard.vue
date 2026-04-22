<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.address') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="route.name != 'profile-info'">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-pencil-outline">
                                    {{ $t('general.edit') }}
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <UpdateEmployeeAddress :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('form.country') }}</p>
                                    <p class="mb-1 font-weight-medium">
                                        {{ employeeDetail.country ? employeeDetail.country.name : '--'
                                        }} </p>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('form.province') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.city ?? '--'
                                    }} </p>
                                </v-col>
                                <v-col cols="12">
                                    <p class="mb-1">{{ $t('list.addressContinued') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.street ?? '--'
                                    }} </p>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import UpdateEmployeeAddress from '@/components/dialogs/humanResources/UpdateEmployeeAddress.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { useRoute } from 'vue-router';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';
const route = useRoute();

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});

</script>