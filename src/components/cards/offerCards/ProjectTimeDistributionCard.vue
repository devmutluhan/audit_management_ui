<template>
    <v-card class="h-100">
        <v-card-text>
            <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-clock-time-four-outline" class="mr-2" color="warning"></v-icon>
                {{ t('list.effortDistribution') }}
            </v-card-title>

            <v-card-subtitle>
                {{ t('list.effortDistributionDesc') }}
            </v-card-subtitle>

            <div v-if="projectCostList && projectCostList.length > 0">
                <apexchart class="custom-tooltip-chart" type="donut" height="350" :options="chartOptions"
                    :series="chartSeries">
                </apexchart>
            </div>
            <div v-else class="text-center pa-5 text-grey">
                {{ t('list.noDataEffort') }}
            </div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import i18n from "@/core/plugins/i18n";
import type { ProjectCostSummaryDto } from "@/models/entities/crm/CrmProjectDtos";
import { computed } from "vue";
import { themeMode } from '@/layouts/default-layout/config/helper';

const t = i18n.global.t
const props = defineProps({
    projectCostList: {
        type: Array as () => ProjectCostSummaryDto[],
        required: true
    }
});

// 1. Grafik Serileri (Data)
const chartSeries = computed(() => {
    return props.projectCostList.map(item => item.durationInHours);
});

// 2. Grafik Ayarları (Options)
const chartOptions = computed(() => {
    // Tema Değişkenleri
    const isDark = themeMode.value === 'dark';
    const textColor = isDark ? '#e1e3ea' : '#3f4254';
    // Donut grafikte dilimler arası boşluk rengi (arkaplan rengiyle aynı olmalı)
    const strokeColor = isDark ? '#1e1e2d' : '#ffffff';

    // Etiketler: Ad + Soyad
    const labels = props.projectCostList.map(item => {
        if (item.employee) {
            return `${item.employee.firstName} ${item.employee.lastName}`;
        }
        return t('general.notFound');
    });

    return {
        chart: {
            type: 'donut',
            height: 350,
            foreColor: textColor, // Genel yazı rengi
        },
        labels: labels,
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            color: textColor // Ortadaki isim rengi
                        },
                        value: {
                            show: true,
                            color: textColor, // Ortadaki değer rengi
                            formatter: function (val: string) {
                                return val + ' ' + t('enums.Hour');
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: t('list.totalHour'),
                            color: textColor, // "Toplam Süre" yazısının rengi
                            formatter: function (w: any) {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return total + " " + t('enums.Hour');
                            }
                        }
                    }
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val.toFixed(1) + "%";
            },
            style: {
                colors: ['#fff'] // Dilim üzerindeki yazılar genelde beyaz kalır
            }
        },
        stroke: {
            show: true,
            // Dilimler arasındaki çizgi rengini temaya göre ayarlıyoruz
            colors: [strokeColor]
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            labels: {
                colors: textColor
            }
        },

        // --- CUSTOM TOOLTIP (AVATAR VE DETAYLAR) ---
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            cssClass: isDark ? 'apexcharts-tooltip-dark' : '',
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                const data = props.projectCostList[dataPointIndex];
                const emp = data.employee;
                const durationVal = series[dataPointIndex];

                // Tema Renkleri
                const bgColor = isDark ? '#1e1e2d' : '#ffffff';
                const contentColor = isDark ? '#ffffff' : '#333333';
                const borderColor = isDark ? '#323248' : '#e0e0e0';
                const secondaryTextColor = isDark ? '#b5b5c3' : '#555';

                const avatarDisplay = emp?.avatarUrl
                    ? `<img src="${emp.avatarUrl}" class="tooltip-avatar" />`
                    : `<div class="tooltip-avatar-placeholder warning-bg">${emp?.firstName?.charAt(0) || '?'}${emp?.lastName?.charAt(0) || '?'}</div>`;

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
                            <div class="tooltip-row">
                                <span style="color: ${secondaryTextColor}">${t('list.duration') || 'Süre'}:</span>
                                <strong>${durationVal} ${t('enums.Hour')}</strong>
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
/* Tooltip CSS'leri inline style ile override edildiği için buradaki renkler default (Light) kalabilir */
.custom-apex-tooltip {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    padding: 10px;
    font-family: 'Roboto', sans-serif;
    border: 1px solid #e0e0e0;
    min-width: 180px;
    z-index: 9999;
}

.tooltip-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

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
    background-color: #FB8C00;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    font-size: 14px;
}

.tooltip-avatar-placeholder.warning-bg {
    background-color: #FB8C00;
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
</style>