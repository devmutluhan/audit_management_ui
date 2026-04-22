<template>
    <!--begin::Stepper-->
    <div class="stepper stepper-links d-flex flex-column" id="kt_create_account_stepper" ref="createAccountStepperRef">
        <!--begin::Nav-->
        <div class="stepper-nav">
            <div class="stepper-item" @click="isClicked ? $emit('activeStepValue', step.id) : ''"
                :style="isClicked ? 'cursor: pointer' : ''"
                :class="activeStep == step.id ? 'current' : activeStep > step.id ? 'completed' : ''"
                data-kt-stepper-element="nav" v-for="(step, index) in steps" :key="index">
                <h3 class="stepper-title"
                    :class="isErrorValidate === true && activeStep == step.id ? 'text-error' : ''"> {{
                        step.title
                    }} </h3>
            </div>
        </div>
        <!--end::Nav-->
    </div>
    <!--end::Stepper-->
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<Props>();
interface Props {
    closeHadler?: () => void;
    steps: Array<{ id: number, title: string; component: any }>;
    activeStep: number;
    isClicked?: boolean;
    isErrorValidate?: boolean;
}

const createAccountStepperRef = ref<HTMLElement | null>(null);

</script>