<template>
    <DialogContent title="general.updateAddress" :buttons="buttons" :dialogClose="dialogClose" titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateEmployeeAddressForm">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <CountrySelectSingle isRequired @selectValue="selectedCountry = $event" :items="countryList"
                            :selectItem="commandModel.countryCode" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField isRequired label="form.city" v-model="commandModel.city" />
                    </v-col>
                    <v-col cols="12">
                        <TextArea isRequired label="form.addressDetail" v-model="commandModel.street" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import CountrySelectSingle from '@/components/formInput/readyInput/CountrySelectSingle.vue';
import TextArea from '@/components/formInput/generalInputs/TextArea.vue';
import { useRoute } from 'vue-router';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { useTaxStore } from '@/stores/generalStores/taxStore';
import { storeToRefs } from 'pinia';
import { UpdateEmployeeAddressCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';

const { countryList } = storeToRefs(useTaxStore());
useTaxStore().getCountryList();

const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const selectedCountry = ref(new CountryDto())
const route = useRoute();
const commandModel = ref(new UpdateEmployeeAddressCommand())
const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const updateEmployeeAddressForm = ref(null as any);
const addEmployeeAddress = () => {
    updateEmployeeAddressForm.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            const routeId = route.params.id.toString();
            if (selectedCountry.value.code)
                commandModel.value.countryCode = selectedCountry.value.code;
            useEmployeeCommandStore().updateEmployeeAddress(routeId, commandModel.value).then((response: any) => {
                props.dialogClose();
                employeeDetail.value.city = commandModel.value.city
                employeeDetail.value.country = { code: selectedCountry.value.code, name: selectedCountry.value.name }
                employeeDetail.value.street = commandModel.value.street
            }).catch((error) => {
                return catchError(error, () => addEmployeeAddress())
            }).finally(() => {
                buttons.value[1].loading = false;
            });
        }
    });
}

onMounted(() => {
    commandModel.value.city = employeeDetail.value.city ?? ''
    commandModel.value.countryCode = employeeDetail.value.country?.code ?? ''
    commandModel.value.street = employeeDetail.value.street ?? ''
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: addEmployeeAddress,
        loading: false
    }
])
</script>