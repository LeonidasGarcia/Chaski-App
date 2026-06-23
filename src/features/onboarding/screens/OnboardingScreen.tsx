import { Controller } from 'react-hook-form';
import ScreenContainer from '@/components/ScreenContainer';
import InputField from '@/components/InputField';
import ChipSelector from '@/components/ChipSelector';
import Button from '@/components/Button';
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
                    <InputField
                        label="Edad"
                        value={value != null ? String(value) : ''}
                        onChangeText={(text) => onChange(text ? Number(text) : undefined)}
                        keyboardType="numeric"
                        placeholder="Tu edad"
                        error={errors.age?.message}
                    />
                )}
            />

            <Controller
                name="weight_kg"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Peso (kg)"
                        value={value != null ? String(value) : ''}
                        onChangeText={(text) => onChange(text ? Number(text) : undefined)}
                        keyboardType="numeric"
                        placeholder="Tu peso"
                        error={errors.weight_kg?.message}
                    />
                )}
            />

            <Controller
                name="height_cm"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <InputField
                        label="Altura (cm)"
                        value={value != null ? String(value) : ''}
                        onChangeText={(text) => onChange(text ? Number(text) : undefined)}
                        keyboardType="numeric"
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
                        onSelect={onChange}
                        error={errors.theme_preference?.message}
                    />
                )}
            />

            <Button title="Comenzar" onPress={onSubmit} disabled={isSubmitting} />
        </ScreenContainer>
    );
}
