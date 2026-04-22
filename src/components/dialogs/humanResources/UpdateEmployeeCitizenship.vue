<template>
    <DialogContent title="general.updateCitizenship" :buttons="buttons" :dialogClose="dialogClose"
        titleIcon="mdi-pencil">
        <template v-slot:dialogBody>
            <v-form ref="updateCitizenshipFormRef">
                <v-row class="d-flex align-center">
                    <v-col cols="12" md="6">
                        <DateInput label="list.birthDate" v-model="commandModel.birthDate" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.gender" v-model="commandModel.gender"
                            :items="enumToArray(GenderEnum)" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <SingleAutocompleteInput label="list.degreeOfDisability" :items="enumToArray(LevelOfDisability)"
                            v-model="commandModel.levelOfDisability" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <CountrySelectSingle label="list.nationality" @selectValue="selectCountry = $event"
                            :selectItem="commandModel.nationality" :items="countryList" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <TextField label="list.identityNumber" v-model="commandModel.identityNumber" />
                    </v-col>
                    <v-col cols="12" md="6" v-if="commandModel.gender != GenderEnum.Female">
                        <SingleAutocompleteInput label="list.militaryStatus" v-model="commandModel.militaryStatus"
                            :items="enumToArray(MilitaryServiceStatus)" item-title="title" item-value="value" />
                    </v-col>
                    <v-col cols="12" md="6"
                        v-if="commandModel.gender != GenderEnum.Female && commandModel.militaryStatus == MilitaryServiceStatus.Delayed">
                        <DateInput label="list.delayDate" v-model="commandModel.delayDate" />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import TextField from '@/components/formInput/generalInputs/TextField.vue';
import SingleAutocompleteInput from '@/components/formInput/generalInputs/SingleAutocompleteInput.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { GenderEnum, LevelOfDisability, MilitaryServiceStatus } from '@/models/custom/EnumTypes';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import DateInput from '@/components/formInput/generalInputs/DateInput.vue';
import { UpdateCitizenshipDetailCommand } from '@/models/entities/humanResource/EmployeeCommands';
import { storeToRefs } from 'pinia';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import CountrySelectSingle from '@/components/formInput/readyInput/CountrySelectSingle.vue';
import { CountryDto } from '@/models/entities/general/GeneralDtos';
import { catchError } from '@/core/helpers/generalResponse';
import { useRoute } from 'vue-router';
import { useTaxStore } from '@/stores/generalStores/taxStore';

const { countryList } = storeToRefs(useTaxStore());
useTaxStore().getCountryList();

const selectCountry = ref(new CountryDto())
const route = useRoute()
const commandModel = ref(new UpdateCitizenshipDetailCommand())
const { employeeDetail } = storeToRefs(useEmployeeDtoStore());

const emit = defineEmits(['createItem']);
const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});

const updateCitizenshipFormRef = ref(null as any);

const updateCitizenship = () => {
    updateCitizenshipFormRef.value.validate().then((res: any) => {
        if (res.valid) {
            buttons.value[1].loading = true;
            if (commandModel.value.gender == GenderEnum.Female) {
                commandModel.value.militaryStatus = null;
                commandModel.value.delayDate = '';
            }

            if (commandModel.value.militaryStatus != MilitaryServiceStatus.Delayed) {
                commandModel.value.delayDate = '';
            }

            if (selectCountry.value.code)
                commandModel.value.nationality = selectCountry.value.code

            useEmployeeCommandStore().updateEmployeeCitizenshipDetail(route.params.id.toString(), commandModel.value).then((res: any) => {
                employeeDetail.value.birthDate = commandModel.value.birthDate
                employeeDetail.value.gender = commandModel.value.gender
                employeeDetail.value.militaryDelayDate = commandModel.value.delayDate
                employeeDetail.value.identityNumber = commandModel.value.identityNumber
                employeeDetail.value.levelOfDisability = commandModel.value.levelOfDisability
                employeeDetail.value.militaryStatus = commandModel.value.militaryStatus;
                employeeDetail.value.militaryDelayDate = commandModel.value.delayDate;

                if (selectCountry.value?.code)
                    employeeDetail.value.nationality = { code: selectCountry.value.code ?? '', name: selectCountry.value.name ?? '' };
                props.dialogClose();
            }).catch((error) => {
                return catchError(error, () => updateCitizenship())
            }).finally(() => {
                buttons.value[1].loading = false;
            })
        }
    });
}

onMounted(() => {
    commandModel.value.birthDate = employeeDetail.value.birthDate || ''
    commandModel.value.gender = employeeDetail.value.gender
    commandModel.value.delayDate = employeeDetail.value.militaryDelayDate || ''
    commandModel.value.identityNumber = employeeDetail.value.identityNumber
    commandModel.value.levelOfDisability = employeeDetail.value.levelOfDisability
    commandModel.value.militaryStatus = employeeDetail.value.militaryStatus ?? null
    commandModel.value.nationality = employeeDetail.value.nationality?.code ?? ''
})

const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose()
    },
    {
        type: 'save',
        click: () => updateCitizenship(),
        loading: false
    }
])
</script>