import ApiService from "@/lib/network"
import type { Tokens, User } from "@/types/authorization"
import { z } from "zod"

export interface SignInResponseType {
    tokens?: Tokens,
    user?: User
    sessionId?: string
    error?: {
        field?: string
        message?: string
    }
}
export async function signIn(data: SignInSchema) {
    return ApiService.fetchData<SignInResponseType>({
        url: (data.checkEmail ? '/authorization/check-email' : '/authorization/sign-in'),
        method: 'post',
        data
    })
}

export const signInSchema = z.object({
    email: z.string().min(1, { message: 'Please enter your email or username' }),
    password: z.string().optional(),
    checkEmail: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (!data.checkEmail && !data.password?.trim()) {
        ctx.addIssue({
            code: 'custom',
            message: 'Please enter your password',
            path: ['password'],
        })
    }
})

export type SignInSchema = z.infer<typeof signInSchema>