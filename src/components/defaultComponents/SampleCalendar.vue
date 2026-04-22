<template>
    <v-card height="70vh">
        <v-card-text class="fill-height overflow-auto">
            <FullCalendar style="min-width: 500px;" class="fill-height" ref="calendarRef" :options="calendarOptions">
            </FullCalendar>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, type Ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import i18n from "@/core/plugins/i18n";

const todayDate = moment().startOf("day");
const TODAY = todayDate.format("YYYY-MM-DD");

const t = i18n.global.t;
const localeValue = i18n.global.locale.value;
const calendarRef: Ref<null | typeof FullCalendar> = ref(null);

const newEvent = (item: any) => {
    if (item.allDay) {
        console.log(item, "güne tıkladı")
    } else {
        console.log(item.description, "iteme tıkladı")
    }
};

const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
        left: `prev,next today`,
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    buttonText: {
        today: t('enums.Today'),
    },
    locale: localeValue,
    initialDate: TODAY, // Yukarıdaki Gün görünümüne geçince açılacak günü temsil ediyor.
    initialView: 'timeGridWeek', // Default olarak haftalık görünüm açık gelir.
    firstDay: 1, // Pazartesiyi haftanın ilk günü yapıyor. defaultta Pazar ilk gün.
    navLinks: true, // Haftalık görünümde takvimdeki başlıklar tıklanabilir oluyor. 14/05 Çarş tıklayınca gün görünümünde o güne gidiyor.
    views: {
        dayGridMonth: { buttonText: t('enums.Month') },
        timeGridWeek: { buttonText: t('enums.Week') },
        timeGridDay: { buttonText: t('enums.Day') },
    },
    dayMaxEvents: true, // Gün içinde etkinlik sayısı fazla ise bu onu sınırlar ve +5 more vb yazı gösterir.
    eventLimit: 3, // Bir günde en fazla 3 etkinlik gösterilsin
    weekNumbers: true,  // Yıl içinde kaçıncı haftada olduğumuzu belirtir.
    events: [],
    slotDuration: '00:30:00', // zaman diliminin süresini belirler örnek 30 dk
    slotLabelInterval: '01:00', // Soldaki saatleri gösterir. Hangi aralıkta olduğunu. Saatlik etiket aralığı
    showNonCurrentDates: true, // Geçerli tarih dışındaki tarihler gösterilmez
    scrollTime: '07:00:00', // Takvim gösterimi hangi saatten başlasın. Örnek saat 07:00'den başlasın
    allDaySlot: false, // all day slotunun görünebilirliğini değiştirir.
    allDayMaintainDuration: true, // Tüm gün etkinliklerinin süresini korur. Örneğin, bir etkinlik tüm günse ve saat 10:00'da başlıyorsa, bu etkinlik tüm gün boyunca gösterilir.
    slotEventOverlap: false, // Zaman diliminde etkinliklerin üst üste binmesini engeller. Örneğin, bir etkinlik 10:00-11:00 arasında ve diğeri 10:30-11:30 arasında ise, bu etkinlikler üst üste binmez.
    nowIndicator: true, // Şu anki zamanı gösteren bir çizgi ekler. Örneğin, saat 10:00 ise, takvimde 10:00'da bir çizgi gösterir.


    dateClick: newEvent, // gün üzerine tıklayınca çalışan method
    eventClick: newEvent, // etkinlik üzerine tıklayınca çalışan method
    viewDidMount: newEvent, // yukarıdaki ay/hafta/gün görünümüne tıklayınca çalışan method
    datesSet: newEvent, // takvimdeki tarih aralığı değiştiğinde tetiklenir. Örneğin ayı değiştirince, haftayı değiştirince, gün görünümüne geçince tetiklenir.

    eventsSet: (events: any) => { // etkinlik eklemesi başarılıysa tetiklenir
        // console.log('Etkinlikler başarıyla set edildi:', events);
    },
    select: (info: any) => { // takvim üzerinde seçilen tarih aralığını getirir.
        // console.log('Seçilen tarih aralığı:', info);
    },
    unselect: () => {
        // console.log('Seçim kaldırıldı.');
    },

    selectable: true, // Takvim üzerinde seçim yapmayı sağlar. Basılı tutup aşağı kaydır.
    selectMirror: true, // Seçim yaparken şeçili alanın rengini mavi şekilde belirtir.
    selectAllow: (selectInfo: any) => { // seçim yapılırken gün içinde mi seçim yapıyor diğer günlere kayıyır mu kontrolü yapıyor.
        // Başlangıç ve bitiş tarihinin günü aynı mı kontrol ediliyor
        const start = selectInfo.start;
        const end = selectInfo.end;

        // Aynı gün içinde kalıyorsa true döner, aksi halde false
        return start.getDate() === end.getDate() &&
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear();
    },

    editable: false, // Takvim üzerindeki etkinlikleri taşıyabilmeyi veya etkinliğin süresini değiştirebilmeyi sağlar
    eventDrop: (info: any) => { // editable true ise etkinliği taşıyınca tetiklenir
        // console.log("Etkinlik taşındı", info);
    },
    eventResize: (info: any) => { // editable true ise etkinliği süresini değişince tetiklenir
        // console.log("Etkinlik boyutu değiştirildi", info);
    },


    // eventSource: { // Etkinlikleri dışarıdan almaya yarıyormuş APİ ye istek atıp çekiyor galiba işe yarar mı bilinmez.
    //     url: '/api/events', // Etkinliklerinizi almak için API endpoint
    //     method: 'GET',
    //     extraParams: {
    //         userId: 123
    //     }
    // }

    // eventBackgroundColor: '#ff0000', // Etkinlik arka plan rengi
    // eventTextColor: '#ffffff', // Etkinlik metin rengi
    // eventColor: '#378006', // etkinlilk rengini değişir
});

</script>

<style lang="scss">
.fc .fc-button {
    padding: 0.75rem 1.25rem;
    box-shadow: none !important;
    border: 0 !important;
    border-radius: 0.475rem;
    vertical-align: middle;
    font-weight: 500;
    text-transform: capitalize;
}
</style>