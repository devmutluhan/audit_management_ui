<template>
    <DialogContent title="general.addDocumentDefinition" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-plus">
        <template v-slot:dialogBody>
            <v-form ref="createDocumentChildForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12">
                        <TextField v-model="commandModel.name" label="form.name" isRequired />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.isRequired" label="form.isRequired" />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="commandModel.hasExpiration" label="form.hasExpiration" />
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
import type { ApiResult } from '@/models/ApiResult';
import { CreateDocumentDefinitionCommand } from '@/models/entities/humanResource/DocumentModels';
import { useDocumentStore } from '@/stores/humanResourcesStores/documentStore';
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { useRoute } from 'vue-router';
import { ErrorStatusResult } from '@/core/helpers/errorStatusResult';

const commandModel = ref(new CreateDocumentDefinitionCommand());
const emit = defineEmits(['createItem', 'goBack']);
const route = useRoute();

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const createDocumentChildForm = ref(null as any);
const createDocumentCategory = () => {
    createDocumentChildForm.value.validate().then((res: any) => {
        if (res.valid) {
            if (route.query.id) {
                buttons.value[1].loading = true;
                useDocumentStore().createDefinition(route.query.id.toString(), commandModel.value).then((res: ApiResult<string>) => {
                    if (res.data) {
                        emit('createItem', {
                            id: res.data,
                            name: commandModel.value.name,
                            isRequired: commandModel.value.isRequired,
                            hasExpiration: commandModel.value.hasExpiration,
                            categoryId: route.query.id?.toString()
                        });
                        props.dialogClose();
                        commandModel.value = new CreateDocumentDefinitionCommand()
                    }
                }).catch((error) => {
                    return catchError(error, () => { createDocumentCategory() })
                }).finally(() => {
                    buttons.value[1].loading = false;
                })
            } else {
                ErrorStatusResult[400]();
                emit('goBack')
            }
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
        click: createDocumentCategory,
        loading: false
    }
])

</script>