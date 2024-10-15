import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import User from "./user.model";

const getAllUserFromDB = async () => {
    const users = await User.find();
    return users;
};

const getUserFromDB = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateUserIntoDB = async (userId: string, payLoad: Partial<TUser>) => {
    const user = await User.findByIdAndUpdate(userId, payLoad, { new: true });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateUserByIdIntoDB = async (userId: string, payLoad: Partial<TUser>) => {
    const user = await User.findByIdAndUpdate(userId, payLoad, { new: true });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const deleteUserFromDB = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const getUserFollowFromDB = async (userId: string) => {
    const user = await User.findById(userId).populate("follower").populate("following");
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const followUser = async (userId: any, followId: any) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const followedUser = await User.findById(followId);
    if (!followedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User to follow not found");
    }

    // Check if already following
    if (user.following.includes(followId)) {
        throw new AppError(httpStatus.CONFLICT, "Already following this user");
    }

    // Add to following and follower lists
    user.following.push(followId);
    followedUser.follower.push(userId);

    // Save both users
    await Promise.all([user.save(), followedUser.save()]);

    return user;
};

export const UserServices = {
    getAllUserFromDB,
    getUserFromDB,
    updateUserIntoDB,
    updateUserByIdIntoDB,
    deleteUserFromDB,
    getUserFollowFromDB,
    followUser,
};
