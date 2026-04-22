<template>
    <v-row class="d-flex align-center">
        <v-col cols="auto">
            <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                    <PageTitleCreateButton title="general.addNew" v-bind="props"></PageTitleCreateButton>
                </template>
                <v-card color="dropdownCard" width="400">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <TextField v-model="createNameCommand.name" :label="label ? label : 'general.title'"
                                    @keyup.enter="clickSubmit()" hideDetails />
                            </v-col>
                            <v-col cols="12" align="center">
                                <v-btn @click="clickSubmit()" :loading="loading" :height="45"
                                    :disabled="createNameCommand.name.length == 0">
                                    {{ $t('general.save') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { NameCommand } from "@/models/ApiResult";
import { ref, watch } from "vue";
import TextField from "@/components/formInput/generalInputs/TextField.vue";
import PageTitleCreateButton from "../formInput/generalInputs/PageTitleCreateButton.vue";

const createNameCommand = ref(new NameCommand());

const props = defineProps<{
    createFunc: (command: NameCommand) => void;
    loading?: boolean;
    label?: string;
}>()

const clickSubmit = () => {
    if (createNameCommand.value.name)
        props.createFunc(createNameCommand.value);
}

watch(() => props.loading, (value) => {
    if (!value) {
        createNameCommand.value = new NameCommand();
    }
})

</script>