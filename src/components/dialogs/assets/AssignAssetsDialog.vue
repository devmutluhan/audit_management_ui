<template>
    <DialogContent title="general.assignToAsset" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="assignAssetsFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <EmployeeSelectInput justId @selectValue="commandModel.employeeId = $event" isRequired
                            :employeeStatusFilter="null" />
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
import { onMounted, type PropType, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import EmployeeSelectInput from '@/components/formInput/readyInput/EmployeeSelectInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { AssetsDto, AssignAssetCommand } from '@/models/entities/assets/AssetsModels';
import { useAssetsStore } from '@/stores/assetsStores/assetsStore';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { AssetStatusEnum } from '@/models/custom/EnumTypes';

const commandModel = ref(new AssignAssetCommand())
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
            useAssetsStore().assignAssets(props.selectedItem.id, commandModel.value).then(() => {
                props.dialogClose();
                emit('createItem', commandModel.value);
                props.selectedItem.status = AssetStatusEnum.Assigned
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