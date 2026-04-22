<template>
    <v-container fluid class="pa-0">
        <div class="card">
            <div class="card-body pa-2">
                <v-row class="d-flex align-center">
                    <v-col cols="auto" align="center">
                        <FileCardInput :fileCategory="FileCategoryEnum.ProfilePicture" @fileList="fileUploaded">
                            <template v-slot:component>
                                <ImageCard :fullName="customerDetail.name" :avatarText="customerDetail.logoUrl"
                                    fontSize="30px" size="80" color="warning" />
                            </template>
                        </FileCardInput>
                    </v-col>
                    <v-col cols="7" md="10">
                        <p class="text-h6 font-weight-bold mb-0 general-page-title">
                            {{ customerDetail.name }}
                        </p>
                        <p class="text-body-2 ma-0 font-weight-bold"
                            :class="customerDetail.keyClient ? 'text-success' : 'text-warning'">
                            {{ customerDetail.keyClient ? $t("form.keyClient") : $t('form.notKeyClient') }}
                        </p>
                    </v-col>
                </v-row>
            </div>
        </div>
        <RouterView />
    </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useCustomerDtoStore } from "@/stores/customerStores/customerDtoStore";
import { storeToRefs } from "pinia";
import ImageCard from "@/components/cards/ImageCard.vue";
import { onUnmounted, ref } from "vue";
import { CustomerDetailDto } from "@/models/entities/customer/CustomerDtos";
import FileCardInput from "@/components/formInput/generalInputs/FileCardInput.vue";
import { FileCategoryEnum } from "@/models/custom/EnumTypes";
import { catchError } from "@/core/helpers/generalResponse";
import { useCustomerCommandStore } from "@/stores/customerStores/customerCommandStore";
import { UpdateCustomerCommand } from "@/models/entities/customer/CustomerCommads";
import type { GeneralFileResponse } from "@/models/ApiResult";

const route = useRoute();
const { customerDetail } = storeToRefs(useCustomerDtoStore());
useCustomerDtoStore().getCustomerDetail(route.params.id.toString());

const commandModel = ref(new UpdateCustomerCommand());

const fileUploaded = (files: Array<GeneralFileResponse>) => {
    const file = files[0]
    matchCustomerDetailModel();
    // todo: fileUrl
    commandModel.value.logoFileId = file.fileId;
    useCustomerCommandStore().updateCustomer(route.params.id.toString(), commandModel.value).then(() => {
        customerDetail.value.logoUrl = file.url;
    }).catch((error) => {
        return catchError(error, () => { fileUploaded(files) })
    })
}

const matchCustomerDetailModel = () => {
    commandModel.value.name = customerDetail.value.name;
    commandModel.value.parentId = customerDetail.value.parent?.id;
    commandModel.value.keyClient = customerDetail.value.keyClient;
    commandModel.value.termTime = customerDetail.value.termTime;
    commandModel.value.taxNumber = customerDetail.value.taxNumber;
    commandModel.value.taxOfficeId = customerDetail.value.taxOffice?.id;
    commandModel.value.customerTypeId = customerDetail.value.type?.id;
    commandModel.value.sectorId = customerDetail.value.sector?.id;
}

onUnmounted(() => {
    customerDetail.value = new CustomerDetailDto();
})

</script>