import { Schema, model } from "mongoose";
import { TComment, TPost, TVote } from "./post.interface";

const voteSchema = new Schema<TVote>({
    // userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
});

const commentSchema = new Schema<TComment>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    detail: { type: String, required: true },
    reply: { type: Schema.Types.ObjectId },
});

const postSchema = new Schema<TPost>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
        title: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        vote: voteSchema,
        comment: [commentSchema],
        isPremium: { type: String, default: "no" },
        status: { type: String, default: "published" },
        tag: { type: [String] },
    },
    { timestamps: true, versionKey: false },
);

const Post = model<TPost>("post", postSchema);

export default Post;
