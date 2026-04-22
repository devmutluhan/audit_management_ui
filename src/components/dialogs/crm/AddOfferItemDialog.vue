<template>
    <DialogContent title="general.addService" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="addOfferItemForm">
                <v-row>
                    <v-col v-for="(item, index) in selectItems" :key="index" cols="12" class="px-0">
                        <v-card>
                            <v-card-text>
                                <v-row class="d-flex align-center">
                                    <v-col cols="12" align="end" v-if="!(selectItems.length == 1 && index == 0)">
                                        <v-btn color="error"
                                            @click="selectItems.splice(index, 1); filterServiceGroup(item); checkConflict()">
                                            {{ $t('general.delete') }}
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12">
                                        <SingleAutocompleteInput v-model="item.serviceGroup" label="form.serviceGroup"
                                            :items="item.serviceGroupItems" item-title="title" isReturnObject isRequired
                                            @update:model-value="filterServiceToGroup(item); filterServiceGroup(item);"
                                            :appendIcon="hasClaimOrModules(['ManageCrmSettings']) ? 'mdi-plus-circle' : ''"
                                            @appendIcon="addServiceGroupDialog = true">
                                        </SingleAutocompleteInput>
                                    </v-col>
                                    <v-col cols="12">
                                        <MultipleAutocompleteInput v-model="item.services" label="form.selectService"
                                            :items="item.serviceItems" :disabled="!item.serviceGroup?.id" isRequired
                                            item-title="title" isReturnObject @update:model-value="checkConflict"
                                            :appendIcon="hasClaimOrModules(['ManageCrmSettings']) ? 'mdi-plus-circle' : ''"
                                            @appendIcon="addServiceForGroupDialog = true; addServiceItem = item">
                                        </MultipleAutocompleteInput>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="px-0">
                        <AddButtonCard v-model="selectItems"
                            :disabled="!selectItems[selectItems.length - 1].serviceGroup?.id" title="form.addService"
                            :validationRef="addOfferItemForm" :addItemFunc="addStepFunction" />
                    </v-col>
                </v-row>
            </v-form>
            <VDialogContent v-model="addServiceGroupDialog">
                <AddServiceGroupDialog :dialogClose="() => { addServiceGroupDialog = false }" @create-item="selectItems.forEach((a) => a.serviceGroupItems.push($event));
                useCrmServiceStore().getServiceList({ pageSize: 1000, pageNumber: 1 });" />
            </VDialogContent>
            <VDialogContent v-model="addServiceForGroupDialog">
                <AddServiceForGroupDialog :dialogClose="() => { addServiceForGroupDialog = false }"
                    :selectedItem="addServiceItem.serviceGroup"
                    @create-item="addServiceItem.serviceItems.push($event); addServiceItem.services.push($event)" />
            </VDialogContent>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import AddButtonCard from '@/components/cards/AddButtonCard.vue';
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import MultipleAutocompleteInput from '@/components/formInput/generalInputs/MultipleAutocompleteInput.vue';
import { ServiceDto, ServiceGroupDto } from '@/models/entities/crm/CrmServiceDtos';
import { storeToRefs } from 'pinia';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { watch } from 'vue';
import AddServiceGroupDialog from './AddServiceGroupDialog.vue';
import AddServiceForGroupDialog from './AddServiceForGroupDialog.vue';
import type { OfferItemDto } from '@/models/entities/crm/CrmOfferDtos';
import { createOfferItemDto } from '@/core/helpers/crmUtils';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { CheckConflictCommand, CheckConflictResponse } from '@/models/entities/crm/CrmOfferCommands';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';
import type { ApiResult } from '@/models/ApiResult';
import VDialogContent from '../VDialogContent.vue';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';

const addServiceGroupDialog = ref(false);
const addServiceForGroupDialog = ref(false);
const addServiceItem = ref({} as SelectItemDto)

interface SelectItemDto {
    serviceGroup: ServiceGroupDto,
    serviceGroupItems: Array<ServiceGroupDto>,
    services: Array<ServiceDto>,
    serviceItems: Array<ServiceDto>,
}

const emit = defineEmits(['createItem']);
const { serviceList, serviceGroupList } = storeToRefs(useCrmServiceStore());
const { createOfferCommand, offerDetail } = storeToRefs(useOfferStore())
useCrmServiceStore().getServiceGroupList({ pageSize: 1000, pageNumber: 1 });
useCrmServiceStore().getServiceList({ pageSize: 1000, pageNumber: 1 });

const addOfferItemForm = ref(null as any);
const selectItems = ref([{
    serviceGroup: new ServiceGroupDto(),
    serviceGroupItems: Array<ServiceGroupDto>(),
    services: Array<ServiceDto>(),
    serviceItems: Array<ServiceDto>()
}] as Array<SelectItemDto>)

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedServiceIds: {
        type: Array<string>,
        required: false
    }
});

