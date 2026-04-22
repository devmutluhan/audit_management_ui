<template>
    <DialogContent title="general.addClaimCard" :dialogClose="dialogClose" titleIcon="mdi-plus" :buttons="buttons">
        <template v-slot:dialogBody>
            <v-form ref="addClaimCardRef">
                <v-row class="d-flex align-center">
                    <v-col cols="6" class="pb-0">
                        <TextField v-model="command.name" label="form.claimCardTitle" />
                    </v-col>
                </v-row>
                <v-row class="d-flex align-center">
                    <v-col cols="12" class="pt-2 pa-0">
                        <VuetifyTable :groupBy="groupBy" :data="moduleClaims.filter((a) => a.claimId)"
                            :headers="headers">
                            <template v-slot:listItem="{ item }">
                                <tr class="pa-4 fw-semibold text-uppercase cursor-pointer text-groupRowTextColor"
                                    @click="selectClaim(item)">
                                    <td>
                                        <v-row class="d-flex align-center">
                                            <v-col cols="auto">
                                                <v-checkbox :model-value="command.claims.some((a) => a == item.claimId)"
                                                    hide-details @click.stop="selectClaim(item)"
                                                    color="success"></v-checkbox>
                                            </v-col>
                                            <v-col>
                                                <p class="ma-0"> {{ $t('enums.ClaimOrModules.' + item.claimName) }}</p>
                                                <p class="ma-0 text-caption"> {{ $t('enums.ClaimOrModules.Description.'
                                                    + item.claimName) }}
                                                </p>
                                            </v-col>
                                        </v-row>
                                    </td>
                                </tr>
                            </template>
                            <template #bottom></template>
                        </VuetifyTable>
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import VuetifyTable from '@/components/kt-datatable/VuetifyTable.vue';
import { catchError } from '@/core/helpers/generalResponse';
import i18n from '@/core/plugins/i18n';
import type { ModuleClaimsDto } from '@/models/entities/management/ManagementDtos';
import { CreateTemplatesCommand } from '@/models/entities/user/UserCommands';
import { useGeneralStore } from '@/stores/generalStores/generalStore';
import { useUserStore } from '@/stores/userStores/userStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const t = i18n.global.t;

const groupBy = ref([{
    key: 'moduleName',
    valueFormatter: (value) => {
        return t('enums.ClaimOrModules.' + value);
    }
}]);

const emit = defineEmits(['createItem']);
const { moduleClaims } = storeToRefs(useGeneralStore());
const command = ref(new CreateTemplatesCommand())
useGeneralStore().getTenantModules();

const addClaimCardRef = ref(null as any)
const addClaimCard = () => {
    addClaimCardRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;

            useUserStore().createTemplates(command.value).then((response: any) => {
                props.dialogClose();
                emit('createItem');
            }).catch((error) => {
                return catchError(error, () => { addClaimCard() })
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

const headers = ref([
    {
        title: 'form.claimScope',
        key: "claimName",
        sortable: false,
        sortEnabled: false,
        columnWidth: 175,
    }
])

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const selectClaim = (item: ModuleClaimsDto) => {
    let index = command.value.claims.findIndex((a) => a == item.claimId);
    if (index != -1 && item.claimId)
        command.value.claims.splice(index, 1)
    else
        command.value.claims.push(item.claimId);
}

const buttons = ref([
    {
        type: 'close',
        click: async () => props.dialogClose()
    },
    {
        type: 'save',
        click: async () => addClaimCard(),
        loading: false
    },
])

</script>
