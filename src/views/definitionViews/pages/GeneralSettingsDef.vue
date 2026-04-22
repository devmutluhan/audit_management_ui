<template>
    <v-card :border="false">
        <v-card-text>
            <v-form ref="companySettingsRef">
                <v-row>
                    <v-col cols="12">
                        <SwitchInput v-model="command.includeServiceConflict" label="form.includeServiceConflict"
                            description-text="form.includeServiceConflictDesc" description-text-visible />
                    </v-col>
                    <v-col cols="12">
                        <SwitchInput v-model="command.includeCompanyRotation" label="form.includeCompanyRotation"
                            :disabled="!command.includeServiceConflict"
                            description-text="form.includeCompanyRotationDesc" description-text-visible />
                    </v-col>
                </v-row>
            </v-form>
            <v-row class="d-flex justify-center mt-8">
                <v-col cols="auto">
                    <v-btn color="resetButtonColor" size="large" @click="resetForm()"
                        :disabled="disabledButtons || loading">
                        {{ $t('general.reset') }}
                    </v-btn>
                </v-col>
                <v-col cols="auto">
                    <v-btn color="approveButtonColor" size="large" @click="updateCompanySettings()"
                        :disabled="disabledButtons" :loading="loading">
                        {{ $t('general.update') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import SwitchInput from '@/components/formInput/generalInputs/SwitchInput.vue';
import { catchError } from '@/core/helpers/generalResponse';
import { UpdateCompanySettingsCommand } from '@/models/entities/management/ManagementCommands';
import { useManagementCommandStore } from '@/stores/managementStores/managementCommandStore';
import { useManagementDtoStore } from '@/stores/managementStores/managementDtoStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const command = ref(new UpdateCompanySettingsCommand());
const companySettingsRef = ref(null as any);
const loading = ref(false)

const { companySettings } = storeToRefs(useManagementDtoStore());
useManagementDtoStore().getCompanySettings();

watch(() => companySettings.value, (newValue) => {
    if (newValue) {
        command.value.includeServiceConflict = JSON.parse(JSON.stringify(newValue.includeServiceConflict))
        command.value.includeCompanyRotation = JSON.parse(JSON.stringify(newValue.includeCompanyRotation))
    }
}, { immediate: true, deep: true });

watch(() => command.value.includeServiceConflict, (newValue) => {
    if (!newValue) {
        command.value.includeCompanyRotation = false
    }
})

const updateCompanySettings = () => {
    companySettingsRef.value.validate().then((res: any) => {
        if (res.valid) {
            loading.value = true
            useManagementCommandStore().updateCompanySettings(command.value).then((res: any) => {
                companySettings.value.includeCompanyRotation = JSON.parse(JSON.stringify(command.value.includeCompanyRotation));
                companySettings.value.includeServiceConflict = JSON.parse(JSON.stringify(command.value.includeServiceConflict));
            }).catch((error) => {
                return catchError(error, () => { updateCompanySettings() })
            }).finally(() => {
                loading.value = false;
            })
        }
    });
}

const resetForm = () => {
    if (companySettings.value) {
        command.value.includeServiceConflict = JSON.parse(JSON.stringify(companySettings.value.includeServiceConflict));
        command.value.includeCompanyRotation = JSON.parse(JSON.stringify(companySettings.value.includeCompanyRotation));
    }
}

const disabledButtons = computed(() => {
    if (!companySettings.value) {
        return false;
    }
    const isConflictSame = companySettings.value.includeServiceConflict === command.value.includeServiceConflict;
    const isRotationSame = companySettings.value.includeCompanyRotation === command.value.includeCompanyRotation;

    return isConflictSame && isRotationSame;
});

</script>