<template>
    <DialogContent title="general.createAssets" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createAssetsForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.serialNumber" label="list.serialNumber" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <SingleAutocompleteInput v-model="commandModel.assetCategoryId" label="form.category"
                            :items="assetCategories.items ?? []" itemValue="id" itemTitle="name" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.brand" label="list.brand" isRequired />
                    </v-col>
                    <v-col cols="12" sm="6">
                        <TextField v-model="commandModel.model" label="list.model" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <SingleSelectInput v-model="commandModel.status"
                            :items="enumToArray(AssetStatusEnum).filter((a) => a.value != AssetStatusEnum.Assigned)"
                            label="form.status" isRequired />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextArea v-model="commandModel.description" label="form.description" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { CreateOrUpdateAssetsCommand } from '@/models/entities/assets/AssetsModels';
import { useAssetsStore } from '@/stores/assetsStores/assetsStore';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { storeToRefs } from 'pinia';
import SingleSelectInput from '@/components/formInput/generalInputs/SingleSelectInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { AssetStatusEnum } from '@/models/custom/EnumTypes';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';

const commandModel = ref(new CreateOrUpdateAssetsCommand())
const emit = defineEmits(['createItem']);

const { assetCategories } = storeToRefs(useAssetsStore());
useAssetsStore().getAssetsCategories({ pageSize: 100, pageNumber: 1 });

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createAssetsForm = ref(null as any);
const createAssetsFunc = () => {
    createAssetsForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useAssetsStore().createAssets(commandModel.value).then((response) => {
                props.dialogClose();
                emit('createItem', {
                    id: response.data,
                    assetCategoryName: assetCategories.value.items?.find((a) => a.id == commandModel.value.assetCategoryId)?.name,
                    ...commandModel.value
                });
            }).catch((error) => {
                return catchError(error, () => createAssetsFunc())
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
        click: createAssetsFunc,
        loading: false
    }
])

</script>