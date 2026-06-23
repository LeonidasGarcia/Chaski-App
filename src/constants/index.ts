import type { Gender, ThemePreference } from '@/types/database';

interface ChipOption<T extends string = string> {
    label: string;
    value: T;
}

export const GENDER_OPTIONS: ChipOption<Gender>[] = [
    { label: 'Masculino', value: 'MALE' },
    { label: 'Femenino', value: 'FEMALE' },
    { label: 'Otro', value: 'OTHER' },
];

export const THEME_OPTIONS: ChipOption<ThemePreference>[] = [
    { label: 'Claro', value: 'LIGHT' },
    { label: 'Oscuro', value: 'DARK' },
    { label: 'Sistema', value: 'SYSTEM' },
];
