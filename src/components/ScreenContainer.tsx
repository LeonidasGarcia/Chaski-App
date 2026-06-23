import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface ScreenContainerProps {
    children: ReactNode;
}

export default function ScreenContainer({ children }: ScreenContainerProps) {
    const { theme } = useUnistyles();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[localStyles.flex, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView
                contentContainerStyle={[localStyles.content, { padding: theme.spacing(4) }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const localStyles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
});
