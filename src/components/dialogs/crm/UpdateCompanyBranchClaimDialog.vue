<template>
    <DialogContent title="general.claimUpdate" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="createCompanyBranchClaimForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <v-chip color="error" class="font-weight-bold text-body-1">
                            {{ selectedClaimEmployee.employee.name }}
                        </v-chip>
                        -
                        <v-chip color="primary" class="font-weight-bold text-body-1">
                            {{ selectedClaimEmployee.companyBranch.name }}
                        </v-chip>
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6" v-for="(item, index) in iconTableItems" :key="index">
                        <SwitchInput v-model="commandModel[item]" :label="'list.' + item" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { UpdateDocumentAuthorization } from '@/models/entities/crm/CrmDefinitionCommands'
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { onMounted } from 'vue';
import { useCrmDefinitionStore } from '@/stores/crmStores/crmDefinitionStore';
import { catchError } from '@/core/helpers/generalResponse';
const loading = ref(false)
const emit = defineEmits(['createItem']);
const createCompanyBranchClaimForm = ref(null as any);

const iconTableItems = ref(['managePotentialOpportunity', 'manageOffer', 'manageAgreement', 'manageProject', 'viewOffer', 'viewAgreement', 'viewProject', 'viewPotentialOpportunity']);
const commandModel = ref(new UpdateDocumentAuthorization());

onMounted(() => {
    Object.entries(commandModel.value).forEach((prop: [key: any, value: any]) => {
        commandModel.value[prop[0]] = props.selectedClaimEmployee[prop[0]]
    });
});

const updateDocumentAuthorizationMethod = () => {
    loading.value = true;

    useCrmDefinitionStore().updateDocumentAuthorization(props.selectedClaimEmployee.id, commandModel.value).then((res: any) => {
        props.dialogClose();
        emit('createItem')
    }).catch((error) => {
        return catchError(error, () => { updateDocumentAuthorizationMethod() })
    }).finally(() => {
        loading.value = false;
    })
}

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedClaimEmployee: {
        type: null as any,
        required: true
    },
});

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: () => { updateDocumentAuthorizationMethod() },
        loading: false
    }
]);


</script>