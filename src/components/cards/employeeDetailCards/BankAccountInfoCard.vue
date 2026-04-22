<template>
    <v-row>
        <v-col>
            <v-card>
                <v-toolbar class="d-flex align-center">
                    <v-col cols="auto">
                        <p class="mb-0 text-h6 font-weight-bold">{{ $t('list.bankAccount') }}</p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto" v-if="route.name != 'profile-info'">
                        <VDialogContent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" variant="text" icon="mdi-pencil-outline">
                                </v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <UpdateEmployeeBankAccount :dialogClose="() => { isActive.value = false }" />
                            </template>
                        </VDialogContent>
                    </v-col>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.bankName') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.bankName ?? '--' }}
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.accountType') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{employeeDetail.accountType != null ?
                                        enumToArray(AccountTypeEnum).find((a: any) => a.value ==
                                            employeeDetail.accountType)?.title : '--'}}
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.accountNumber') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.accountNumber ?? '--'
                                    }}
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <p class="mb-1">{{ $t('list.iban') }}</p>
                                    <p class="mb-1 font-weight-medium"> {{ employeeDetail.iban ?? '--' }}
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
import { enumToArray } from '@/core/helpers/enumToArray';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { useRoute } from 'vue-router';
import { AccountTypeEnum } from '@/models/custom/EnumTypes';
import UpdateEmployeeBankAccount from '@/components/dialogs/humanResources/UpdateEmployeeBankAccount.vue';
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