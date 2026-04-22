<template>
    <DialogContent title="general.addClaimCardToUser" :dialogClose="dialogClose" titleIcon="mdi-plus"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <!-- <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row> -->
            <v-row class="d-flex align-center">
                <v-col class="pt-2">
                    <Datatable :data="initTableData" :header="tableHeader" :enable-items-per-page-dropdown="true"
                        :checkbox-enabled="true" checkbox-label="id" :loading="loading" :notMobileView="true"
                        :currentlySelectedItems="selectedTemplates" @on-items-select="selectedTemplates = $event">
                        <template v-slot:name="{ row: data }">
                            {{ data.name }}
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import Datatable from '@/components/kt-datatable/KTDataTable.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { clientFilter } from '@/core/helpers/generalUtils';
import type { TemplatesDto } from '@/models/entities/user/UserDtos';
import { useUserStore } from '@/stores/userStores/userStore';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const loading = ref(false);
const { templateList, userClaimCardList } = storeToRefs(useUserStore());

const tableHeader = ref([
    {
        columnName: 'form.claimCardTitle',
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
    }
])

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    },
});

const initTableData = ref(new Array<TemplatesDto>())

watch(() => templateList.value.length, () => {
    initTableData.value = templateList.value
})

const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(templateList.value, 'name', searchName);
    } else {
        initTableData.value = templateList.value
    }
}

useUserStore().getTemplatesFromUser(props.selectedItem.id);
useUserStore().getTemplates();

const selectedTemplates = ref([] as Array<string>)

const addClaimCardFromEmployee = () => {
    buttons.value[1].loading = true;
    useUserStore().assignTemplatesToUser(props.selectedItem.id, selectedTemplates.value).then((res) => {
        props.dialogClose();
    }).catch((error) => {
        return catchError(error, () => { addClaimCardFromEmployee() })
    }).finally(() => {
        buttons.value[1].loading = false;
    })
}

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: () => { addClaimCardFromEmployee() },
        loading: false
    }
]);

watch(() => userClaimCardList.value, () => {
    if (userClaimCardList.value.length > 0) {
        setTimeout(() => {
            selectedTemplates.value = userClaimCardList.value.map((x: any) => x.id)
        }, 500)
    }
});

</script>