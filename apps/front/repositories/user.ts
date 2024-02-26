import type { Role } from '@yggdra/shared';
import type { $Fetch, NitroFetchRequest } from 'nitropack';
import type { } from '@yggdra/shared';

export const userRepository = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({

    async login(email: string, password: string) {
        console.log('form', email, password);
        return fetch('/auth/login', {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });
    },
    async register(username: string, password: string) {
        return fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });
    },
    async logout() {
        return fetch('/auth/logout', {
            method: 'POST'
        });
    },
    async fetchProfile() {
        return fetch('/users/me', {
            credentials: "include",
        });
    },
    async updateProfile(profile: any) {
        return fetch('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profile)
        });
    },
    async changePassword(password: string) {
        return fetch('/auth/password', {
            method: 'PUT',
            body: JSON.stringify({
                password
            })
        });
    },
    async forgotPassword(email: string) {
        return fetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        });
    },
    async resetPassword(token: string, password: string) {
        return fetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                token,
                password
            })
        });
    },
    async verifyEmail(token: string) {
        return fetch('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({
                token
            })
        });
    },
    async resendEmailVerification() {
        return fetch('/auth/resend-verification', {
            method: 'POST'
        });
    },
    async getRoles() {
        return fetch<Role[]>('/auth/roles');
    }
})
