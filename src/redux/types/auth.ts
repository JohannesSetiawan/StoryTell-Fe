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
    userId: string
    username: string
    description: string
}