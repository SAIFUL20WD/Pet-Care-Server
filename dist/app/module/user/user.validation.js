"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(50, { message: "Name can not be more than 20 characters" }),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be minimum 8 characters" })
        .max(32, { message: "Password can not be more than 20 characters" }),
    image: zod_1.z.string().optional(),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" }),
    address: zod_1.z.string(),
    bio: zod_1.z.string().optional(),
    following: zod_1.z.array(zod_1.z.string()).optional(),
    follower: zod_1.z.array(zod_1.z.string()).optional(),
    isPremiumUser: zod_1.z.boolean().optional(),
    role: zod_1.z.enum(["admin", "user"]).optional(),
});
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, { message: "Name must must be minimum 3 characters" })
        .max(50, { message: "Name can not be more than 20 characters" })
        .optional(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be minimum 8 characters" })
        .max(32, { message: "Password can not be more than 20 characters" })
        .optional(),
    image: zod_1.z.string().optional(),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, { message: "Phone number must be minimum 10 characters" })
        .max(15, { message: "Phone number not be more than 15 characters" })
        .optional(),
    address: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    following: zod_1.z.array(zod_1.z.string()).optional(),
    follower: zod_1.z.array(zod_1.z.string()).optional(),
    isPremiumUser: zod_1.z.boolean().optional(),
    role: zod_1.z.enum(["admin", "user"]).optional(),
});
exports.userValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
