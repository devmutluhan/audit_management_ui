<template>
    <DialogContent title="general.specialDeduction" :dialogClose="dialogClose" titleIcon="mdi-cash">
        <template v-slot:dialogBody>
            <v-row class="d-flex align-center justify-center">
                <v-col cols="10">
                    <v-row>
                        <v-col cols="auto pr-0 pr-md-4 hidden-xs">
                            <ImageCard :firstValue="'B'" :secondValue="'S'" :avatar-text="commandModel.avatar"
                                fontSize="20px" />
                        </v-col>
                        <v-col cols="12" sm="9">
                            <v-row class="d-flex justify-center">
                                <v-col cols="12">
                                    <v-card color="cardToolbar">
                                        <v-card-text class="text-h5">
                                            İsim Soyisim için ölüm yardımı.
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                                <v-col cols="auto" class="pt-0">
                                    <v-card color="cardToolbar" rounded="xl">
                                        <v-card-text class="d-flex align-center">
                                            Tek Seferde 1,000.00 TL
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="px-0">
                            <v-card :border="false" color="cardToolbar" class="pa-5">
                                <v-card-text>
                                    <v-row class="d-flex align-center">
                                        <v-col>
                                            Yardım Yapılan Kişi
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col cols="auto">
                                            İsim Soyisim
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row v-for="(item, index) in spendingDetail" :key="index">
                        <v-col class="py-0">
                            {{ $t(item.title) }}
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right py-0">
                            {{ item.value }}
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogContent from '@/components/dialogs/DialogContent.vue';
import ImageCard from "@/components/cards/ImageCard.vue";
const commandModel = ref({} as any)

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    }
});


const spendingDetail = ref([
    {
        title: 'form.feeType',
        value: 'Brüt'
    },
    {
        title: 'form.paymentMethod',
        value: 'Ayni yardım'
    },
    {
        title: 'list.paymentPeriod',
        value: 'Tek seferde'
    },
    {
        title: 'form.effectiveOn',
        value: '01.01.2021'
    },
    {
        title: 'form.totalAmount',
        value: '1,000.00 TL'
    },
    {
        title: 'list.payroll',
        value: 'Dahil'
    },
])

</script>