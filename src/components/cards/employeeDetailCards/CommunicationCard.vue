<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold"> {{ $t('list.communication') }} </p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="route.name != 'profile-info'">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="text" icon="mdi-pencil-outline"></v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <UpdateEmployeeCommunication :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row class="d-flex align-center">
                        <v-col cols="12">
                            <v-row class="d-flex align-center">
                                <v-col cols="1">
                                    <v-icon>mdi-email-outline</v-icon>
                                </v-col>
                                <v-col cols="8">
                                    <p class="mb-1"> {{ $t('form.workingEmail') }} </p>
                                    <p class="mb-0 font-weight-medium text-blue-accent-3">
                                        {{ employeeDetail.workEmail ?? '-' }}
                                    </p>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="2">
                                    <v-btn variant="text" icon="mdi-content-copy"
                                        @click="copyText(employeeDetail.workEmail)">
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" class="py-0 my-n3">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12">
                            <v-row class="d-flex align-center">
                                <v-col cols="1">
                                    <v-icon>mdi-phone-outline</v-icon>
                                </v-col>
                                <v-col cols="auto">
                                    <p class="mb-1"> {{ $t('list.workingPhoneNumber') }} </p>
                                    <p class="mb-0 font-weight-medium text-blue-accent-3">
                                        {{ employeeDetail.workPhone ?? '-' }}
                                    </p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" class="py-0 my-n3">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12">
                            <v-row class="d-flex align-center">
                                <v-col cols="1">
                                    <v-icon>mdi-eye-off-outline</v-icon>
                                </v-col>
                                <v-col cols="auto">
                                    <p class="mb-1"> {{ $t('form.email') }} </p>
                                    <p class="mb-0 font-weight-medium text-blue-accent-3">
                                        {{ employeeDetail.personalEmail ?? '-' }}
                                    </p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" class="py-0 my-n3">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12">
                            <v-row class="d-flex align-center">
                                <v-col cols="1">
                                    <v-icon>mdi-eye-off-outline</v-icon>
                                </v-col>
                                <v-col cols="auto">
                                    <p class="mb-1"> {{ $t('form.phoneNumber') }} </p>
                                    <p class="mb-0 font-weight-medium text-blue-accent-3">
                                        {{ employeeDetail.mobilePhone ?? '-' }}
                                    </p>
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
import UpdateEmployeeCommunication from '@/components/dialogs/humanResources/UpdateEmployeeCommunication.vue';
import { copyText } from '@/core/helpers/generalUtils';
import type { EmployeeDetailDto } from '@/models/entities/humanResource/EmployeeDtos';
import { useRoute } from 'vue-router';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
const route = useRoute();

import type { PropType } from 'vue';
const props = defineProps({
    employeeDetail: {
        type: Object as PropType<EmployeeDetailDto>,
        required: true
    },
});

</script>