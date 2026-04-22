<template>
    <DialogContent title="general.addServiceGroup" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addServiceGroupForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <TextField v-model="commandModel.title" label="form.title" isRequired>
                        </TextField>
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput v-model="commandModel.companyBranchId" :items="companyBranchList"
                            item-title="name" item-value="id" label="form.selectCompanyBranch" isRequired>
                        </SingleAutocompleteInput>
                    </v-col>
                    <v-col cols="12" class="px-0 pt-0">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" v-for="(item, index) in commandModel.services" :key='index'>
                        <v-card>
                            <v-card-text>
                                <v-row>
                                    <v-col class="text-h6 font-weight-bold">
                                        {{ index + 1 }}. {{ $t('list.service') }}
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn color="error" @click="commandModel.services.splice(index, 1)">
                                            {{ $t('general.delete') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <v-row class="d-flex align-center">
                                    <v-col cols="12" md="8">
                                        <TextField v-model="item.title" label="form.title" isRequired />
                                    </v-col>
                                    <v-col cols="8" md="4">
                                        <SwitchInput v-model="item.inRotation" label="form.inRotation" />
                                    </v-col>
                                    <v-col cols="10">
                                        <MultipleAutocompleteInput v-model="item.positionIds" label="form.positions"
                                            :items="positionList" item-title="name" item-value="id" justId />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <AddButtonCard v-model="commandModel.services" title="form.addService" :isRequired="false"
                            :addItemFunc="addStepFunction" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { CreateServiceGroupCommand } from '@/models/entities/crm/CrmServiceCommands';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';

const commandModel = ref(new CreateServiceGroupCommand())
const emit = defineEmits(['createItem']);
const { companyBranchList, positionList } = storeToRefs(useManagementDtoStore())
useManagementDtoStore().getCompanyBranchList({ pageSize: 1000, pageNumber: 1 });
useManagementDtoStore().getPositionList({ pageSize: 1000, pageNumber: 1 });
const { serviceGroupList } = storeToRefs(useCrmServiceStore());

const addServiceGroupForm = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createServiceGroup = () => {
    addServiceGroupForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useCrmServiceStore().createServiceGroup(commandModel.value).then((response: any) => {
                props.dialogClose();
                emit('createItem')
            }).catch((error) => {
                return catchError(error, () => createServiceGroup())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: createServiceGroup,
        loading: false
    }
])

const addStepFunction = () => {
    commandModel.value.services.push({
        title: "",
        inRotation: false,
        positionIds: []
    });
}
</script>