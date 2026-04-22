<template>
    <v-col class="fill-height">
        <v-row class="d-flex align-center mt-6">
            <v-col cols="auto">
                <v-tabs v-model="selectedPage" align-tabs="start" color="white" bg-color="tabsBackground" show-arrows
                    class="rounded-lg">
                    <v-tab v-for="item in props.pages" :key="item.route" class="text-body-1" :value="item" :to="item.to"
                        selected-class="bg-selectedTab">
                        {{ $t('menu.' + item.name) }}
                    </v-tab>
                </v-tabs>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" v-if="selectedPage.createComponent">
                <VDialogContent>
                    <template v-slot:activator="{ props: activatorProps }">
                        <PageTitleCreateButton :title="selectedPage.createButton" v-bind="activatorProps">
                        </PageTitleCreateButton>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <component :employeeId="route.params.id" :is="selectedPage.createComponent"
                            :dialogClose="() => { isActive.value = false }"
                            @createdItem="emit('createdItem', $event)" />
                    </template>
                </VDialogContent>
            </v-col>
        </v-row>
        <v-row style="height: 50vh;">
            <v-col class="fill-height">
                <RouterView />
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">

import { ref, type PropType } from 'vue';
import { useRoute } from 'vue-router';
import VDialogContent from '../dialogs/VDialogContent.vue';
import PageTitleCreateButton from '../formInput/generalInputs/PageTitleCreateButton.vue';

const emit = defineEmits(['createdItem']);
const route = useRoute()
const props = defineProps({
    pages: {
        type: Array as PropType<any>,
        default: [],
        required: true
    },
});

const selectedPage = ref({} as any)

</script>