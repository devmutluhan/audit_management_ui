<template>
    <v-card>
        <v-toolbar class="d-flex align-center">
            <v-col cols="auto">
                <p class="mb-0 text-h6 font-weight-bold">{{ $t('menu.agreementEmployees') }}</p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"
                v-if="agreementDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" variant="outlined" prepend-icon="mdi-account-check-outline"
                            class="text-capitalize">
                            {{ $t('general.addEmployee') }}
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <AddAgreementEmployeeDialog :dialog-close="() => { isActive.value = false }"
                            :agreementEmployees="agreementEmployees" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-toolbar>
        <v-card-text style="height:174px; overflow:auto">
            <v-row class="d-flex align-center" v-if="agreementEmployees.length > 0">
                <v-col cols="12" v-for="(employee, index) in agreementEmployees" :key="index">
                    <v-row class="d-flex align-center">
                        <v-col cols="auto">
                            <ImageCard :first-value="employee.firstName" :second-value="employee.lastName"
                                :avatar-text="employee.avatar" />
                        </v-col>
                        <v-col cols="6" class="px-1">
                            <p class="mb-1 font-weight-medium text-blue-accent-3">
                                {{ employee.firstName + ' ' + employee.lastName }}
                            </p>
                            <p class="mb-0 font-weight-medium text-truncate" v-if="employee.positionName">
                                {{ employee.positionName }}
                            </p>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto"
                            v-if="agreementDetail.requestApproval.status == ApprovementStatusEnum.Approved && isUpdated">
                            <GeneralDropdown :menuItems="menuItems" :data="employee" />
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class="py-6">
                    {{ $t('general.noAgreementEmployee') }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ApprovementStatusEnum } from '@/models/custom/EnumTypes';
import { AgreementDetailDto, AgreementEmployeeDto } from '@/models/entities/crm/CrmAgreementDtos';
import { ref, type PropType } from 'vue';
import ImageCard from "@/components/cards/ImageCard.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from '@/models/types';
import { useAgreementStore } from '@/stores/crmStores/agreementStore';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import AddAgreementEmployeeDialog from '@/components/dialogs/crm/AddAgreementEmployeeDialog.vue';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';

const { agreementEmployees } = storeToRefs(useAgreementStore());
const route = useRoute();
useAgreementStore().getAgreementEmployees(route.params.id.toString());

const props = defineProps({
    agreementDetail: {
        type: Object as PropType<AgreementDetailDto>,
        required: true,
        default: new AgreementDetailDto()
    },
    isUpdated: {
        type: Boolean,
        default: true
    }
})

const deleteFunc = (item: AgreementEmployeeDto) => {
    useAgreementStore().deleteAgreementEmployee(route.params.id.toString(), item.id).then((res) => {
        agreementEmployees.value = agreementEmployees.value.filter((a) => a.id != item.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(item) })
    })
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: 'general.delete',
        action: deleteFunc
    }
])

</script>