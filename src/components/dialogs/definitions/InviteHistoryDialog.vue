<template>
    <DialogContent title="general.invitationHistory" :dialogClose="dialogClose" titleIcon="mdi-plus" :buttons="buttons">
        <template v-slot:dialogBody>
            <!-- <v-row class="d-flex align-center">
                <v-col cols="6" sm="8" md="4">
                    <SearchInput @update:model-value="searchFunc" />
                </v-col>
            </v-row> -->
            <v-row class="d-flex align-center" v-if="userInviteHistory.length > 0">
                <v-col class="pt-2" cols="12" v-for="(item, index) in userInviteHistory" :key="index">
                    <v-card>
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-row>
                                        <v-col cols="12">
                                            <p>
                                                <span class="font-weight-bold text-body-2">{{ $t('form.email') }}:
                                                </span>
                                                <span class="text-body-1">{{ item.email }} </span>
                                            </p>
                                            <p>
                                                <span class="font-weight-bold text-body-2">{{ $t('list.createdBy') }}:
                                                </span>
                                                <span class="text-body-1">{{ item.createdByName }}</span>
                                            </p>
                                            <p>
                                                <span class="font-weight-bold text-body-2">{{ $t('form.createdAt')
                                                    }}: </span>
                                                <span class="text-body-1">{{ formatterDate(item.createdAt) }}</span>
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="auto">
                                    <v-chip :color="getChipColor(item.invitationStatus)">
                                        {{
                                            enumToArray(InviteHistoryStatusEnum).find((x: any) => x.value ==
                                                item.invitationStatus)?.title
                                        }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col class="text-h6">
                    <NoDataCard />
                </v-col>
            </v-row>
        </template>
    </DialogContent>
</template>

<script setup lang="ts">
import DialogContent from '@/components/dialogs/DialogContent.vue';
import NoDataCard from '@/components/list/cards/NoDataCard.vue';
import { enumToArray } from '@/core/helpers/enumToArray';
import { formatterDate } from '@/core/helpers/dateUtils';
import { InviteHistoryStatusEnum } from '@/models/custom/EnumTypes';
import { useUserStore } from '@/stores/userStores/userStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const loading = ref(false);
const { userInviteHistory } = storeToRefs(useUserStore());

const getChipColor = (status: Number) => {
    if (InviteHistoryStatusEnum.Pending == status)
        return 'warning'
    else if (InviteHistoryStatusEnum.Canceled == status)
        return 'error'
    else if (InviteHistoryStatusEnum.Accepted == status)
        return 'success'
    else
        return 'red'
}

const props = defineProps({
    dialogClose: {
        type: null as any,
        required: true
    },
    selectedItem: {
        type: null as any,
        required: true
    },
});


const buttons = ref([
    {
        type: 'close',
        click: () => props.dialogClose(),
        loading: false
    }
])

useUserStore().getInviteUserHistory(props.selectedItem.id);

</script>