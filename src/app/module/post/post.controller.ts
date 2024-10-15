import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
    const result = await PostServices.createPostIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post created successfully",
        data: result,
    });
});

const getAllPost = catchAsync(async (req, res) => {
    // const name = req?.query?.name as string;
    // const brands = req?.query?.brands as string;
    // const models = req?.query?.models as string;
    // const availabilty = req?.query?.availabilty as string;

    const offset = req?.query?.offset as string;
    const limit = req?.query?.limit as string;
    const category = req?.query?.category ? (req?.query?.category as string) : "";
    const title = req?.query?.title ? (req?.query?.title as string) : "";
    const vote = req?.query?.vote ? (req?.query?.vote as string) : "";
    if (offset || limit || category || title) {
        const result = await PostServices.getPostsByQueryFromDB(offset, limit, category, title, vote);
        if (result.length === 0) {
            sendResponse(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "No product found!",
                data: result,
            });
        } else {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: `Post matching filter term fetched successfully!`,
                data: result,
            });
        }
    } else {
        const result = await PostServices.getAllPostFromDB();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Posts retrieved successfully",
            data: result,
        });
    }
});

const getPostsByUser = catchAsync(async (req, res) => {
    const { _id: userId } = req.user;
    const result = await PostServices.getPostByUserIdFromDB(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User posts retrieved successfully`,
        data: result,
    });
});

const getPostById = catchAsync(async (req, res) => {
    const result = await PostServices.getPostByIdFromDB(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Single post retrieved successfully",
        data: result,
    });
});

const updatePost = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PostServices.updatePostIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post updated successfully",
        data: result,
    });
});

const deletePost = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await PostServices.deletePostFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post deleted successfully",
        data: result,
    });
});

const createComment = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await PostServices.createCommentIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});

const vote = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await PostServices.vote(id, req.body.vote);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Vote added successfully",
        data: result,
    });
});

const postStatusChange = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await PostServices.postStatusChange(id, req.body.status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Post Status changed successfully",
        data: result,
    });
});

export const PostControllers = {
    createPost,
    getAllPost,
    getPostsByUser,
    getPostById,
    updatePost,
    deletePost,
    createComment,
    vote,
    postStatusChange,
};
