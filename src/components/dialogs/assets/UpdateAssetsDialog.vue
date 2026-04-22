<template>
    <DialogContent title="general.updateAssets" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateAssetsForm">
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
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { AssetsDto, CreateOrUpdateAssetsCommand } from '@/models/entities/assets/AssetsModels';
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
    selectedItem: {
        type: Object as PropType<AssetsDto>,
        required: true
    },
    dialogClose: {
        type: null as any,
        required: true
    }
});

const updateAssetsForm = ref(null as any);
const updateAssetsFunc = () => {
    updateAssetsForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useAssetsStore().updateAssets(props.selectedItem.id, commandModel.value).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
                props.selectedItem.assetCategoryId = commandModel.value.assetCategoryId;
                props.selectedItem.assetCategoryName = assetCategories.value.items?.find((a) => a.id == commandModel.value.assetCategoryId)?.name ?? ''
                props.selectedItem.brand = commandModel.value.brand
                props.selectedItem.model = commandModel.value.model
                props.selectedItem.description = commandModel.value.description
                props.selectedItem.serialNumber = commandModel.value.serialNumber
                props.selectedItem.status = commandModel.value.status
            }).catch((error) => {
                return catchError(error, () => updateAssetsFunc())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

onMounted(() => {
    commandModel.value = JSON.parse(JSON.stringify(props.selectedItem));
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: updateAssetsFunc,
        loading: false
    }
])

</script>