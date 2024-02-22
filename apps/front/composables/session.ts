import { useState, computed, useRequestFetch } from '#imports'
import type { UserSession, UserSessionComposable } from '@/types/session'

const useSessionState = () => useState<UserSession>('nuxt-session', () => ({}))

export function useUserSession(): UserSessionComposable {
    const sessionState = useSessionState()
    return {
        loggedIn: computed(() => Boolean(sessionState.value.user)),
        user: computed(() => sessionState.value.user || null),
        session: sessionState,
        fetch,
        clear
    }
}

async function fetch() {
    useSessionState().value = {}
}

async function clear() {
    useSessionState().value = {}
}