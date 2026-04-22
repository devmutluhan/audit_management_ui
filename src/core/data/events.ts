import moment from "moment";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { ref } from "vue";
import i18n from "@/core/plugins/i18n";
import type { CalendarOptions, EventInput } from "@fullcalendar/core";
const t = i18n.global.t;
const localeValue = i18n.global.locale.value;

const todayDate = moment().startOf("day");
const YM = todayDate.format("YYYY-MM");
const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
const TODAY = todayDate.format("YYYY-MM-DD");
const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");

export const defaultCalendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  headerToolbar: {
    left: `prev,next today`,
    center: "title",
    right: "timeGridWeek,timeGridDay",
  },
  buttonText: {
    today: t('enums.Today'),
  },
  noEventsContent: t('general.noDataFound'),
  locale: localeValue,
  initialDate: TODAY, // Yukarıdaki Gün görünümüne geçince açılacak günü temsil ediyor.
  initialView: 'timeGridWeek', // Default olarak haftalık görünüm açık gelir.
  firstDay: 1, // Pazartesiyi haftanın ilk günü yapıyor. defaultta Pazar ilk gün.
  navLinks: true, // Haftalık görünümde takvimdeki başlıklar tıklanabilir oluyor. 14/05 Çarş tıklayınca gün görünümünde o güne gidiyor.
  views: {
    timeGridWeek: { buttonText: t('enums.Week') },
    timeGridDay: { buttonText: t('enums.Day') },
  },
  dayMaxEvents: true, // Gün içinde etkinlik sayısı fazla ise bu onu sınırlar ve +5 more vb yazı gösterir.
  eventLimit: 3, // Bir günde en fazla 3 etkinlik gösterilsin
  weekNumbers: false,  // Yıl içinde kaçıncı haftada olduğumuzu belirtir.
  events: [],
  slotDuration: '00:30:00', // zaman diliminin süresini belirler örnek 30 dk
  slotLabelInterval: '01:00', // Soldaki saatleri gösterir. Hangi aralıkta olduğunu. Saatlik etiket aralığı
  showNonCurrentDates: true, // Geçerli tarih dışındaki tarihler gösterilmez
  scrollTime: '07:00:00', // Takvim gösterimi hangi saatten başlasın. Örnek saat 07:00'den başlasın
  allDaySlot: false, // all day slotunun görünebilirliğini değiştirir.
  allDayMaintainDuration: true, // Tüm gün etkinliklerinin süresini korur. Örneğin, bir etkinlik tüm günse ve saat 10:00'da başlıyorsa, bu etkinlik tüm gün boyunca gösterilir.
  slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }, // Saat etiket formatını belirler. 24 saat formatında gösterir.

  slotEventOverlap: false, // Zaman diliminde etkinliklerin üst üste binmesini engeller. Örneğin, bir etkinlik 10:00-11:00 arasında ve diğeri 10:30-11:30 arasında ise, bu etkinlikler üst üste binmez.
  nowIndicator: true, // Şu anki zamanı gösteren bir çizgi ekler. Örneğin, saat 10:00 ise, takvimde 10:00'da bir çizgi gösterir.


  dateClick(arg: any) { }, // Mobil görünümde tıklayınca seçim yapar. Tutup uzatarak saat aralığı seçilemiyor.
  select(arg: any) { }, // Web görünümde tutup uzatarak saat aralığı seçmeye yarar. Mobilde işe yaramaz.
  selectable: true, // Takvim üzerinde seçim yapmayı sağlar. Basılı tutup aşağı kaydır.
  selectMirror: true, // Seçim yaparken şeçili alanın rengini mavi şekilde belirtir.
} as CalendarOptions);

export const events: Array<EventInput> = [
  {
    title: "Deneme",
    start: YM + "-01",
    description: "Toto lorem ipsum dolor sit incid idunt ut",
    className: "bg-primary",
  },
  {
    title: "Reporting",
    start: YM + "-14T13:30:00",
    description: "Lorem ipsum dolor incid idunt ut labore",
    end: YM + "-14",
    className: "fc-event-success",
  },
  {
    title: "Company Trip",
    start: YM + "-02",
    description: "Lorem ipsum dolor sit tempor incid",
    end: YM + "-03",
    className: "fc-event-danger",
  },
  {
    title: "ICT Expo 2017 - Product Release",
    start: YM + "-03",
    description: "Lorem ipsum dolor sit tempor inci",
    end: YM + "-05",
    className: "fc-event-light fc-event-solid-primary",
  },
  {
    title: "Dinner",
    start: YM + "-12",
    description: "Lorem ipsum dolor sit amet, conse ctetur",
    end: YM + "-10",
  },
  {
    id: "999",
    title: "Repeating Event",
    start: YM + "-09T16:00:00",
    description: "Lorem ipsum dolor sit ncididunt ut labore",
    className: "fc-event-danger",
  },
  {
    id: "1000",
    title: "Repeating Event",
    description: "Lorem ipsum dolor sit amet, labore",
    start: YM + "-16T16:00:00",
  },
  {
    title: "Conference",
    start: YESTERDAY,
    end: TOMORROW,
    description: "Lorem ipsum dolor eius mod tempor labore",
    className: "fc-event-primary",
  },
  {
    title: "Meeting",
    start: TODAY + "T10:30:00",
    end: TODAY + "T12:30:00",
    description: "Lorem ipsum dolor eiu idunt ut labore",
  },
  {
    title: "Lunch",
    start: TODAY + "T12:00:00",
    className: "fc-event-info",
    description: "Lorem ipsum dolor sit amet, ut labore",
  },
  {
    title: "Meeting",
    start: TODAY + "T14:30:00",
    className: "fc-event-warning",
    description: "Lorem ipsum conse ctetur adipi scing",
  },
  {
    title: "Happy Hour",
    start: TODAY + "T17:30:00",
    className: "fc-event-info",
    description: "Lorem ipsum dolor sit amet, conse ctetur",
  },
  {
    title: "Dinner",
    start: TOMORROW + "T05:00:00",
    className: "fc-event-solid-danger fc-event-light",
    description: "Lorem ipsum dolor sit ctetur adipi scing",
  },
  {
    title: "Birthday Party",
    start: TOMORROW + "T07:00:00",
    className: "fc-event-primary",
    description: "Lorem ipsum dolor sit amet, scing",
  },
  {
    title: "Click for Google",
    url: "http://google.com/",
    start: YM + "-28",
    className: "fc-event-solid-info fc-event-light",
    description: "Lorem ipsum dolor sit amet, labore",
  },
];

export { todayDate, YM, YESTERDAY, TODAY, TOMORROW };
