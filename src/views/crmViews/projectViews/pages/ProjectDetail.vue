<template>
    <v-row fluid class="pa-0">
        <v-col cols="12">
            <ProjectDetailHeaderCard :projectDetail="projectDetail" @endToProject="endToProject()"
                :isUpdated="isUpdated" />
        </v-col>
        <v-col cols="12">
            <Tabs2 :pages="projectDetailPages" />
        </v-col>
        <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
        <v-col cols="12">
            <RouterView @endToProject="endToProject()" :projectDetail="projectDetail" :isUpdated="isUpdated" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ProjectDetailHeaderCard from '@/components/cards/offerCards/ProjectDetailHeaderCard.vue';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { storeToRefs } from 'pinia';
import Tabs2 from "@/components/tabs/Tabs2.vue";
import { computed, ref } from 'vue';
import { ConfirmModalType } from '@/models/types';
import { useRoute } from 'vue-router';
import { catchError } from '@/core/helpers/generalResponse';
import { useProjectStore } from '@/stores/crmStores/projectStore';

const route = useRoute();

const { projectDetail } = storeToRefs(useProjectStore());
useProjectStore().getProjectDetail(route.params.id.toString());

const confirmDialog = ref(false)
const confirmModalValue = ref(new ConfirmModalType());

const isUpdated = computed(() => {
    return projectDetail.value.manageProject;
})

const projectDetailPages = ref([
    {
        to: { name: "project-information", params: { id: route.params.id } },
        name: "projectInformation",
    },
    {
        to: { name: "project-cost", params: { id: route.params.id } },
        name: "projectCost",
    }
])

const endToProject = () => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        buttonLoading: false,
        title: 'general.endToProject',
        text: "general.endToProjectDescription",
        action: () => {
            confirmModalValue.value.buttonLoading = true
            useProjectStore().endToProject(route.params.id.toString()).then(() => {
                confirmDialog.value = false;
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action ? confirmModalValue.value.action() : '' })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = true;
            });
        }
    }
}

</script>