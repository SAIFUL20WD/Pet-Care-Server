"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = __importDefault(require("./post.model"));
const createPostIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.create(payLoad);
    return post;
});
const getAllPostFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.default.find().populate("userId").exec();
    return posts;
});
const getPostsByQueryFromDB = (offset, limit, category, title, vote) => __awaiter(void 0, void 0, void 0, function* () {
    if ((offset || limit) && title) {
        const result = yield post_model_1.default.find({ title: new RegExp(title, "i"), status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate("userId", "name email image isPremiumUser");
        return result;
    }
    else if ((offset || limit) && category) {
        const result = post_model_1.default.find({ category: category, status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .populate("userId", "name email image isPremiumUser");
        return result;
    }
    else if ((offset || limit) && vote) {
        const sortBy = `vote.${vote}`;
        const result = post_model_1.default.find({ status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            .sort({ [sortBy]: -1 })
            .populate("userId", "name email image isPremiumUser");
        return result;
    }
    else if (offset || limit) {
        const result = post_model_1.default.find({ status: "published" })
            .skip(Number(offset))
            .limit(Number(limit))
            // .sort({ "vote.up": -1, "vote.down": 1 })
            .populate("userId", "name email image isPremiumUser");
        return result;
    }
    else {
        const result = yield post_model_1.default.find({});
        return result;
    }
});
const getPostByUserIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.find({ userId: id }).populate("userId", "name email image isPremiumUser");
    return post;
});
const getPostByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findById(id)
        .populate("userId", "name email image isPremiumUser")
        .populate("comment.userId");
    return post;
});
const updatePostIntoDB = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findByIdAndUpdate(id, payLoad, { new: true });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return post;
});
const deletePostFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findByIdAndDelete(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return post;
});
const createCommentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findById(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    const alreadyCommented = post.comment.find((item) => item.userId.toString() === payload.userId.toString());
    if (alreadyCommented) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Already Commented");
    }
    post.comment.push(payload);
    yield post.save();
    return post;
});
const vote = (id, vote) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findById(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    if (!post.vote) {
        post.vote = { up: 0, down: 0 };
    }
    if (vote === "up") {
        post.vote.up += 1;
    }
    else if (vote === "down") {
        post.vote.down += 1;
    }
    yield post.save();
    return post;
});
const postStatusChange = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findByIdAndUpdate(id, { status: status });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    return post;
});
exports.PostServices = {
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
