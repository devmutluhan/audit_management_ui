import { ref } from "vue";

export const dashboardCardCols = ref(12);
export const offerCreateCardCols = ref(12);

// export const getDashboardCardCols = (width: number) => {
//     console.log(width)
//     if (width < 640) { // xs
//         dashboardCardCols.value = 12;
//     } else if (width >= 640 && width < 807) { // sm
//         dashboardCardCols.value = 6;
//     } else if (width >= 807 && width < 1060) { //md
//         dashboardCardCols.value = 5;
//     } else if (width >= 1060 && width < 1560) { //lg
//         dashboardCardCols.value = 4;
//     } else { // xl
//         dashboardCardCols.value = 3
//     }
// }

export const getOfferCreateCols = (width: number) => {
    if (width < 900) {
        offerCreateCardCols.value = 12;
    } else {
        offerCreateCardCols.value = 6;
    }
}


export const watchWidth = (element: HTMLElement) => {
    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const width = entry.target instanceof HTMLElement ? entry.target.offsetWidth : 0;
            // getDashboardCardCols(width);
            getOfferCreateCols(width);
        }
    });
    resizeObserver.observe(element);
};