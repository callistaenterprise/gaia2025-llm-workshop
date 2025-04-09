export function convertToSwedishUnits(unit: string, amount: number): UnitAndAmount {
    const swedishUnits: string[] = ["g", "kg", "l", "dl", "msk", "tsk", "krm", "efter smak"];

    if (unit !== undefined && swedishUnits.includes(unit.toLowerCase())) {
        return { unit, amount }; // Don't convert, just return as-is
    }

    const tablespoon: string [] = ["tablespoon", "tablespoons", "tbs", "tbsp", "tbsp.", "tblsp", "tpbl"];
    if (unit !== undefined && tablespoon.includes(unit.toLowerCase()) || unit == "T") {
        return {unit: "msk", amount: amount};
    }
    const teaspoon: string [] = ["teaspoon", "teaspoons", "tsp", "tsp.", "tsps", "ts"];
    if (unit !== undefined && teaspoon.includes(unit.toLowerCase()) || unit == "t") {
        return {unit: "tsk", amount: amount};
    }
    const pound: string [] = ["pound", "pounds", "lb", "lbs", "#"];
    if (unit !== undefined && pound.includes(unit.toLowerCase())) {
        return {unit: "kg", amount: lb2kg(amount)};
    }
    const cup: string [] = ["cup", "cups", "cps", "c"];
    if (unit !== undefined && cup.includes(unit.toLowerCase())) {
        return {unit: "dl", amount: cup2dl(amount)};
    }
    const ounce: string [] = ["ounce", "ounces", "oz"];
    if (unit !== undefined && ounce.includes(unit.toLowerCase())) {
        return {unit: "g", amount: oz2g(amount)};
    }
    const gallon: string [] = ["gallon", "gallons", "gal", "gals"];
    if (unit !== undefined && gallon.includes(unit.toLowerCase())) {
        return {unit: "l", amount: gallon2liter(amount)};
    }

    const pinch: string [] = ["pinch", "pinches", "pn", "p"];
    if (unit !== undefined && pinch.includes(unit.toLowerCase()) ) {
        return {unit: "krm", amount: pinch2krm(amount)};
    }

    const dash: string [] = ["dash", "dashes", "ds", "d"];
    if (unit !== undefined && dash.includes(unit.toLowerCase())) {
        return {unit: "krm", amount: dash2krm(amount)};
    }
    return {unit: "efter smak", amount: 0};

}

function oz2g(amount: number): number {
    return amount * 28.34952;
}

function lb2kg(amount: number): number {
    return (amount * 0.4535924);
}

function cup2dl(amount: number): number {
    return amount * 2.365882;
}

function gallon2liter(amount: number):  number {
    return amount * 3.785412;
}

function pinch2krm(amount: number):  number {
    return amount * 0.3125;
}

function dash2krm(amount: number):  number {
    return amount * 0.625;
}


export interface UnitAndAmount {
    unit: string,
    amount: number
}