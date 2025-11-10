export type LoginRequest = {
    username: string
    password: string
}

export type RegisterRequest = LoginRequest

export type LoginResponse = {
    token: string,
    user: string
}

export type RegisterResponse = LoginResponse

export type UserInfoResponse = {
    id: string
    username: string
    description?: string
    dateCreated: Date
    isAdmin: boolean
}