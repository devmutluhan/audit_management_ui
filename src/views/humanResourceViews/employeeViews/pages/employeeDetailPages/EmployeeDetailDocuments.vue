<template>
    <v-card class="mt-4">
        <v-card-text v-if="!loading">
            <v-col cols="12" v-if="employeeDocuments.length > 0">
                <div v-for="(category, cIndex) in employeeDocuments" :key="cIndex">
                    <v-divider v-if="cIndex != 0"></v-divider>
                    <v-row class="d-flex align-center pb-2">
                        <v-col cols="auto">
                            <h2 class="text-h6 font-weight-bold mb-0">{{ category.categoryName }}
                            </h2>
                        </v-col>
                        <v-col cols="auto" class="d-flex align-center text-caption font-weight-bold text-rowTextColor">
                            <span class="mr-2">%{{ Math.round(getCategoryProgress(category)) + ' ' +
                                $t('enums.Tamamlandi') }} </span>
                            <v-progress-circular :model-value="getCategoryProgress(category)" color="primary" size="24"
                                width="3" bg-color="grey-lighten-2"></v-progress-circular>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                        <v-col v-for="(doc, dIndex) in category.documents" :key="doc.definitionId" cols="12" lg="6">
                            <v-card variant="outlined" class="rounded-lg h-100" :class="getBorderClass(doc)"
                                style="border-width: 1.5px;">
                                <div class="d-flex flex-column flex-sm-row align-start align-sm-center pa-4 h-100">

                                    <div class="d-flex align-center flex-grow-1 mb-3 mb-sm-0" style="min-width: 0;">
                                        <v-avatar :color="getStatusColor(doc)" variant="tonal" rounded="lg"
                                            class="mr-3 flex-shrink-0">
                                            <v-icon :icon="getStatusIcon(doc)"></v-icon>
                                        </v-avatar>

                                        <div style="min-width: 0;">
                                            <div class="text-subtitle-1 font-weight-bold text-rowTextColor text-truncate"
                                                :title="doc.documentName">
                                                {{ doc.documentName }}
                                            </div>
                                            <div class="d-flex align-center mt-1">
                                                <v-chip v-if="doc.isRequired" size="x-small" color="error"
                                                    variant="tonal" class="font-weight-bold mr-2" label>
                                                    {{ $t('form.required') }}
                                                </v-chip>
                                                <span v-if="doc.isUploaded"
                                                    class="text-caption text-success font-weight-medium">
                                                    {{ $t('form.uploaded') }}
                                                </span>
                                                <span v-else class="text-caption text-error font-weight-medium">
                                                    {{ $t('form.notUploaded') }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-flex flex-column justify-center px-sm-4 border-s-sm border-e-sm mx-sm-4 py-2 py-sm-0 w-100 w-sm-auto mb-3 mb-sm-0"
                                        v-if="doc.isUploaded">

                                        <div class="d-flex align-center text-caption text-grey-darken-2 mb-1">
                                            <v-icon icon="mdi-calendar-blank-outline" size="14" class="mr-1"></v-icon>
                                            <span>
                                                {{ doc.expirationDate ? formatterDate(doc.expirationDate) : 'Süresiz' }}
                                            </span>
                                        </div>

                                        <!-- <div v-if="doc.requestApproval" class="d-flex align-center text-caption">
                                            <v-icon :icon="getApprovalIcon(doc.requestApproval.status)"
                                                :color="getApprovalColor(doc.requestApproval.status)" size="14"
                                                class="mr-1"></v-icon>
                                            <span :class="`text-${getApprovalColor(doc.requestApproval.status)}`">
                                                {{ getApprovalText(doc.requestApproval.status) }}
                                            </span>
                                        </div> -->
                                    </div>

                                    <div
                                        class="d-flex align-center justify-end flex-shrink-0 w-100 w-sm-auto pt-2 pt-sm-0 border-t border-t-sm-0 border-dashed-sm">
                                        <VDialogContent v-if="!doc.isUploaded || doc.isExpired">
                                            <template v-slot:activator="{ props: activatorProps }">
                                                <v-btn v-bind="activatorProps" color="primary" variant="flat"
                                                    size="small" prepend-icon="mdi-upload"
                                                    class="text-none w-100 w-sm-auto">
                                                    {{ $t('form.upload') }}
                                                </v-btn>
                                            </template>

                                            <template v-slot:default="{ isActive }">
                                                <AddEmployeeDocumentDialog :document="doc"
                                                    @createItem="getEmployeeDocuments"
                                                    :dialogClose="() => { isActive.value = false }" />
                                            </template>
                                        </VDialogContent>

                                        <div v-else class="d-flex align-center gap-1">
                                            <v-tooltip :text="$t('list.view')" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-bind="props" icon="mdi-eye-outline" variant="text"
                                                        color="grey-darken-3" density="comfortable"
                                                        @click="previewFile(doc.fileUrl)"></v-btn>
                                                </template>
                                            </v-tooltip>

                                            <v-tooltip :text="$t('general.update')" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <VDialogContent>
                                                        <template v-slot:activator="{ props: activatorProps }">
                                                            <span v-bind="props">
                                                                <v-btn v-bind="activatorProps"
                                                                    icon="mdi-square-edit-outline" variant="text"
                                                                    color="primary" density="comfortable"></v-btn>
                                                            </span>
                                                        </template>

                                                        <template v-slot:default="{ isActive }">
                                                            <AddEmployeeDocumentDialog :document="doc"
                                                                @createItem="getEmployeeDocuments"
                                                                :dialogClose="() => { isActive.value = false }" />
                                                        </template>
                                                    </VDialogContent>
                                                </template>
                                            </v-tooltip>

                                            <v-tooltip :text="$t('general.delete')" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text"
                                                        color="error" density="comfortable"
                                                        @click="deleteDocument(doc.employeeDocumentId)"></v-btn>
                                                </template>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                <ConfirmDialog v-model="confirmDialog" :modal="confirmModalValue" />
            </v-col>
            <v-col cols="12" v-else>
                <v-alert type="info" class="font-weight-bold">
                    {{ $t('form.noDataDocumentDefinition') }}
                </v-alert>
            </v-col>
        </v-card-text>
        <v-card-text v-else>
            <Loading></Loading>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import AddEmployeeDocumentDialog from '@/components/dialogs/humanResources/AddEmployeeDocumentDialog.vue';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import VDialogContent from '@/components/dialogs/VDialogContent.vue';
import { ConfirmModalType } from '@/models/types';
import { formatterDate } from '@/core/helpers/dateUtils';
import type { DocumentsDto, EmployeeDocumentsDto } from '@/models/entities/humanResource/EmployeeDtos';
import { useEmployeeDtoStore } from '@/stores/humanResourcesStores/employeeDtoStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useEmployeeCommandStore } from '@/stores/humanResourcesStores/employeeCommandStore';
import { catchError } from '@/core/helpers/generalResponse';
import { getFileUrl } from '@/core/helpers/assets';
import Loading from '@/components/kt-datatable/table-partials/Loading.vue';

const route = useRoute()
const { employeeDocuments } = storeToRefs(useEmployeeDtoStore())

const confirmModalValue = ref(new ConfirmModalType());
const confirmDialog = ref(false);
const loading = ref(false)
const getEmployeeDocuments = () => {
    loading.value = true;
    useEmployeeDtoStore().getEmployeeDocuments(route.params.id.toString()).finally(() => {
        loading.value = false;
    })
}
getEmployeeDocuments();

const deleteDocument = (docId: string) => {
    confirmDialog.value = true;
    confirmModalValue.value = {
        text: "general.deleteDescription",
        buttonLoading: false,
        action: () => {
            confirmModalValue.value.buttonLoading = true
            useEmployeeCommandStore().deleteEmployeeDocument(route.params.id.toString(), docId).then(() => {
                confirmDialog.value = false;
                getEmployeeDocuments();
            }).catch((error) => {
                return catchError(error, () => { confirmModalValue.value.action })
            }).finally(() => {
                confirmModalValue.value.buttonLoading = false
            });
        }
    }
};

const getBorderClass = (doc: DocumentsDto) => {
    if (doc.isMissing && doc.isRequired) return 'border-error'; // Kırmızı Border
    if (doc.isExpired) return 'border-warning'; // Turuncu Border
    if (doc.isUploaded) return 'border-success-subtle'; // Yeşilimsi/Gri Border
    return 'border-grey';
};

const getStatusColor = (doc: DocumentsDto) => {
    if (doc.isMissing) return 'error';
    if (doc.isExpired) return 'warning';
    if (!doc.isUploaded) return 'warning'
    return 'success';
};

const getStatusIcon = (doc: DocumentsDto) => {
    if (doc.isMissing) return 'mdi-alert-circle';
    if (doc.isExpired) return 'mdi-clock-alert';
    return 'mdi-check-circle';
};


const getCategoryProgress = (category: EmployeeDocumentsDto) => {
    if (category.documents.length === 0) return 0;
    const completed = category.documents.filter(d => d.isUploaded && !d.isExpired).length;
    return (completed / category.documents.length) * 100;
};


const previewFile = (fileUrl?: string | null) => {
    if (fileUrl) {
        const url = getFileUrl(fileUrl);
        if (!url) {
            return;
        }

        window.open(url, '_blank');
    }
};


// Todo: Onay sürecine bağlanırsa kullanılacak.
// const getApprovalIcon = (status: number) => {
//     switch (status) {
//         case 0: return 'mdi-timer-sand';
//         case 1: return 'mdi-check-decagram';
//         case 2: return 'mdi-close-circle';
//         default: return 'mdi-minus';
//     }
// };
// const getApprovalText = (status: number) => {
//     switch (status) {
//         case 0: return 'Onay Bekliyor';
//         case 1: return 'Onaylandı';
//         case 2: return 'Reddedildi';
//         default: return '';
//     }
// };
// const getApprovalColor = (status: number) => {
//     switch (status) {
//         case 0: return 'warning';
//         case 1: return 'success';
//         case 2: return 'error';
//         default: return 'grey';
//     }
// };
</script>

<style scoped>
/* Özel Border Renkleri */
.border-error {
    border-color: rgb(var(--v-theme-error)) !important;
}

.border-warning {
    border-color: rgb(var(--v-theme-warning)) !important;
}

.border-success-subtle {
    border-color: rgba(var(--v-theme-success), 0.5) !important;
}

.border-grey {
    border-color: #e0e0e0 !important;
}

.gap-1 {
    gap: 4px;
}

/* Mobilde Border Davranışları */
.border-dashed-sm {
    /* Sadece mobilde border style dashed olabilir veya kaldırılabilir */
}
</style>