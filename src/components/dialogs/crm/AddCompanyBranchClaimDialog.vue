<template>
    <DialogContent title="general.claimUpdate" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="createCompanyBranchClaimForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="commandModel.companyBranchId" :items="companyBranchList"
                            isRequired label="form.selectCompanyBranch" item-title="name" item-value="id" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <EmployeeSelectInput multiple justId @selectValue="commandModel.employeeIds = $event" isRequired
                            :employeeStatusFilter="EmployeeStatusTypeEnum.Valid" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <Datatable class="mt-4" :data="tableData" :header="tableHeader" :loading="loading"
                            :enable-items-per-page-dropdown="true">
                            <template v-slot:value="{ row: data }">
                                <SwitchInput v-model="data.value" hide-details color="success"></SwitchInput>
                            </template>
                        </Datatable>
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EmployeeSelectInput from "@/components/formInput/readyInput/EmployeeSelectInput.vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { CreateDocumentAuthorizationCommand } from '@/models/entities/crm/CrmDefinitionCommands'
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { catchError } from '@/core/helpers/generalResponse';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import { storeToRefs } from 'pinia';
import i18n from '@/core/plugins/i18n';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { EmployeeStatusTypeEnum } from '@/models/custom/EnumTypes';

const t = i18n.global.t
const loading = ref(false)
const emit = defineEmits(['createItem']);
const createCompanyBranchClaimForm = ref(null as any);
const { companyBranchList } = storeToRefs(useManagementDtoStore());
useManagementDtoStore().getCompanyBranchList({ pageSize: 1000, pageNumber: 1 });

const commandModel = ref(new CreateDocumentAuthorizationCommand());

const createDocumentAuthorizationMethod = () => {
    createCompanyBranchClaimForm.value.validate().then((res: any) => {
        if (res.valid) {
            tableData.value.forEach((x: any) => {
                commandModel.value[x.key] = x.value;
            });
            loading.value = true;
            useCrmDefinitionStore().createDocumentAuthorization(commandModel.value).then((res: any) => {
                props.dialogClose();
                emit('createItem')
            }).catch((error) => {
                return catchError(error, () => { createDocumentAuthorizationMethod() })
            }).finally(() => {
                loading.value = false;
            })
        }
    })
}

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: () => { createDocumentAuthorizationMethod() },
        loading: false
    }
]);

const tableData = ref([
    // Feature: Fırsat istenirse bu kod açılacak
    // { key: "viewPotentialOpportunity", value: "", title: t("list.viewPotentialOpportunity") },
    // { key: "managePotentialOpportunity", value: "", title: t("list.managePotentialOpportunity") },
    { key: "viewOffer", value: false, title: t("list.viewOffer") },
    { key: "manageOffer", value: false, title: t("list.manageOffer") },
    { key: "viewAgreement", value: false, title: t("list.viewAgreement") },
    { key: "manageAgreement", value: false, title: t("list.manageAgreement") },
    { key: "viewProject", value: false, title: t("list.viewProject") },
    { key: "manageProject", value: false, title: t("list.manageProject") }
])

const tableHeader = ref([
    {
        columnName: 'list.claimTitle',
        columnLabel: "title",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.claimValue',
        columnLabel: "value",
        sortEnabled: true,
        columnWidth: 175,
    }
]);

</script>