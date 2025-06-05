export const ValidRoles = {
  admin: 'admin',
  superUser: 'super-user',
  user: 'user',
} as const;

export type ValidRole = (typeof ValidRoles)[keyof typeof ValidRoles];
