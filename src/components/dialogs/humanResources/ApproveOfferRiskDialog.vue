<template>
    <DialogContent title="general.selectRiskStatus" :dialogClose="dialogClose" titleIcon="mdi-pencil"
        :buttons="buttons">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
                    <v-radio-group v-model="command.selectedRiskStatus" inline hide-details>
                        <v-radio v-if="props.selectedItem.riskStatus == CustomerRiskLevel.Low"
                            :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.Low)?.title"
                            :value="CustomerRiskLevel.Low" color="success"></v-radio>
                        <v-radio v-if="props.selectedItem.riskStatus != CustomerRiskLevel.High"
                            :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.Mid)?.title"
                            :value="CustomerRiskLevel.Mid" color="info"></v-radio>
                        <v-radio :label="customerRiskTypes.find((a) => a.value == CustomerRiskLevel.High)?.title"
                            :value="CustomerRiskLevel.High" color="error"></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import { OfferListDto } from '@/models/entities/crm/CrmOfferDtos';
import { ApproveOfferCommand } from '@/models/entities/crm/CrmOfferCommands';
import { CustomerRiskLevel } from '@/models/custom/EnumTypes';
import { enumToArray } from '@/core/helpers/enumToArray';
import { useOfferStore } from '@/stores/crmStores/offerStore';
import { catchError } from '@/core/helpers/generalResponse';

const emits = defineEmits(['approveOffer']);

const command = ref(new ApproveOfferCommand());
const customerRiskTypes = ref(enumToArray(CustomerRiskLevel));

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: OfferListDto,
        required: true
    }
});

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    },
    {
        type: 'save',
        click: () => { approveFunc(props.selectedItem, command.value) },
        loading: false
    }
])

const approveFunc = (data: OfferListDto, command: ApproveOfferCommand) => {
    buttons.value[1].loading = true;
    useOfferStore().approveOffer(data.id, command).then(() => {
        emits('approveOffer', data.id);
        props.dialogClose();
    }).catch((error) => {
        return catchError(error, () => { approveFunc(data, command) })
    }).finally(() => {
        buttons.value[1].loading = false;
    });
}
</script>