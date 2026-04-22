<template>
    <DialogContent title="general.updateServiceGroup" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-card border="false">
                <v-card-text>
                    <v-form ref="updateServiceGroupForm">
                        <v-row class="d-flex align-center">
                            <v-col cols="12">
                                <TextField v-model="commandModel.title" label="form.title" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { useCrmServiceStore } from '@/stores/crmStores/crmServiceStore';
import { catchError } from '@/core/helpers/generalResponse';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const commandModel = ref({ title: '' })
const emit = defineEmits(['createItem']);
const { serviceGroupList } = storeToRefs(useCrmServiceStore());

const updateServiceGroupForm = ref(null as any);
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

onMounted(() => {
    commandModel.value.title = props.selectedItem.title;
})

const updateServiceGroup = () => {
    updateServiceGroupForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            useCrmServiceStore().updateServiceGroup(props.selectedItem.id, commandModel.value).then((response: any) => {
                props.dialogClose();
                if (serviceGroupList.value.items) {
                    const index = serviceGroupList.value.items.findIndex((x) => x.id == props.selectedItem.id)
                    serviceGroupList.value.items[index].title = commandModel.value.title;
                }
            }).catch((error) => {
                return catchError(error, () => updateServiceGroup())
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
        click: updateServiceGroup,
        loading: false
    }
])

</script>