export const ACTIVESTATUS = ['Inactive', 'Active'] as const
export const AUTHORIZED_USERS = ['admin', 'super']
export const ROLE = [...AUTHORIZED_USERS, 'user'] as const
export const SALTROUNDS = 10