<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent>
                        <template v-slot:activator="{ props }">
                            <PageTitleCreateButton title="general.createClaimCard" v-bind="props">
                            </PageTitleCreateButton>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <AddClaimCardDialog :dialogClose="() => { isActive.value = false }"
                                @createItem="useUserStore().getTemplates();" />
                        </template>
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col> -->
            <v-row class="fill-height">
                <v-col>
                    <Datatable :data="initTableData" :header="tableHeader" :enable-items-per-page-dropdown="true"
                        :loading="loading" :isHeadRowFilter="true">
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <VDialogContent v-model="updateDialog">
        <UpdateClaimCardDialog :dialogClose="() => { updateDialog = false }" :selectedClaimCard="selectedClaimCard"
            @createItem="useUserStore().getTemplates();" />
    </VDialogContent>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import AddClaimCardDialog from '@/components/dialogs/definitions/AddClaimCardDialog.vue';
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from '@/models/types';
import UpdateClaimCardDialog from '@/components/dialogs/definitions/UpdateClaimCardDialog.vue';
import { useUserStore } from '@/stores/userStores/userStore';
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';

import { storeToRefs } from 'pinia';
import type { TemplatesDto } from '@/models/entities/user/UserDtos';
import { clientFilter } from '@/core/helpers/generalUtils';
import { catchError } from '@/core/helpers/generalResponse';
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import PageTitleTeleport from '@/components/teleports/PageTitleTeleport.vue';
import PageTitleCreateButton from '@/components/formInput/generalInputs/PageTitleCreateButton.vue';
import { activeClientFilters, claimCardFilterText, clientFilterList, mountComponentForClientFilter } from '@/core/data/readyClientFilterColumnObject';

const updateDialog = ref(false);
const buttonLoading = ref(false);
const selectedClaimCard = ref(null as any)

const { templateList, loading } = storeToRefs(useUserStore());
useUserStore().getTemplates()

templateList.value = new Array<TemplatesDto>()
const initTableData = ref(new Array<TemplatesDto>())

watch(() => templateList.value.length, () => {
    initTableData.value = templateList.value
})

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useUserStore().deleteClaimTemplates(data.id).then(() => {
        templateList.value = templateList.value.filter(x => x.id !== data.id);
    }).catch((error) => {
        return catchError(error, () => { deleteFunc(data) })
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: any) => {
            selectedClaimCard.value = item
            updateDialog.value = true
        },
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: buttonLoading.value,
            action: deleteFunc,
        },
    }
]);

const tableHeader = ref([
    claimCardFilterText,
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    },
])

mountComponentForClientFilter(tableHeader.value);
watch(() => activeClientFilters.value.length, () => {
    initTableData.value = clientFilterList(templateList.value)
})

</script>