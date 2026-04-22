<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <!-- <v-col class="pa-0" cols="6" sm="8" md="4">
                <SearchInput @update:model-value="searchFunc" />
            </v-col> -->
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="initTableData" :header="tableHeader" :isHeadRowFilter="true"
                        :enable-items-per-page-dropdown="true" :loading="loading">
                    </Datatable>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import { useEmployeeDtoStore } from "@/stores/humanResourcesStores/employeeDtoStore";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { storeToRefs } from "pinia";
import type { TerminationReasonDto } from "@/models/entities/humanResource/EmployeeDtos";
import { onMounted } from "vue";
import { activeClientFilters, clientFilterList, leaveWorkReasonCodeFilterText, leaveWorkReasonDescriptionFilterText, mountComponentForClientFilter } from "@/core/data/readyClientFilterColumnObject";

const { terminationReasonList, loading } = storeToRefs(useEmployeeDtoStore());
const tableHeader = ref([
    leaveWorkReasonCodeFilterText,
    leaveWorkReasonDescriptionFilterText
])

const initTableData = ref(new Array<TerminationReasonDto>());

onMounted(() => {
    initTableData.value = terminationReasonList.value;
    if (terminationReasonList.value.length == 0)
        useEmployeeDtoStore().getTerminateReasonList();
})

watch(() => terminationReasonList.value.length, () => {
    initTableData.value = terminationReasonList.value
});

mountComponentForClientFilter(tableHeader.value);
watch(() => activeClientFilters.value.length, () => {
    initTableData.value = clientFilterList(terminationReasonList.value)
})

</script>