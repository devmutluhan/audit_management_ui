<template>
    <v-card :border="false" class="fill-height">
        <v-card-text class="fill-height">
            <PageTitleTeleport>
                <template v-slot:component>
                    <VDialogContent v-model="dialog">
                        <template v-slot:activator="{ props }">
                            <PageTitleCreateButton v-if="hasCompanySettings" title="general.createHoliday"
                                v-bind="props">
                            </PageTitleCreateButton>
                        </template>
                        <AddPublicHoliday :dialogClose="() => { dialog = false }" />
                    </VDialogContent>
                </template>
            </PageTitleTeleport>
            <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="6" sm="3" md="2">
                    <v-select v-model="selectedYear" justId :label="$t('enums.Year')" :items="yearList"
                        itemTitle="title" item-value="value" density="comfortable" />
                </v-col>
            </v-row>
            <v-row class="fill-height">
                <v-col cols="12">
                    <Datatable :data="initTableData" :header="tableHeader" :enable-items-per-page-dropdown="true"
                        :loading="loading" :itemsPerPage="20" :itemsPerPageDropdownEnabled="false">
                        <template v-slot:actions="{ row: data }">
                            <GeneralDropdown :data="data" :menuItems="menuItems" />
                        </template>
                    </Datatable>
                </v-col>
            </v-row>
            <VDialogContent v-model="updateDialog">
                <AddPublicHoliday :dialogClose="() => { updateDialog = false }" :selectedItem="updateItem" />
            </VDialogContent>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import GeneralDropdown from "@/components/dropdown/GeneralDropdown.vue";
import { enumToArray } from "@/core/helpers/enumToArray";
import { storeToRefs } from "pinia"
import type { GeneralDropdownType } from "@/models/types";
import { catchError } from "@/core/helpers/generalResponse";
import SearchInput from '@/components/formInput/readyInput/SearchInput.vue';
import { useHolidayCalenderStore } from "@/stores/humanResourcesStores/holidayCalenderStore";
import { formatterDateFromHours } from "@/core/helpers/dateUtils";
import { clientFilter } from "@/core/helpers/generalUtils";
import { PublicHolidayDto } from "@/models/entities/humanResource/PublicHolidayModels";
import { HolidayTypeEnum } from "@/models/custom/EnumTypes";
import i18n from "@/core/plugins/i18n";
import AddPublicHoliday from "@/components/dialogs/humanResources/AddPublicHoliday.vue";
import VDialogContent from "@/components/dialogs/VDialogContent.vue";
import { hasClaimOrModules } from "@/core/helpers/localStorageManagement";
import PageTitleTeleport from "@/components/teleports/PageTitleTeleport.vue";
import PageTitleCreateButton from "@/components/formInput/generalInputs/PageTitleCreateButton.vue";

const t = i18n.global.t;

const { holidayList, loading } = storeToRefs(useHolidayCalenderStore())
const currentYear = new Date().getFullYear();

const yearList = ref(
    Array.from({ length: 21 }, (_, i) => {
        const year = currentYear - 10 + i;
        return { title: year.toString(), value: year.toString() };
    })
);
const selectedYear = ref(currentYear.toString())

useHolidayCalenderStore().getPublicHoliday({ year: selectedYear.value })

const hasCompanySettings = computed(() => {
    return hasClaimOrModules(['ManageCompanySettings'])
})

onMounted(() => {
    if (!hasCompanySettings.value) {
        tableHeader.value = tableHeader.value.filter((a) => a.columnLabel != 'actions')
    }
})

const tableHeader = ref([
    {
        columnName: "form.startDate",
        columnLabel: "startDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: any) => {
            return value.startDate ? formatterDateFromHours(value.startDate) : '-'
        },
    },
    {
        columnName: "form.endDate",
        columnLabel: "endDate",
        columnWidth: 175,
        filterEnabled: false,
        valueFormatter: (value: any) => {
            return value.endDate ? formatterDateFromHours(value.endDate) : '-'
        },
    },
    {
        columnName: 'general.title',
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'list.description',
        columnLabel: "description",
        sortEnabled: true,
        columnWidth: 175,
    },
    {
        columnName: 'form.holidayType',
        columnLabel: "holidayType",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: PublicHolidayDto) => {
            return enumToArray(HolidayTypeEnum).find(x => x.value === value.holidayType)?.title;
        }
    },
    {
        columnName: 'form.isDeduct',
        columnLabel: "isDeduct",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: PublicHolidayDto) => {
            return value.isDeduct ? t('general.yes') : t('general.no')
        }
    },
    {
        columnName: 'form.isRecurring',
        columnLabel: "isRecurring",
        sortEnabled: true,
        columnWidth: 175,
        valueFormatter: (value: PublicHolidayDto) => {
            return value.isRecurring ? t('general.yes') : t('general.no')
        }
    },
    {
        columnName: 'general.actions',
        columnLabel: "actions",
        columnWidth: 135,
    }
])

const updateDialog = ref(false);
const dialog = ref(false);
const updateItem = ref(new PublicHolidayDto());

const deleteFunc = (data: any) => {
    menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = true : '';
    useHolidayCalenderStore().deletePublicHoliday(holidayList.value.id, data.id).then(() => {
        const index = holidayList.value.publicHolidays.findIndex(x => x.id == data.id);
        if (index != -1) {
            holidayList.value.publicHolidays.splice(index, 1)
        }
    }).catch((error) => {
        return catchError(error, () => deleteFunc(data));
    }).finally(() => {
        menuItems.value[1].confirmModalValue ? menuItems.value[1].confirmModalValue.buttonLoading = false : '';
    });
}

const initTableData = ref(new Array<PublicHolidayDto>());

watch(() => holidayList.value, () => {
    if (holidayList.value.publicHolidays) {
        initTableData.value = holidayList.value.publicHolidays
    }
});

watch(() => selectedYear.value, () => {
    useHolidayCalenderStore().getPublicHoliday({ year: selectedYear.value })
});


const searchFunc = (searchName: string) => {
    if (searchName !== undefined) {
        initTableData.value = clientFilter(holidayList.value.publicHolidays, 'name', searchName);
    } else {
        initTableData.value = holidayList.value.publicHolidays
    }
}

const menuItems = ref<GeneralDropdownType[]>([
    {
        title: "general.update",
        action: (item: any) => {
            updateDialog.value = true;
            updateItem.value = item;
        }
    },
    {
        title: "general.delete",
        confirmModalValue: {
            text: "general.deleteDescription",
            buttonLoading: false,
            action: deleteFunc,
        },
    },
]);

</script>