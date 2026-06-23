export const typography = {
    presets: {
        display: {
            fontFamily: 'Rubik_900Black',
            fontSize: 56,
            lineHeight: 60,
            letterSpacing: -1.5,
            fontVariant: ['tabular-nums'] as 'tabular-nums'[],
        },
        h1: {
            fontFamily: 'Rubik_700Bold',
            fontSize: 28,
            lineHeight: 34,
            letterSpacing: -0.5,
        },
        h2: {
            fontFamily: 'Rubik_700Bold',
            fontSize: 20,
            lineHeight: 26,
            letterSpacing: -0.2,
        },
        h3: {
            fontFamily: 'PlusJakartaSans_600SemiBold',
            fontSize: 16,
            lineHeight: 22,
            letterSpacing: 0,
        },
        body: {
            fontFamily: 'PlusJakartaSans_400Regular',
            fontSize: 14,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        button: {
            fontFamily: 'PlusJakartaSans_600SemiBold',
            fontSize: 15,
            lineHeight: 20,
            letterSpacing: 0.5,
            textTransform: 'uppercase' as const,
        },
        caption: {
            fontFamily: 'PlusJakartaSans_500Medium',
            fontSize: 12,
            lineHeight: 16,
            letterSpacing: 0.2,
        },
    },
};
