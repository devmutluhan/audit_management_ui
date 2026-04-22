import { OfferItemCommand } from "@/models/entities/crm/CrmOfferCommands";
import { OfferItemDto } from "@/models/entities/crm/CrmOfferDtos";

const createOfferItemDto = (changeProp: any): OfferItemDto => {
    const result = {
        ...new OfferItemDto(),
        ...changeProp,
    }
    return result
}

// net fiyat vergiler hariç
const netPriceExcludeTax = (item: OfferItemDto): Number => {
    let result = 0;

    if (item.quantity && item.unitPriceExclTax) {
        result = item.unitPriceExclTax * item.quantity
    }

    return Number(result.toFixed(4))
}

// iskontolu net price hesaplar (SubTotal)
const netPriceForDiscount = (item: OfferItemDto): Number => {
    let result = +netPriceExcludeTax(item);

    if (item.discountRate && Math.abs(item.discountRate) > 0) {
        result = result - (result * (item.discountRate / 100))
    }

    return Number(result.toFixed(4))
}

// toplam iskonto fiyatı
const totalDiscountCalculation = (item: OfferItemDto): Number => {
    let result = 0

    if (item.discountRate && Math.abs(item.discountRate) > 0) {
        result = +netPriceExcludeTax(item) - +netPriceForDiscount(item);
    }

    return result
}

// toplam kdv ücreti tevkifatsız
const totalVatCalculation = (item: OfferItemDto): Number => {
    let result = 0
    let priceExcludeVat = +netPriceForDiscount(item);

    // iskontolu fiyata ötv fiyatı eklenir
    if (item.otvRate && item.otvRate > 0) {
        priceExcludeVat = priceExcludeVat + Number(totalOtvCalculation(item));
    }

    // iskontolu fiyata öiv fiyatı eklenir
    if (item.oivRate && item.oivRate > 0) {
        priceExcludeVat = priceExcludeVat + Number(totalOivCalculation(item));
    }

    // ötv + öiv + iskontolu fiyat üzerinde kdv hesabı yapılır 
    if (item.vatRate && item.vatRate > 0) {
        result = priceExcludeVat * (item.vatRate / 100)
    }

    return Number(result.toFixed(4));
}

// toplam ötv ücreti 
const totalOtvCalculation = (item: OfferItemDto): Number => {
    let result = 0;

    if (item.otvRate && item.otvRate > 0) {
        result = +netPriceForDiscount(item) * (item.otvRate / 100)
    }

    return Number(result.toFixed(4))
}

// toplam öiv ücreti 
const totalOivCalculation = (item: OfferItemDto): Number => {
    let result = 0;

    if (item.oivRate && item.oivRate > 0) {
        result = +netPriceForDiscount(item) * (item.oivRate / 100)
    }

    return Number(result.toFixed(4))
}

// toplam tevkifat ücreti 
const totalTevkifatCalculation = (item: OfferItemDto) => {
    let netPriceExcludeVat = +netPriceForDiscount(item)
    let result = 0;

    if (item.tevkifatFormula && item.vatRate && item.vatRate > 0) {
        // kdv hesabı için iskontolu fiyata ötv fiyatı eklenir
        if (item.otvRate && item.otvRate > 0) {
            netPriceExcludeVat = netPriceExcludeVat + Number(totalOtvCalculation(item));
        }

        // kdv hesabı için iskontolu fiyata öiv fiyatı eklenir
        if (item.oivRate && item.oivRate > 0) {
            netPriceExcludeVat = netPriceExcludeVat + Number(totalOivCalculation(item));
        }

        let kdvFiyati = netPriceExcludeVat * (item.vatRate / 100);
        let tevkifat = item.tevkifatFormula.split('/');

        result = kdvFiyati * (+tevkifat[0] / +tevkifat[1])
    }

    return Number(result.toFixed(4))
}

// 1 item'ın vergiler dahil, iskontolu ücreti 
const getTotalPriceForItem = (item: OfferItemDto) => {
    let result = 0;

    let netPrice = +netPriceExcludeTax(item);
    let totalOiv = +totalOivCalculation(item);
    let totalOtv = +totalOtvCalculation(item);
    let totalVat = +totalVatCalculation(item) - +totalTevkifatCalculation(item);
    let discount = +totalDiscountCalculation(item);

    result = netPrice + totalOiv + totalOtv + totalVat - discount;

    return Number(result.toFixed(4))
}

// Gelen arrayin itemlarının vergiler dahil, iskontolu toplam ücreti 
const getTotalPriceForArray = (items: Array<OfferItemDto>) => {
    let result = 0;

    items.forEach((item) => {
        let itemResult = +getTotalPriceForItem(item);

        result += itemResult
    })

    return Number(result.toFixed(4))
}

// Toplam birim sayısı hesaplama 
const getTotalQuantity = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        if (item.quantity)
            result += Number(item.quantity)
    })
    return result;
}

// Toplam birim fiyatları hesaplama 
const getTotalUnitPrice = (items: Array<OfferItemDto>) => {
    let result = 0;

    items.forEach((item) => {
        if (item.unitPriceExclTax)
            result += Number(item.unitPriceExclTax)
    })
    return result
}

// Toplam net fiyat hesaplama 
const getTotalNetPrice = (items: Array<OfferItemDto>) => {
    let result = 0;

    items.forEach((item) => {
        result += +netPriceForDiscount(item);
    })

    return result
}

// Toplam Kdv fiyatı hesaplama (tevkifatsız)
const getTotalVatPrice = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        result += +totalVatCalculation(item)
    })
    return result
}

// Toplam Otv fiyatı hesaplama
const getTotalOtvPrice = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        result += +totalOtvCalculation(item)
    })
    return result
}

// Toplam Oiv fiyatı hesaplama
const getTotalOivPrice = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        result += +totalOivCalculation(item)
    })
    return result
}

// Toplam Tevkifat fiyatı hesaplama
const getTotalTevkifatPrice = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        result += +totalTevkifatCalculation(item)
    })
    return result
}

// Toplam İndirim fiyatı hesaplama
const getTotalDiscountPrice = (items: Array<OfferItemDto>) => {
    let result = 0;
    items.forEach((item) => {
        result += +totalDiscountCalculation(item)
    })
    return result
}

export {
    netPriceForDiscount,
    createOfferItemDto, getTotalPriceForArray, getTotalQuantity, getTotalUnitPrice, getTotalNetPrice,
    getTotalVatPrice, getTotalOivPrice, getTotalOtvPrice, getTotalTevkifatPrice, getTotalDiscountPrice
}