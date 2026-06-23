export function calculateBMI(weight_kg: number, height_cm: number): number {
    const height_m = height_cm / 100;
    return weight_kg / (height_m * height_m);
}

export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Bajo peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidad';
}

export function calculateIdealWeightRange(height_cm: number): {
    min: number;
    max: number;
} {
    const height_m = height_cm / 100;
    return {
        min: +(18.5 * height_m * height_m).toFixed(1),
        max: +(24.9 * height_m * height_m).toFixed(1),
    };
}

export function calculateMaxHR(age: number, gender: string): number {
    if (gender === 'FEMALE') {
        return Math.round(206 - 0.88 * age);
    }
    return Math.round(220 - age);
}

export function calculateHeartRateZones(maxHR: number) {
    return [
        {
            zone: 'Z1',
            pctMin: 50,
            pctMax: 60,
            min: Math.round(maxHR * 0.5),
            max: Math.round(maxHR * 0.6),
        },
        {
            zone: 'Z2',
            pctMin: 60,
            pctMax: 70,
            min: Math.round(maxHR * 0.6),
            max: Math.round(maxHR * 0.7),
        },
        {
            zone: 'Z3',
            pctMin: 70,
            pctMax: 80,
            min: Math.round(maxHR * 0.7),
            max: Math.round(maxHR * 0.8),
        },
        {
            zone: 'Z4',
            pctMin: 80,
            pctMax: 90,
            min: Math.round(maxHR * 0.8),
            max: Math.round(maxHR * 0.9),
        },
        { zone: 'Z5', pctMin: 90, pctMax: 100, min: Math.round(maxHR * 0.9), max: maxHR },
    ];
}

export function calculateBMR(
    weight_kg: number,
    height_cm: number,
    age: number,
    gender: string,
): number {
    const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
    if (gender === 'FEMALE') {
        return Math.round(base - 161);
    }
    return Math.round(base + 5);
}

export function calculateBSA(weight_kg: number, height_cm: number): number {
    return +Math.sqrt((height_cm * weight_kg) / 3600).toFixed(2);
}

export function calculateTotalBodyWater(
    weight_kg: number,
    height_cm: number,
    age: number,
    gender: string,
): number {
    if (gender === 'FEMALE') {
        return +(-2.097 + 0.1069 * height_cm + 0.2466 * weight_kg).toFixed(1);
    }
    return +(2.447 - 0.09516 * age + 0.1074 * height_cm + 0.3362 * weight_kg).toFixed(1);
}

export function estimateBodyFat(bmi: number, age: number, gender: string): number {
    const sex = gender === 'MALE' ? 1 : 0;
    return +(1.2 * bmi + 0.23 * age - 10.8 * sex - 5.4).toFixed(1);
}

export function calculateCaloriesPerKm(weight_kg: number): number {
    return Math.round(1.03 * weight_kg);
}
