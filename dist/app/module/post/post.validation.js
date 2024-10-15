"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidations = void 0;
const zod_1 = require("zod");
const voteValidationSchema = zod_1.z.object({
    up: zod_1.z.number().default(0),
    down: zod_1.z.number().default(0),
});
const commentValidationSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    detail: zod_1.z.string(),
    replay: zod_1.z.string().optional(),
});
const createPostValidationSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    image: zod_1.z.string(),
    category: zod_1.z.string(),
    vote: voteValidationSchema.optional(),
    comment: commentValidationSchema.optional(),
    isPremium: zod_1.z.string().default("no").optional(),
    status: zod_1.z.string().optional(),
    tag: zod_1.z.array(zod_1.z.string()).optional(),
});
const updatePostValidationSchema = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    vote: voteValidationSchema.optional(),
    comment: commentValidationSchema.optional(),
    isPremium: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    tag: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.postValidations = { createPostValidationSchema, updatePostValidationSchema };
