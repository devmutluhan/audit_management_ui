<template>
    <v-card>
        <v-card-text>
            <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-account-cash" class="mr-2" color="primary"></v-icon>
                {{ t('form.costAnalysisForEmployee') }}
            </v-card-title>

            <v-card-subtitle>
                {{ t('form.costAnalysisForEmployeeDesc') }}
            </v-card-subtitle>

            <div v-if="projectCostList && projectCostList.length > 0">
                <apexchart class="custom-tooltip-chart" type="bar" height="350" :options="chartOptions"
                    :series="chartSeries">
                </apexchart>
            </div>
            <div v-else class="text-center pa-5 text-grey">
                {{ t('form.noDataCostAnalysis') }}
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import i18n from "@/core/plugins/i18n";
import type { ProjectCostSummaryDto } from "@/models/entities/crm/CrmProjectDtos";
import { computed } from "vue";
import { themeMode } from '@/layouts/default-layout/config/helper';
import { formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";

const t = i18n.global.t;
const props = defineProps({
    projectCostList: {
        type: Array<ProjectCostSummaryDto>,
        required: true
    }
});

// --- CHART CONFIGURATION ---

const chartSeries = computed(() => {
    return [
        {
            name: t('list.cost'), // Maliyet
            data: props.projectCostList.map(item => item.costAmount)
        },
        {
            name: t('list.sell'), // Satış
            data: props.projectCostList.map(item => item.sellAmount)
        },
        {
            name: t('list.profit'), // 'Kâr',
            data: props.projectCostList.map(item => item.sellAmount - item.costAmount)
        }
    ];
});

const chartOptions = computed(() => {
    // Tema kontrolü: Dark ise açık renk yazı (#f5f8fa), Light ise koyu yazı (#3f4254)
    const isDark = themeMode.value === 'dark';
    const textColor = isDark ? '#e1e3ea' : '#3f4254';
    const gridColor = isDark ? '#2b2b40' : '#e4e6ef';

    // İsimleri Birleştiriyoruz (ScreenShot'taki "undefined" hatasını önlemek için kontrol)
    const categories = props.projectCostList.map(item => {
        if (item.employee && (item.employee.firstName || item.employee.lastName)) {
            return `${item.employee.firstName || ''} ${item.employee.lastName || ''}`.trim();
        }
        return t('general.notFound');
    });

    return {
        chart: {
            type: 'bar',
            height: 350,
            foreColor: textColor,
            toolbar: { show: true }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '65%',
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        grid: {
            borderColor: gridColor, // Izgara çizgilerinin rengi de temaya uysun
            strokeDashArray: 4,
        },
        xaxis: {
            categories: categories,
            title: {
                text: t('list.employees'),
                style: { color: textColor }
            },
            labels: {
                style: { colors: textColor }
            }
        },
        yaxis: {
            title: {
                text: `${t('list.amount')}`,
                style: { color: textColor }
            },
            labels: {
                style: { colors: textColor }
            }
        },
        fill: { opacity: 1 },
        colors: ['#FF4560', '#008FFB', '#00E396'],
        legend: {
            position: 'top',
            labels: { colors: textColor }
        },

        // --- CUSTOM TOOLTIP ---
        tooltip: {
            theme: isDark ? 'dark' : 'light', // ApexCharts'ın kendi tooltip teması
            cssClass: isDark ? 'apexcharts-tooltip-dark' : '', // Gerekirse ekstra class
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                const data = props.projectCostList[dataPointIndex];
                const emp = data.employee;

                const costVal = series[0][dataPointIndex];
                const sellVal = series[1][dataPointIndex];
                const profitVal = series[2][dataPointIndex];

                const avatarDisplay = emp?.avatarUrl
                    ? `<img src="${emp.avatarUrl}" class="tooltip-avatar" />`
                    : `<div class="tooltip-avatar-placeholder">${emp?.firstName?.charAt(0) || '?'}${emp?.lastName?.charAt(0) || '?'}</div>`;

                const profitColor = profitVal >= 0 ? '#00E396' : '#FF4560';

                // Tooltip Arka Plan Rengi Ayarı
                const bgColor = isDark ? '#1e1e2d' : '#ffffff';
                const contentColor = isDark ? '#ffffff' : '#333333';
                const borderColor = isDark ? '#323248' : '#e0e0e0';

                return `
                    <div class="custom-apex-tooltip" style="background-color: ${bgColor}; color: ${contentColor}; border-color: ${borderColor}">
                        <div class="tooltip-header" style="border-bottom-color: ${borderColor}">
                            ${avatarDisplay}
                            <div class="tooltip-info">
                                <span class="tooltip-name" style="color: ${contentColor}">${emp?.firstName || ''} ${emp?.lastName || ''}</span>
                                <span class="tooltip-position" style="color: ${isDark ? '#92929f' : '#777'}">${emp?.positionName || '-'}</span>
                            </div>
                        </div>
                        <div class="tooltip-body">
                            <div class="tooltip-row cost">
                                <span style="color: ${isDark ? '#b5b5c3' : '#555'}">${t('list.cost')}:</span>
                                <strong>${formatterPriceForCurrencyName(costVal, data.currency)}</strong>
                            </div>
                            <div class="tooltip-row sell">
                                <span style="color: ${isDark ? '#b5b5c3' : '#555'}">${t('list.sell')}:</span>
                                <strong>${formatterPriceForCurrencyName(sellVal, data.currency)}</strong>
                            </div>
                            <div class="tooltip-row profit" style="border-top: 1px dashed ${borderColor}; margin-top:4px; padding-top:4px;">
                                <span style="color: ${contentColor}">${t('list.profit') || 'Net Kâr'}:</span>
                                <strong style="color: ${profitColor}">${formatterPriceForCurrencyName(profitVal, data.currency)}</strong>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    };
});
</script>

<style>
/* Global Styles for Tooltip */
.custom-apex-tooltip {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    padding: 10px;
    font-family: 'Roboto', sans-serif;
    border: 1px solid #e0e0e0;
    min-width: 200px;
    z-index: 9999;
}

.tooltip-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

/* ... Diğer stiller aynı kalabilir, renkleri inline style ile override ettik ... */
.tooltip-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
    border: 2px solid #f5f5f5;
}

.tooltip-avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1976D2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    font-size: 14px;
}

.tooltip-info {
    display: flex;
    flex-direction: column;
}

.tooltip-name {
    font-weight: 600;
    font-size: 14px;
}

.tooltip-position {
    font-size: 11px;
}

.tooltip-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.tooltip-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.tooltip-row.cost strong {
    color: #FF4560;
}

.tooltip-row.sell strong {
    color: #008FFB;
}
</style>