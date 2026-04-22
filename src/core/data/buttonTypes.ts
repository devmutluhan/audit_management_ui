export interface ButtonConfig {
    name: string;
    color: string;
    variant: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
    prependIcon?: string; // İkon desteği eklendi
    loading: boolean;     // Küçük harf düzeltildi
    disabled: boolean;
}

const buttonTypes: Record<string, ButtonConfig> = {
    approve: {
        name: 'general.approve',
        color: 'approveButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-check-circle-outline',
        loading: false,
        disabled: false
    },
    sendApprove: {
        name: 'general.sendForApproval',
        color: 'approveButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-send-check-outline',
        loading: false,
        disabled: false
    },
    reject: {
        name: 'general.reject',
        color: 'rejectButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-close-circle-outline',
        loading: false,
        disabled: false
    },
    close: {
        name: 'general.close',
        color: 'cancelButtonColor',
        variant: 'tonal',
        prependIcon: 'mdi-close',
        loading: false,
        disabled: false
    },
    cancel: {
        name: 'general.toCancel',
        color: 'rejectButtonColor',
        variant: 'text',
        prependIcon: 'mdi-cancel',
        loading: false,
        disabled: false
    },
    save: {
        name: 'general.save',
        color: 'confirmButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-content-save-outline',
        loading: false,
        disabled: false
    },
    delete: {
        name: 'general.delete',
        color: 'deleteButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-delete-outline',
        loading: false,
        disabled: false
    },
    edit: {
        name: 'general.edit',
        color: 'editButtonColor',
        variant: 'tonal',
        prependIcon: 'mdi-pencil-outline',
        loading: false,
        disabled: false
    },
    sendBack: {
        name: 'general.sendBack',
        color: 'buttonChipColor',
        variant: 'tonal',
        prependIcon: 'mdi-undo-variant',
        loading: false,
        disabled: false
    },
    next: {
        name: 'general.next',
        color: 'confirmButtonColor',
        variant: 'flat',
        prependIcon: 'mdi-arrow-right',
        loading: false,
        disabled: false
    },
    back: {
        name: 'general.back',
        color: 'cancelButtonColor',
        variant: 'text',
        prependIcon: 'mdi-arrow-left',
        loading: false,
        disabled: false
    },
}

export default buttonTypes;