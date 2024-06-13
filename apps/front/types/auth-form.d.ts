import type { Role } from "@yggdra/shared";

export type fieldType = {
  label: string;
  type: string;
  placeholder: string;
}[];

export interface User {
  id: string;
  fullName: string | null;
  email: string;
  roleAccess: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user?: User;
}

export interface UserSessionComposable {
  loggedIn: ComputedRef<boolean>;
  user: ComputedRef<User | null>;
  session: Ref<UserSession>;
  fetch: () => Promise<void>;
  clear: () => Promise<void>;
}
