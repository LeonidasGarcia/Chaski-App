import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { migrateDbIfNeeded } from '@/db/database';
import { createUserProfileRepository } from '@/db/repositories/userProfileRepository';
import { createRunsRepository } from '@/db/repositories/runsRepository';
import { createChallengesRepository } from '@/db/repositories/challengesRepository';

interface DatabaseContextValue {
    userProfile: ReturnType<typeof createUserProfileRepository>;
    runs: ReturnType<typeof createRunsRepository>;
    challenges: ReturnType<typeof createChallengesRepository>;
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

function DatabaseProviderInner({ children }: { children: ReactNode }) {
    const db = useSQLiteContext();
    const value = useMemo<DatabaseContextValue>(
        () => ({
            userProfile: createUserProfileRepository(db),
            runs: createRunsRepository(db),
            challenges: createChallengesRepository(db),
        }),
        [db],
    );
    return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
    return (
        <SQLiteProvider databaseName="chaski.db" onInit={migrateDbIfNeeded}>
            <DatabaseProviderInner>{children}</DatabaseProviderInner>
        </SQLiteProvider>
    );
}

export function useDatabaseContext(): DatabaseContextValue {
    const ctx = useContext(DatabaseContext);
    if (!ctx) throw new Error('useDatabaseContext must be used within DatabaseProvider');
    return ctx;
}
