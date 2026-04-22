<template>
    <DialogContent title="general.addPositions" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="addPositionForServiceOrGroupForm">
                        <v-row class="d-flex align-center">
                            <v-col v-if="isGroup">
                                <p class="text-error ma-0">
                                    * {{ $t('list.addPositionDesc') }}
                                </p>
                            </v-col>
                            <v-col cols="12">
                                <MultipleAutocompleteInput v-model="selectedPositions" :items="positionList"
                                    item-title="name" item-value="id" label="form.positions" isReturnObject />
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
import { CreatePositionForService } from '@/models/entities/crm/CrmServiceCommands';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import type { LookupDto } from '@/models/ApiResult';
import { onMounted } from 'vue';

const commandModel = ref(new CreatePositionForService())
const emit = defineEmits(['createItem']);
const { positionList } = storeToRefs(useManagementDtoStore());
const { serviceGroupList } = storeToRefs(useCrmServiceStore());

const addPositionForServiceOrGroupForm = ref(null as any);
useManagementDtoStore().getPositionList({ pageSize: 1000, pageNumber: 1 });

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    },
    isGroup: {
        type: Boolean,
        required: true,
        default: false
    }
});

onMounted(() => {
    if (!props.isGroup) {
        getServicePosition();
    }
})

const selectedPositions = ref(new Array<LookupDto>())

const getServicePosition = () => {
    if (!props.selectedItem.subItems) {
        useCrmServiceStore().getPositionListForService(props.selectedItem.id).then((res: Array<LookupDto>) => {
            selectedPositions.value = res;
        }).catch((error) => {
            catchError(error, () => { getServicePosition() })
        })
    } else {
        selectedPositions.value = props.selectedItem.subItems
    }
}

const addPositionForServiceOrGroup = () => {
    addPositionForServiceOrGroupForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.positionIds = selectedPositions.value.map((x) => x.id)
            var selectedGroupId = "";
            if (props.isGroup == true) {
                selectedGroupId = props.selectedItem.id
                commandModel.value.serviceId = null
            } else {
                selectedGroupId = props.selectedItem.serviceGroup.id
                commandModel.value.serviceId = props.selectedItem.id
            }
            useCrmServiceStore().createPositionForService(selectedGroupId, commandModel.value).then((response: any) => {
                props.dialogClose();
                if (serviceGroupList.value.items) {
                    const groupIndex = serviceGroupList.value.items.findIndex((x: any) => x.id == selectedGroupId);
                    const group = serviceGroupList.value.items[groupIndex];
                    if (group.subItems) {
                        if (props.isGroup == true) {
                            group.hasChild = true;
                            group.subItems.forEach((a) => {
                                if (a.subItems) {
                                    selectedPositions.value.forEach((z) => {
                                        if (!a.subItems.some((y) => y.id == z.id))
                                            a.subItems.unshift({
                                                id: z.id,
                                                name: z.name,
                                                service: { id: a.id, name: a.title },
                                                serviceGroup: { id: selectedGroupId, name: group.title }
                                            } as any)
                                    })
                                }
                            })
                        } else {
                            const serviceIndex = group.subItems.findIndex((x) => x.id == commandModel.value.serviceId)
                            if (group.subItems[serviceIndex].subItems) {
                                const service = group.subItems[serviceIndex];
                                service.hasChild = true;
                                selectedPositions.value.forEach((z) => {
                                    if (!service.subItems.some((y) => y.id == z.id))
                                        service.subItems.unshift({
                                            id: z.id,
                                            name: z.name,
                                            service: { id: service.id, name: service.title },
                                            serviceGroup: { id: service.serviceGroup.id, name: service.serviceGroup.name }
                                        } as any)
                                })
                            }
                        }
                    }
                }
            }).catch((error) => {
                return catchError(error, () => addPositionForServiceOrGroup())
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
        click: addPositionForServiceOrGroup,
        loading: false
    }
])

</script>