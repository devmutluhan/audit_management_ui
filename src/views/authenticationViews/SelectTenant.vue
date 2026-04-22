<template>
    <v-card class="fill-height">
        <v-card-text>
            <v-row>
                <v-col>
                    <SingleAutocompleteInput v-model="loginCommand.tenantId" :items="preLoginResponse.tenants"
                        item-title="name" item-value="id" label="login.selectTenant" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn @click="store.login(loginCommand)" color="primary" block>{{ $t('login.signIn') }}</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import SingleAutocompleteInput from "@/components/formInput/generalInputs/SingleAutocompleteInput.vue";
import type { SignInCommand } from "@/models/entities/user/UserCommands";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useAuthStore();
const loginCommand = ref({} as SignInCommand);
const { preLoginResponse } = storeToRefs(store);

onMounted(() => {
    if (preLoginResponse.value.tenants.length === 0) {
        router.replace({ name: "sign-in" });
    }
});

</script>