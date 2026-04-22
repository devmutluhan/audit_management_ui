<template>
    <DialogContent title="general.returnToAsset" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="assignAssetsFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <DateInput v-model="commandModel.returnDate" label="list.returnDate" isRequired />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { AssetsDto, ReturnAssetCommand } from '@/models/entities/assets/AssetsModels';
import { useAssetsStore } from '@/stores/assetsStores/assetsStore';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { AssetStatusEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new ReturnAssetCommand())
const emit = defineEmits(['createItem']);

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

const assignAssetsFormRef = ref(null as any);
const assignAssetsFunc = () => {
    assignAssetsFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useAssetsStore().returnAssets(props.selectedItem.id, commandModel.value).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
                props.selectedItem.status = AssetStatusEnum.Available
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