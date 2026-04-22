<template>
    <DialogContent title="general.assignToAsset" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="assignAssetsFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <SingleAutocompleteInput v-model="selectedAssets" isReturnObject itemTitle="serialNumber"
                            itemValue="id" :items="assetsList.items ?? []" label="form.assets">
                            <template v-slot:menuItem="{ item }">
                                <v-list-item link class="py-0 px-4" @click="selectedAssets = item">
                                    <v-row>
                                        <v-col>
                                            <v-list-item-title>{{ item.serialNumber }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ item.brand + ' / ' + item.model }}
                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>
                                </v-list-item>
                            </template>
                            <template v-slot:chipItem="{ item }">
                                {{ item.serialNumber }}
                            </template>
                        </SingleAutocompleteInput>
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <DateInput v-model="commandModel.assignDate" label="list.assignAssetDate" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.note" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { AssetsDto, AssignAssetCommand } from '@/models/entities/assets/AssetsModels';
import { useAssetsStore } from '@/stores/assetsStores/assetsStore';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { storeToRefs } from 'pinia';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { AssetStatusEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new AssignAssetCommand())
const emit = defineEmits(['createItem']);
const { assetsList } = storeToRefs(useAssetsStore());
useAssetsStore().getAssetsList({ pageSize: 1000, pageNumber: 1, status: AssetStatusEnum.Available })

const props = defineProps({
    employeeId: {
        type: String,
        required: true,
    },
    dialogClose: {
        type: null as any,
        required: true
    }
});
const selectedAssets = ref(new AssetsDto())
const assignAssetsFormRef = ref(null as any);
const assignAssetsFunc = () => {
    assignAssetsFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            commandModel.value.employeeId = props.employeeId;
            useAssetsStore().assignAssets(selectedAssets.value.id, commandModel.value).then(() => {
                props.dialogClose();
                const result = {
                    id: selectedAssets.value.id,
                    categoryName: selectedAssets.value.assetCategoryName,
                    brand: selectedAssets.value.brand,
                    serialNumber: selectedAssets.value.serialNumber,
                    model: selectedAssets.value.model,
                    note: commandModel.value.note,
                    assignDate: commandModel.value.assignDate,
                    returnDate: '',
                }
                emit('createItem', result);
            }).catch((error) => {
                return catchError(error, () => assignAssetsFunc())
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
        click: assignAssetsFunc,
        loading: false
    }
])

</script>