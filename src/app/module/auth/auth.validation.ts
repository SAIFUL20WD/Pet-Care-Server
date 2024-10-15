import { z } from "zod";

const loginValidationSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: "Refresh token is required!",
        }),
    }),
});

export const authValidations = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
