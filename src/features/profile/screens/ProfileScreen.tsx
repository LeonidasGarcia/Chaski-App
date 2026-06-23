import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';
import type { UserProfileRepository } from '@/types/database';
import Button from '@/components/Button';
import SectionCard from '@/components/SectionCard';
import MetricRow from '@/components/MetricRow';
import {
    calculateBMI,
    getBMICategory,
    calculateIdealWeightRange,
    calculateMaxHR,
    calculateHeartRateZones,
    calculateBMR,
    calculateBSA,
    calculateTotalBodyWater,
    estimateBodyFat,
    calculateCaloriesPerKm,
} from '@/lib/health';

const GENDER_LABELS: Record<string, string> = {
    MALE: 'Masculino',
    FEMALE: 'Femenino',
    OTHER: 'Otro',
};

export default function ProfileScreen() {
    const { theme } = useUnistyles();
    const { userProfile } = useDatabaseContext();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileRepository | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userProfile.get().then((p) => {
            setProfile(p);
            setLoading(false);
        });
    }, [userProfile]);

    if (loading || !profile) return null;

    const bmi = calculateBMI(profile.weight_kg, profile.height_cm);
    const bmiCategory = getBMICategory(bmi);
    const idealWeight = calculateIdealWeightRange(profile.height_cm);
    const maxHR = calculateMaxHR(profile.age, profile.gender);
    const zones = calculateHeartRateZones(maxHR);
    const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender);
    const bsa = calculateBSA(profile.weight_kg, profile.height_cm);
    const tbw = calculateTotalBodyWater(
        profile.weight_kg,
        profile.height_cm,
        profile.age,
        profile.gender,
    );
    const bodyFat = estimateBodyFat(bmi, profile.age, profile.gender);
    const calPerKm = calculateCaloriesPerKm(profile.weight_kg);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={{ paddingTop: theme.spacing(6) }}
        >
            {/* Header */}
            <View
                style={{
                    paddingHorizontal: theme.spacing(4),
                    marginBottom: theme.spacing(6),
                }}
            >
                <Text
                    style={[
                        theme.typography.presets.h1,
                        {
                            color: theme.colors.text,
                            marginBottom: theme.spacing(1),
                        },
                    ]}
                >
                    {profile.name}
                </Text>
                <Text
                    style={[theme.typography.presets.body, { color: theme.colors.textSecondary }]}
                >
                    {profile.age} años · {GENDER_LABELS[profile.gender]}
                </Text>
            </View>

            {/* Body Stats Card */}
            <SectionCard title="Datos corporales">
                <MetricRow label="Peso" value={`${profile.weight_kg} kg`} />
                <MetricRow label="Altura" value={`${profile.height_cm} cm`} />
                <MetricRow label="IMC" value={`${bmi.toFixed(1)} — ${bmiCategory}`} />
                <MetricRow
                    label="Peso ideal"
                    value={`${idealWeight.min} – ${idealWeight.max} kg`}
                />
                <MetricRow label="Superficie corporal" value={`${bsa} m²`} />
                <MetricRow label="Agua corporal total" value={`${tbw} L`} />
            </SectionCard>

            {/* Cardiovascular Metrics Card */}
            <SectionCard title="Métricas cardiovasculares">
                <MetricRow label="FC máxima" value={`${maxHR} lpm`} />
                {zones.map((z) => (
                    <MetricRow
                        key={z.zone}
                        label={`${z.zone} (${z.pctMin}–${z.pctMax}%)`}
                        value={`${z.min}–${z.max} lpm`}
                    />
                ))}
            </SectionCard>

            {/* Body Composition Card */}
            <SectionCard title="Composición corporal">
                <MetricRow label="Tasa metabólica basal" value={`${bmr} kcal/día`} />
                <MetricRow label="Grasa corporal estimada" value={`${bodyFat}%`} />
                <MetricRow label="Gasto calórico por km" value={`~${calPerKm} kcal/km`} />
            </SectionCard>

            {/* Edit Button */}
            <View
                style={{
                    paddingHorizontal: theme.spacing(4),
                    marginBottom: theme.spacing(8),
                }}
            >
                <Button title="Editar perfil" onPress={() => router.push('/(tabs)/profile/edit')} />
            </View>
        </ScrollView>
    );
}
