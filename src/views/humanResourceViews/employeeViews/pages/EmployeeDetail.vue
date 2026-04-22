<template>
    <v-container fluid class="pa-0">
        <div class="card">
            <div class="card-body pa-2">
                <v-row class="d-flex align-center">
                    <v-col cols="auto pr-0 pr-md-4">
                        <FileCardInput :fileCategory="FileCategoryEnum.ProfilePicture" @fileList="fileUploaded"
                            :image-height="220" :image-width="220">
                            <template v-slot:component>
                                <ImageCard :firstValue="employeeDetail.firstName" :secondValue="employeeDetail.lastName"
                                    fontSize="20px" size="60" :avatar-text="employeeDetail.avatarUrl" />
                            </template>
                        </FileCardInput>
                    </v-col>
                    <v-col cols="auto pr-0 pr-md-4">
                        <p class="text-h6 font-weight-bold mb-0">
                            {{ employeeDetail.fullName }}
                        </p>
                        <p class="text-body-1 mb-0">
                            {{ employeeDetail.nationality ? employeeDetail.nationality.name : '--' }}
                        </p>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="auto pr-0 pr-md-4">
                        <div class="d-flex my-4">
                            <div class="me-0">
                                <GeneralDropdown :menuItems="menuItems"></GeneralDropdown>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <Tabs2 :pages="filterPages" />
            </div>
            <VDialogContent v-model="updateEmployeeDialog">
                <UpdateEmployeeDialog :dialogClose="() => { updateEmployeeDialog = false }" />
            </VDialogContent>
            <VDialogContent v-model="terminateEmployeeDialog">
                <TerminateEmployeeDialog :dialogClose="() => { terminateEmployeeDialog = false }"
                    :employeeId="route.params.id.toString()" />
            </VDialogContent>
        </div>
        <RouterView />
    </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import type { GeneralDropdownType } from "@/models/types";
import FileCardInput from "@/components/formInput/generalInputs/FileCardInput.vue";
import { FileCategoryEnum } from "@/models/custom/EnumTypes";
import { useRoute } from "vue-router";

import { useEmployeeDtoStore } from "@/stores/humanResourcesStores/employeeDtoStore";
import { storeToRefs } from "pinia";
import Tabs2 from "@/components/tabs/Tabs2.vue";
import ImageCard from "@/components/cards/ImageCard.vue";
import { filterMenu } from "@/core/menuPageManagement/moduleClaimUtils";
import UpdateEmployeeDialog from "@/components/dialogs/humanResources/UpdateEmployeeDialog.vue";
import TerminateEmployeeDialog from "@/components/dialogs/humanResources/TerminateEmployeeDialog.vue";
import { EmployeeDetailDto } from "@/models/entities/humanResource/EmployeeDtos";
import { UpdateEmployeeCommand } from "@/models/entities/humanResource/EmployeeCommands";
import { useEmployeeCommandStore } from "@/stores/humanResourcesStores/employeeCommandStore";
import { catchError } from "@/core/helpers/generalResponse";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import type { GeneralFileResponse } from "@/models/ApiResult";
const route = useRoute();

const { getEmployeeDetail } = useEmployeeDtoStore();
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const commandModel = ref(new UpdateEmployeeCommand())
onMounted(() => {
    employeeDetail.value = new EmployeeDetailDto();
})

getEmployeeDetail(route.params.id.toString());
const updateEmployeeDialog = ref(false);
const terminateEmployeeDialog = ref(false);


const fileUploaded = (files: Array<GeneralFileResponse>) => {
    const file = files[0]
    matchEmployeeDetailModel();
    commandModel.value.avatarFileId = file.fileId;
    useEmployeeCommandStore().updateEmployee(commandModel.value).then((res: any) => {
        employeeDetail.value.avatarUrl = file.url;
    }).catch((error) => {
        return catchError(error, () => fileUploaded(files))
    })
}

const matchEmployeeDetailModel = () => {
    commandModel.value.id = employeeDetail.value.id
    commandModel.value.contractEndDate = employeeDetail.value.contractEndDate
    commandModel.value.contractType = employeeDetail.value.contractType
    commandModel.value.firstName = employeeDetail.value.firstName
    commandModel.value.lastName = employeeDetail.value.lastName
}


const employeeDetailPages = ref([
    {
        to: { name: "employee-profile", params: { id: route.params.id } },
        name: "employeeProfile",
    },
    {
        to: { name: "employee-information", params: { id: route.params.id } },
        name: "employeeInformation",
    },
    {
        to: { name: "employee-career", params: { id: route.params.id } },
        name: "employeeCareer",
    },
    {
        to: { name: "personel-vacation", params: { id: route.params.id } },
        name: "employeeVacation",
    },
    {
        to: { name: "personel-payment", params: { id: route.params.id } },
        name: "employeePayment",
    },
    {
        to: { name: "personel-asset", params: { id: route.params.id } },
        name: "employeeDebits",
    },
    {
        to: { name: "personel-training", params: { id: route.params.id } },
        name: "employeeCourses",
    },
    {
        to: { name: "personel-assets", params: { id: route.params.id } },
        name: "employeeAssets",
    },
    {
        to: { name: "employee-documents", params: { id: route.params.id } },
        name: "employeeDocuments",
    }
])

const filterPages = filterMenu(employeeDetailPages.value);

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.edit",
        action: () => updateEmployeeDialog.value = true
    },
    {
        title: "general.terminateEmployee",
        confirmModalValue: {
            text: "general.terminateDescription",
            buttonLoading: false,
            action: () => {
                menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
                setTimeout(() => {
                    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : ''
                }, 200)
                terminateEmployeeDialog.value = true;
            },
        },
    }
]);

</script>