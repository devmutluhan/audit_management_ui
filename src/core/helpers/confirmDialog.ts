import { ConfirmModalType } from "@/models/types";

export let confirmDialogValue = false;
export let confirmModel = new ConfirmModalType();
export let buttonLoading = false;
export let actionMethod = (data: any) => { };

export const setConfirmModel = (confirmModalValue: ConfirmModalType) => {
    confirmModel = {
        cancelButtonText: confirmModalValue.cancelButtonText,
        confirmButtonText: confirmModalValue.confirmButtonText,
        icon: confirmModalValue.icon,
        title: confirmModalValue.title,
        text: confirmModalValue.text,
        descriptionField: confirmModalValue.descriptionField,
    }
    // setConfirmDialogValue(true);
}

export const setConfirmDialogValue = (value: boolean) => {
    confirmDialogValue = value;
}

export const setButtonLoading = (value: boolean) => {
    buttonLoading = value;
}

export const setConfirmDialogAction = (action: (data: any) => void) => {
    actionMethod = action;
}

export let confirmDialogData = {} as any

export const setConfirmData = (data: any) => {
    confirmDialogData = data;
}