import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    age: z.coerce
        .number({ message: 'Debe ser un número' })
        .int('Debe ser un número entero')
        .min(1, 'Edad mínima: 1')
        .max(150, 'Edad máxima: 150'),
    weight_kg: z.coerce
        .number({ message: 'Debe ser un número' })
        .positive('Debe ser positivo')
        .max(300, 'Peso máximo: 300 kg'),
    height_cm: z.coerce
        .number({ message: 'Debe ser un número' })
        .positive('Debe ser positivo')
        .max(250, 'Altura máxima: 250 cm'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'] as const, {
        message: 'Selecciona un género',
    }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