const filterServiceToGroup = (selectItem: SelectItemDto) => {
    if (selectItem.serviceGroup && serviceList.value.items) {
        selectItem.services = new Array<ServiceDto>();
        selectItem.serviceItems = serviceList.value.items.filter((a: ServiceDto) => a.serviceGroup.id == selectItem.serviceGroup.id)
    }
}

const filterServiceGroup = (selectItem: SelectItemDto) => {
    if (selectItem.serviceGroup) {
        selectItems.value.forEach((a) => {
            a.serviceGroupItems = serviceGroupList.value.items?.filter((x) => !selectItems.value.some((b) => b.serviceGroup.id == x.id)) ?? new Array<ServiceGroupDto>();
        });

        selectItems.value.forEach((a) => {
            if (serviceGroupList.value.items) {
                const index = serviceGroupList.value.items.findIndex((x) => x.id == a.serviceGroup.id);
                if (index != -1)
                    a.serviceGroupItems.unshift(serviceGroupList.value.items[index])
            }
        });
    }
}
const route = useRoute();
const { companySettings } = storeToRefs(useManagementDtoStore());
useManagementDtoStore().getCompanySettings();

const checkConflict = () => {
    if (!companySettings.value.includeServiceConflict) {
        buttons.value[1].disabled = false
        return
    }

    const command = new CheckConflictCommand();
    let serviceIds = new Array<string>()
    selectItems.value.forEach((a) => {
        a.services.forEach((b) => {
            if (!serviceIds.includes(b.id))
                serviceIds.push(b.id)
        })
    })
    if (route.name == 'offer-create') {
        command.customerId = createOfferCommand.value.customerId;
        command.includeCompanyRotation = true;
    } else {
        command.customerId = offerDetail.value.customer.id;
        command.includeCompanyRotation = true
    }
    if (props.selectedServiceIds) {
        props.selectedServiceIds.forEach((a: string) => {
            if (!serviceIds.includes(a))
                serviceIds.push(a)
        })
    }
    command.selectedServiceIds = serviceIds
    if (command.selectedServiceIds.length > 0)
        useOfferStore().checkConflict(command).then((res: ApiResult<Array<CheckConflictResponse>>) => {
            let index = res.data.findIndex((a) => a.conflictList.length > 0 || a.offerCodes.length > 0)
            if (index != -1) {
                buttons.value[1].disabled = true;
                if (res.data[index].conflictList.length > 0) {
                    ErrorStatusResult[400]({ title: 'Conflict', message: `${res.data[index].title} hizmeti, ${res.data[index].conflictList.map((a) => a.title).join(',')} hizmetleri ile çakışmaktadır.` })
                } else if (res.data[index].offerCodes.length > 0) {
                    ErrorStatusResult[400]({ title: 'Conflict', message: `${res.data[index].title} hizmeti, ${res.data[index].offerCodes.map((a) => a).join(',')} kodlu eski tekliflerle çakışmaktadır.` })
                }
            } else {
                buttons.value[1].disabled = false
            }
        }).catch((error) => {
            return catchError(error, () => { checkConflict() })
        })
}

const addStepFunction = () => {
    selectItems.value.push({
        serviceGroup: new ServiceGroupDto(),
        services: new Array<ServiceDto>(),
        serviceGroupItems: serviceGroupList.value.items?.filter((x) => !selectItems.value.some((a) => a.serviceGroup.id == x.id)) ?? new Array<ServiceGroupDto>(),
        serviceItems: new Array<ServiceDto>()
    })
}

watch(() => serviceGroupList.value.items, () => {
    if (serviceGroupList.value.items) {
        selectItems.value[0].serviceGroupItems = serviceGroupList.value.items;
    }
})

const resultOfferItemModel = () => {
    addOfferItemForm.value.validate().then((res: any) => {
        if (res.valid) {
            let selectedServices = new Array<ServiceDto>();

            selectItems.value.forEach((x) => {
                selectedServices = selectedServices.concat(x.services)
            });
            emit('createItem', createResultModel(selectedServices));
            props.dialogClose();
        }
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false,
        disabled: false
    },
    {
        type: 'save',
        click: resultOfferItemModel,
        loading: false,
        disabled: false
    }
])


const createResultModel = (selectedServices: Array<ServiceDto>): Array<OfferItemDto> => {
    // Hizmetleri item olarak ekliyor
    let result = selectedServices.map((a: ServiceDto): OfferItemDto => {
        return createOfferItemDto({
            serviceGroup: { id: a.serviceGroup.id, title: a.serviceGroup.name },
            service: { id: a.id, title: a.title }
        })
    });

    // Hizmet Gruplarını da item olarak ekliyor
    // result = result.concat(selectedServices.map((a: ServiceDto): OfferItemDto => {
    //     return createOfferItemDto({
    //         serviceGroup: { id: a.serviceGroup.id, title: a.serviceGroup.name },
    //         service: null,
    //         quantity: 0
    //     })
    // }))

    return result
}

</script>