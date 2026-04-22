<template>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" persistent>
        <template v-slot:activator="{ props: activatorProps, isActive }">
            <v-btn v-if="!isActive" v-bind="activatorProps" variant="flat" color="red" icon="mdi-bug"
                style="z-index: 9999; right: 0px; bottom: 0px" />
        </template>

        <v-card color="white">
            <v-toolbar class="pt-8" dark color="primary">
                <v-btn icon @click="dialog = false" color="white">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Debugger</v-toolbar-title>
            </v-toolbar>

            <v-tabs v-model="tab" bg-color="grey-lighten-3">
                <v-tab value="network">Network</v-tab>
                <v-tab value="console">Console</v-tab>
            </v-tabs>

            <v-window v-model="tab" class="pa-4" style="height: 100%; overflow-y: auto;">
                <!-- CONSOLE -->
                <v-window-item value="console">
                    <v-card flat>
                        <v-card-text>
                            <div style="white-space: pre-line; font-family: monospace;">
                                <div v-for="(log, index) in logs" :key="index">{{ log }}</div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-window-item>

                <!-- NETWORK -->
                <v-window-item value="network">
                    <v-card flat>
                        <v-card-text>
                            <div v-if="networkLogs.length === 0">
                                Henüz bir ağ isteği yapılmadı.
                            </div>

                            <v-expansion-panels>
                                <v-expansion-panel v-for="(log, index) in networkLogs.slice()" :key="index">
                                    <template v-slot:title>
                                        <v-row>
                                            <v-col>
                                                <strong>{{ log.method }}</strong>
                                                | {{ log.url }}
                                                <br />
                                                <span class="text-grey">
                                                    {{ log.status }} | {{ log.time }}
                                                </span>
                                                <br />
                                                <span class="text-grey">
                                                    {{ log.startTimeEndTime }}
                                                </span>
                                            </v-col>
                                        </v-row>
                                    </template>

                                    <v-expansion-panel-text>
                                        <div style="white-space: pre-wrap;">
                                            <div><strong>Request Body:</strong></div>
                                            <div>{{ formatJson(log.requestBody) }}</div>

                                            <div class="mt-2"><strong>Response:</strong></div>
                                            <div>{{ formatJson(log.responseBody) }}</div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>

            <v-btn class="mb-3" block height="70" @click="shareLogs" prepend-icon="mdi-share-variant" color="primary">
                Paylaş
            </v-btn>
            <v-btn class="mb-3" block height="70" @click="reloadPage()" color="warning">
                Sayfayı Yenile
            </v-btn>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

const dialog = ref(false)
const tab = ref('network')

const logs = ref<string[]>([])
const networkLogs = ref<NetworkLog[]>([])

const reloadPage = () => {
    window.location.reload();
}

/* ------------------- LOG PAYLAŞ ------------------- */
const shareLogs = async () => {
    const consoleSection = [
        '=== CONSOLE LOGS ===',
        ...logs.value.map(log => `[${new Date().toLocaleString()}] ${log}`),
        '',
    ]

    const networkSection = ['=== NETWORK LOGS ===']
    networkLogs.value.forEach((log, index) => {
        networkSection.push(`---------- [${index + 1}] ${log.method} ${log.url} ----------`)
        networkSection.push(`Zaman: ${log.startTimeEndTime}`)
        networkSection.push(`Durum: ${log.status} | Süre: ${log.time}`)
        networkSection.push('')
        networkSection.push('Request Body:')
        networkSection.push(formatJson(log.requestBody) || 'Yok')
        networkSection.push('')
        networkSection.push('Response Body:')
        networkSection.push(formatJson(log.responseBody) || 'Yok')
        networkSection.push('\n')
    })

    const content = [...consoleSection, ...networkSection].join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const file = new File([blob], 'debug-logs.txt', { type: 'text/plain' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: 'Uygulama Logları',
                text: 'Log dosyasını inceleyin:',
                files: [file],
            })
        } catch (err) {
            console.error('Paylaşım iptal edildi veya hata oluştu:', err)
        }
    } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'debug-logs.txt'
        a.click()
        URL.revokeObjectURL(url)
    }
}

/* ------------------- JSON FORMAT ------------------- */
const formatJson = (data: any): string => {
    try {
        if (typeof data === 'string') return data
        return JSON.stringify(data, null, 2)
    } catch {
        return String(data)
    }
}

/* ------------------- CONSOLE YAKALAMA ------------------- */
let originalLog = console.log
let originalWarn = console.warn
let originalError = console.error

const captureConsole = () => {
    console.log = (...args) => {
        logs.value.push(`[LOG] ${args.join(' ')}`)
        originalLog(...args)
    }
    console.warn = (...args) => {
        logs.value.push(`[WARN] ${args.join(' ')}`)
        originalWarn(...args)
    }
    console.error = (...args) => {
        logs.value.push(`[ERROR] ${args.join(' ')}`)
        originalError(...args)
    }
}

/* ------------------- AXIOS NETWORK YAKALAMA ------------------- */
type NetworkLog = {
    method: string
    url: string
    requestBody?: any
    responseBody?: any
    startTimeEndTime: string
    status: number
    time: string
}

const captureAxios = () => {
    axios.interceptors.request.use(config => {
        const startTime = new Date()
            ; (config as any).startTime = startTime
        return config
    })

    axios.interceptors.response.use(
        response => {
            const endTime = new Date()
            const startTime = (response.config as any).startTime
            const elapsed = `${endTime.getTime() - startTime.getTime()}ms`

            networkLogs.value.unshift({
                method: response.config.method?.toUpperCase() || 'GET',
                url: response.config.url || '',
                requestBody: response.config.data,
                responseBody: response.data,
                startTimeEndTime: `${getCurrentTime(startTime)} - ${getCurrentTime(endTime)}`,
                status: response.status,
                time: elapsed,
            })
            return response
        },
        error => {
            const endTime = new Date()
            const startTime = (error.config as any)?.startTime || new Date()
            const elapsed = `${endTime.getTime() - startTime.getTime()}ms`

            networkLogs.value.unshift({
                method: error.config?.method?.toUpperCase() || 'UNKNOWN',
                url: error.config?.url || '',
                requestBody: error.config?.data,
                responseBody: error.response?.data || error.message,
                startTimeEndTime: `${getCurrentTime(startTime)} - ${getCurrentTime(endTime)}`,
                status: error.response?.status || 0,
                time: elapsed,
            })
            return Promise.reject(error)
        }
    )
}

/* ------------------- SAAT ------------------- */
function getCurrentTime(now: Date): string {
    const pad = (num: number): string => num.toString().padStart(2, '0')
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

/* ------------------- YAŞAM DÖNGÜSÜ ------------------- */
onMounted(() => {
    captureConsole()
    captureAxios()
})
</script>
