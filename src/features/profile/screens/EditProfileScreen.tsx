import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import InputField from '@/components/InputField';
import NumericInputField from '@/components/NumericInputField';
import ChipSelector from '@/components/ChipSelector';
import Button from '@/components/Button';
import { GENDER_OPTIONS } from '@/constants';
import { useProfileForm } from '../hooks/useProfileForm';
import { useAppTheme } from '@/lib/useAppTheme';

export default function EditProfileScreen() {
    const theme = useAppTheme();
    const { control, errors, isSubmitting, loading, onSubmit } = useProfileForm();

    if (loading) return null;

    return (
        <ScreenContainer>
            <View style={{ marginTop: theme.spacing(2) }}>
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

                <Button title="Guardar" onPress={onSubmit} disabled={isSubmitting} />
            </View>
        </ScreenContainer>
    );
}
