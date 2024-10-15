import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TComment, TPost } from "./post.interface";
import Post from "./post.model";

const createPostIntoDB = async (payLoad: TPost) => {
    const post = await Post.create(payLoad);
    return post;
};

const getAllPostFromDB = async () => {
    const posts = await Post.find().populate("userId").exec();
    return posts;
};

const getPostsByQueryFromDB = async (offset: string, limit: string, category: string, title: string, vote: string) => {
    if ((offset || limit) && title) {
        const result = await Post.find({ title: new RegExp(title, "i"), status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate("userId", "name email image isPremiumUser");
        return result;
    } else if ((offset || limit) && category) {
        const result = Post.find({ category: category, status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate("userId", "name email image isPremiumUser");
        return result;
    } else if ((offset || limit) && vote) {
        const sortBy = `vote.${vote}`;
        const result = Post.find({ status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .sort({ [sortBy]: -1 })
            .populate("userId", "name email image isPremiumUser");
        return result;
    } else if (offset || limit) {
        const result = Post.find({ status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            // .sort({ "vote.up": -1, "vote.down": 1 })
            .populate("userId", "name email image isPremiumUser");
        return result;
    } else {
        const result = await Post.find({});
        return result;
    }
};

const getPostByUserIdFromDB = async (id: string) => {
    const post = await Post.find({ userId: id }).populate("userId", "name email image isPremiumUser");
    return post;
};

const getPostByIdFromDB = async (id: string) => {
    const post = await Post.findById(id)
        .populate("userId", "name email image isPremiumUser")
        .populate("comment.userId");
    return post;
};

const updatePostIntoDB = async (id: string, payLoad: Partial<TPost>) => {
    const post = await Post.findByIdAndUpdate(id, payLoad, { new: true });

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post;
};

const deletePostFromDB = async (id: string) => {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post;
};

const createCommentIntoDB = async (id: string, payload: TComment) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    const alreadyCommented = post.comment.find((item) => item.userId.toString() === payload.userId.toString());
    if (alreadyCommented) {
        throw new AppError(httpStatus.CONFLICT, "Already Commented");
    }

    post.comment.push(payload);
    await post.save();

    return post;
};

const vote = async (id: string, vote: string) => {
    const post = await Post.findById(id);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    if (!post.vote) {
        post.vote = { up: 0, down: 0 };
    }

    if (vote === "up") {
        post.vote.up += 1;
    } else if (vote === "down") {
        post.vote.down += 1;
    }

    await post.save();

    return post;
};

const postStatusChange = async (id: string, status: string) => {
    const post = await Post.findByIdAndUpdate(id, { status: status });

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    return post;
};

export const PostServices = {
    createPostIntoDB,
    getAllPostFromDB,
    getPostsByQueryFromDB,
    getPostByUserIdFromDB,
    getPostByIdFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    createCommentIntoDB,
    vote,
    postStatusChange,
};
