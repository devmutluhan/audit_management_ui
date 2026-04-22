<template>
    <v-card>
        <v-card-text>
            <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-briefcase-account" class="mr-2" color="secondary"></v-icon>
                {{ t('form.costAnalysisForPosition') }}
            </v-card-title>

            <v-card-subtitle>
                {{ t('form.costAnalysisForPositionDesc') }}
            </v-card-subtitle>

            <div v-if="groupedList && groupedList.length > 0">
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
import { formatterPriceForCurrencyName } from "@/core/helpers/generalUtils";
import i18n from "@/core/plugins/i18n";
import type { ProjectCostSummaryDto } from "@/models/entities/crm/CrmProjectDtos";
import { computed } from "vue";
import { themeMode } from '@/layouts/default-layout/config/helper';

const t = i18n.global.t
const props = defineProps({
    projectCostList: {
        type: Array<ProjectCostSummaryDto>,
        required: true
    }
});

// --- DATA AGGREGATION (Veri Gruplama) ---
const groupedList = computed(() => {
    // Currency bilgisini de tutacak şekilde map yapısını güncelledik
    const map = new Map<string, { name: string, cost: number, sell: number, currency: string }>();

    props.projectCostList.forEach(item => {
        const posName = item.position?.name || t('general.notFound');

        if (!map.has(posName)) {
            map.set(posName, {
                name: posName,
                cost: 0,
                sell: 0,
                currency: item.currency // İlk gelenin para birimini baz alıyoruz
            });
        }

        const entry = map.get(posName)!;
        // NOT: Farklı para birimleri (USD ve EUR) aynı pozisyonda toplanıyorsa 
        // burada matematiksel bir hata payı olabilir. Backend'de dönüştürme yapılması önerilir.
        entry.cost += item.costAmount;
        entry.sell += item.sellAmount;
    });

    return Array.from(map.values());
});

// --- CHART CONFIGURATION ---

const chartSeries = computed(() => {
    return [
        {
            name: t('list.cost'), // Maliyet (Kırmızı)
            data: groupedList.value.map(item => item.cost)
        },
        {
            name: t('list.sell'), // Satış (Mavi)
            data: groupedList.value.map(item => item.sell)
        },
        {
            name: t('list.profit') || 'Kâr', // Net Kâr (Yeşil)
            data: groupedList.value.map(item => item.sell - item.cost)
        }
    ];
});

const chartOptions = computed(() => {
    // Tema Ayarları
    const isDark = themeMode.value === 'dark';
    const textColor = isDark ? '#e1e3ea' : '#3f4254';
    const gridColor = isDark ? '#2b2b40' : '#e4e6ef';

    const categories = groupedList.value.map(item => item.name);

    return {
        chart: {
            type: 'bar',
            height: 350,
            foreColor: textColor, // Global yazı rengi
            toolbar: { show: true }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '65%',
                borderRadius: 4
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4,
        },
        xaxis: {
            categories: categories,
            title: {
                text: t('list.positions'),
                style: { color: textColor }
            },
            labels: {
                style: { colors: textColor }
            }
        },
        yaxis: {
            title: {
                text: t('list.amount'),
                style: { color: textColor }
            },
            labels: {
                style: { colors: textColor },

            }
        },
        fill: { opacity: 1 },
        colors: ['#FF4560', '#008FFB', '#00E396'], // Kırmızı, Mavi, Yeşil

        legend: {
            position: 'top',
            labels: { colors: textColor }
        },

        // --- CUSTOM TOOLTIP ---
        tooltip: {
            theme: isDark ? 'dark' : 'light',
            cssClass: isDark ? 'apexcharts-tooltip-dark' : '',
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                // Gruplanmış listeden ilgili satırı al
                const data = groupedList.value[dataPointIndex];

                const costVal = series[0][dataPointIndex];
                const sellVal = series[1][dataPointIndex];
                const profitVal = series[2][dataPointIndex];

                const profitColor = profitVal >= 0 ? '#00E396' : '#FF4560';

                // Tema renkleri
                const bgColor = isDark ? '#1e1e2d' : '#ffffff';
                const contentColor = isDark ? '#ffffff' : '#333333';
                const borderColor = isDark ? '#323248' : '#e0e0e0';
                const secondaryTextColor = isDark ? '#b5b5c3' : '#555';

                // Pozisyonlar için Avatar yerine İkon/Baş harf placeholder
                const avatarDisplay = `<div class="tooltip-avatar-placeholder" style="background-color: #9C27B0;">${data.name.charAt(0).toUpperCase()}</div>`;

                return `
                    <div class="custom-apex-tooltip" style="background-color: ${bgColor}; color: ${contentColor}; border-color: ${borderColor}">
                        <div class="tooltip-header" style="border-bottom-color: ${borderColor}">
                            ${avatarDisplay}
                            <div class="tooltip-info">
                                <span class="tooltip-name" style="color: ${contentColor}">${data.name}</span>
                            </div>
                        </div>
                        <div class="tooltip-body">
                            <div class="tooltip-row cost">
                                <span style="color: ${secondaryTextColor}">${t('list.cost')}:</span>
                                <strong>${formatterPriceForCurrencyName(costVal, data.currency)}</strong>
                            </div>
                            <div class="tooltip-row sell">
                                <span style="color: ${secondaryTextColor}">${t('list.sell')}:</span>
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
/* NOT: .custom-apex-tooltip stilleri "ProjectCostSummaryForEmployeeCard.vue" dosyasında 
veya global CSS dosyanızda zaten tanımlıysa burayı silebilirsiniz. 
Eğer yoksa, yukarıdaki dosyadaki stil bloğunun aynısını buraya yapıştırın.
*/
</style>