<template>
    <DialogContent title="general.updateService" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="updateServiceForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12" :md="companySettings.includeCompanyRotation ? '8' : '12'">
                                <TextField v-model="commandModel.title" label="form.title" isRequired>
                                </TextField>
                            </v-col>
                            <v-col cols="12" md="4" v-if="companySettings.includeCompanyRotation">
                                <SwitchInput v-model="commandModel.inRotation" label="form.inRotation" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { CreateServiceCommand } from '@/models/entities/crm/CrmServiceCommands';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';

const route = useRoute();
const { companySettings } = storeToRefs(useManagementDtoStore());
const commandModel = ref(new CreateServiceCommand())
const emit = defineEmits(['createItem']);
const updateServiceForm = ref(null as any);
const { serviceGroupList, serviceList } = storeToRefs(useCrmServiceStore());

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    }
});

onMounted(() => {
    commandModel.value.title = props.selectedItem.title;
    commandModel.value.inRotation = props.selectedItem.inRotation;
})

const updateService = () => {
    updateServiceForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useCrmServiceStore().updateService(props.selectedItem.serviceGroup.id, props.selectedItem.id, commandModel.value).then((response: any) => {
                props.dialogClose();
                if (route.path.includes('group')) {
                    if (serviceGroupList.value.items) {
                        const groupIndex = serviceGroupList.value.items.findIndex((x) => x.id == props.selectedItem.serviceGroup.id)
                        const serviceIndex = serviceGroupList.value.items[groupIndex].subItems.findIndex((a) => a.id == props.selectedItem.id)
                        serviceGroupList.value.items[groupIndex].subItems[serviceIndex].inRotation = commandModel.value.inRotation
                        serviceGroupList.value.items[groupIndex].subItems[serviceIndex].title = commandModel.value.title
                    }
                } else {
                    if (serviceList.value.items) {
                        const serviceIndex = serviceList.value.items.findIndex((x) => x.id == props.selectedItem.id)
                        serviceList.value.items[serviceIndex].inRotation = commandModel.value.inRotation
                        serviceList.value.items[serviceIndex].title = commandModel.value.title
                    }
                }
            }).catch((error) => {
                return catchError(error, () => updateService())
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
        click: updateService,
        loading: false
    }
])

</script>