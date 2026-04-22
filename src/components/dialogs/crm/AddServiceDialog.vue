<template>
    <DialogContent title="general.addService" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="addServiceForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12" :md="companySettings.includeCompanyRotation ? '8' : '12'">
                                <TextField v-model="commandModel.title" label="form.title" isRequired>
                                </TextField>
                            </v-col>
                            <v-col cols="12" md="4" v-if="companySettings.includeCompanyRotation">
                                <SwitchInput v-model="commandModel.inRotation" label="form.inRotation" />
                            </v-col>
                            <v-col cols="12">
                                <SingleAutocompleteInput v-model="selectedServiceGroup" label="form.serviceGroup"
                                    :items="serviceGroupList.items ?? []" isReturnObject isRequired />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { CreateServiceCommand } from '@/models/entities/crm/CrmServiceCommands';
import { storeToRefs } from 'pinia';
import { ServiceGroupDto } from '@/models/entities/crm/CrmServiceDtos';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import type { LookupDto } from '@/models/ApiResult';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';

const { companySettings } = storeToRefs(useManagementDtoStore());
const { serviceGroupList, serviceList } = storeToRefs(useCrmServiceStore())
useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 })
const commandModel = ref(new CreateServiceCommand())
const emit = defineEmits(['createItem']);
const selectedServiceGroup = ref(new ServiceGroupDto())
const addServiceForm = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const addServiceForGroup = () => {
    addServiceForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useCrmServiceStore().createService(selectedServiceGroup.value.id, commandModel.value).then((response: any) => {
                props.dialogClose();
                if (serviceList.value.items) {
                    serviceList.value.items.unshift({
                        id: response.data,
                        title: commandModel.value.title,
                        inRotation: commandModel.value.inRotation,
                        serviceGroup: { id: selectedServiceGroup.value.id, name: selectedServiceGroup.value.title },
                        hasChild: false,
                        subItems: new Array<LookupDto>()
                    });
                }
            }).catch((error) => {
                return catchError(error, () => addServiceForGroup())
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
        click: addServiceForGroup,
        loading: false
    }
])

</script>