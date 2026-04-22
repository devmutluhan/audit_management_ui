import { ResponseResultModel } from "@/core/helpers/errorStatusResult";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainStore = defineStore("main", () => {
    const responseResultPage = ref(false)
    const responseResultModel = ref(new ResponseResultModel())

    const setResponseResultModel = (newModel: any) => {
        responseResultModel.value = newModel
    }

    const setResponseResultSheet = (value: boolean) => {
        responseResultPage.value = value
    }

    return {
        responseResultPage,
        responseResultModel,
        setResponseResultModel,
        setResponseResultSheet,
    };
});
