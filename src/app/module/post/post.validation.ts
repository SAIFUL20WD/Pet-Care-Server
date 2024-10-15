import { z } from "zod";

const voteValidationSchema = z.object({
    up: z.number().default(0),
    down: z.number().default(0),
});

const commentValidationSchema = z.object({
    userId: z.string(),
    detail: z.string(),
    replay: z.string().optional(),
});

const createPostValidationSchema = z.object({
    userId: z.string(),
    title: z.string(),
    content: z.string(),
    image: z.string(),
    category: z.string(),
    vote: voteValidationSchema.optional(),
    comment: commentValidationSchema.optional(),
    isPremium: z.string().default("no").optional(),
    status: z.string().optional(),
    tag: z.array(z.string()).optional(),
});

const updatePostValidationSchema = z.object({
    userId: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    vote: voteValidationSchema.optional(),
    comment: commentValidationSchema.optional(),
    isPremium: z.string().optional(),
    status: z.string().optional(),
    tag: z.array(z.string()).optional(),
});

export const postValidations = { createPostValidationSchema, updatePostValidationSchema };
