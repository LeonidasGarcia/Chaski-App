import { type ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/lib/useAppTheme';

interface SafeScreenContainerProps {
    children: ReactNode;
    edges?: ('top' | 'bottom')[];
}

export default function SafeScreenContainer({
    children,
    edges = ['top'],
}: SafeScreenContainerProps) {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const paddingTop = edges.includes('top') ? insets.top : 0;
    const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;

    return (
        <View
            style={{ flex: 1, paddingTop, paddingBottom, backgroundColor: theme.colors.background }}
        >
            {children}
        </View>
    );
}
