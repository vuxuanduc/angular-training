export interface Role {
    id?: number,
    name_role: string
}
export interface User {
    id?:number,
    name: string,
    email: string,
    status: string,
    created_at: string,
    updated_at: string,
    role_id: number,
    role: Role
}