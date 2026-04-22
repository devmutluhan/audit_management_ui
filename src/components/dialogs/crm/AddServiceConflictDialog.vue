<template>
    <DialogContent :title="isUpdate ? 'general.updateConflict' : 'general.addConflict'" :buttons="buttons"
        :dialogClose="dialogClose" :titleIcon="isUpdate ? 'mdi-pencil' : 'mdi-plus'">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="addConflictForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12">
                                <SingleAutocompleteInput v-model="selectedService" label="form.selectService"
                                    :disabled="isUpdate" :items="serviceList.items ?? []" item-title="title"
                                    item-value="id" isReturnObject isRequired />
                            </v-col>
                            <v-col cols="12">
                                <MultipleAutocompleteInput v-model="selectedServiceGroups" label="form.serviceGroup"
                                    :items="serviceGroupList.items ?? []" item-title="title" item-value="id"
                                    isReturnObject />
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
import { CreateConflictCommand } from '@/models/entities/crm/CrmServiceCommands';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { ServiceDto } from '@/models/entities/crm/CrmServiceDtos';
import { onMounted } from 'vue';
import { watch } from 'vue';

const { serviceList, serviceGroupList, conflictList } = storeToRefs(useCrmServiceStore())
useCrmServiceStore().getServiceList({ pageSize: 1000, pageNumber: 1 });
useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 });

const selectedService = ref(new ServiceDto())
const selectedServiceGroups = ref(new Array<any>())

const commandModel = ref(new CreateConflictCommand())
const emit = defineEmits(['createItem']);
const loading = ref(false)
const isUpdate = ref(false)
const addConflictForm = ref(null as any);

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: false
    }
});

const addServiceConflict = () => {
    addConflictForm.value.validate().then((res: any) => {
        if (res.valid) {
            loading.value = true;
            commandModel.value.serviceId = selectedService.value.id;
            commandModel.value.conflictedServiceGroupIds = selectedServiceGroups.value.map((x) => x.id)
            useCrmServiceStore().createConflict(commandModel.value).then((res: any) => {
                props.dialogClose();
                emit('createItem', {
                    serviceId: selectedService.value.id,
                    serviceGroups: selectedServiceGroups.value.map((x) => {
                        return {
                            serviceId: selectedService.value.id,
                            serviceName: selectedService.value.title,
                            serviceGroupId: x.id,
                            serviceGroupName: x.title
                        }
                    })
                });
            }).catch((error) => {
                return catchError(error, () => { addServiceConflict() })
            }).finally(() => {
                loading.value = false;
            })
        }
    })
}

watch(() => selectedService.value, () => {
    selectedServiceGroups.value = conflictList.value.map((a) => {
        if (a.serviceId == selectedService.value.id) {
            return {
                id: a.serviceGroupId,
                title: a.serviceGroupName
            }
        }
        else {
            return null
        }
    })
})

onMounted(() => {
    if (props.selectedItem) {
        selectedService.value.id = props.selectedItem.serviceId;
        selectedService.value.title = props.selectedItem.serviceName;
        selectedServiceGroups.value = conflictList.value.map((a) => {
            if (a.serviceId == selectedService.value.id) {
                return {
                    id: a.serviceGroupId,
                    title: a.serviceGroupName
                }
            }
            else {
                return null
            }
        })
        isUpdate.value = true;
    } else {
        isUpdate.value = false;
    }

})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: addServiceConflict,
        loading: false
    }
])

</script>