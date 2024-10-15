"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const voteSchema = new mongoose_1.Schema({
    // userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
});
const commentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    detail: { type: String, required: true },
    reply: { type: mongoose_1.Schema.Types.ObjectId },
});
const postSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    vote: voteSchema,
    comment: [commentSchema],
    isPremium: { type: String, default: "no" },
    status: { type: String, default: "published" },
    tag: { type: [String] },
}, { timestamps: true, versionKey: false });
const Post = (0, mongoose_1.model)("post", postSchema);
exports.default = Post;
