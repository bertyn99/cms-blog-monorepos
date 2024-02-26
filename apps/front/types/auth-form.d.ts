import type { Role } from "@yggdra/shared";

export type fieldType = {
    label: string;
    type: string;
    placeholder: string;
}[];

declare module '#auth-utils' {
    interface User {
        // Add your own fields
        fullName: string | null
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }

    interface UserSession {
        // Add your own fields
    }
}

export { }