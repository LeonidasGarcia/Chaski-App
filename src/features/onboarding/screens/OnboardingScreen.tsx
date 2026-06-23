import { Controller } from 'react-hook-form';
import ScreenContainer from '@/components/ScreenContainer';
import InputField from '@/components/InputField';
import NumericInputField from '@/components/NumericInputField';
import ChipSelector from '@/components/ChipSelector';
import Button from '@/components/Button';
import { applyThemePreference } from '@/lib/theme';
import type { ThemePreference } from '@/types/database';
import { useOnboardingForm } from '../hooks/useOnboardingForm';
import { GENDER_OPTIONS, THEME_OPTIONS } from '@/constants';

export default function OnboardingScreen() {
    const { control, errors, isSubmitting, onSubmit } = useOnboardingForm();

    return (
        <ScreenContainer>
            <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Nombre"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Tu nombre"
                        error={errors.name?.message}
                    />
                )}
            />

            <Controller
                name="age"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <NumericInputField
                        label="Edad"
                        value={value}
                        onChange={onChange}
                        placeholder="Tu edad"
                        error={errors.age?.message}
                    />
                )}
            />

            <Controller
                name="weight_kg"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <NumericInputField
                        label="Peso (kg)"
                        value={value}
                        onChange={onChange}
                        placeholder="Tu peso"
                        error={errors.weight_kg?.message}
                    />
                )}
            />

            <Controller
                name="height_cm"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <NumericInputField
                        label="Altura (cm)"
                        value={value}
                        onChange={onChange}
                        placeholder="Tu altura"
                        error={errors.height_cm?.message}
                    />
                )}
            />

            <Controller
                name="gender"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <ChipSelector
                        label="Género"
                        options={GENDER_OPTIONS}
                        selected={value ?? ''}
                        onSelect={onChange}
                        error={errors.gender?.message}
                    />
                )}
            />

            <Controller
                name="theme_preference"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <ChipSelector
                        label="Tema"
                        options={THEME_OPTIONS}
                        selected={value}
                        onSelect={(v) => {
                            onChange(v);
                            applyThemePreference(v as ThemePreference);
                        }}
                        error={errors.theme_preference?.message}
                    />
                )}
            />

            <Button title="Comenzar" onPress={onSubmit} disabled={isSubmitting} />
        </ScreenContainer>
    );
}
