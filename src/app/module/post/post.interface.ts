import { Types } from "mongoose";

export type TVote = {
    // userId: Types.ObjectId;
    up: number;
    down: number;
};

export type TComment = {
    userId: Types.ObjectId;
    detail: string;
    reply: Types.ObjectId;
};

export type TPost = {
    userId: Types.ObjectId;
    title: string;
    content: string;
    image: string;
    category: string;
    vote: TVote;
    comment: TComment[];
    isPremium: string;
    status: string;
    tag: string[];
    // readTime?: number;
};
