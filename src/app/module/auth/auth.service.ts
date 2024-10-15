import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "../user/user.interface";
import User from "../user/user.model";
import bcrypt from "bcrypt";
import createToken from "./auth.util";
import config from "../../config";

const signUpUser = async (payLoad: TUser) => {
    const user = await User.create(payLoad);
    return user;
};

const LoginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "No user exists with given email");
    }

    const passwordMatched = await bcrypt.compare(password, user?.password);
    if (!passwordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, "Password does not match!");
    }

    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        address: user.address,
        isPremiumUser: user.isPremiumUser,
        role: user.role,
    };

    const accessToken = createToken(jwtPayload, config.jwtSecretKey as string, config.jwtExpiresIn as string);
    const refreshToken = createToken(
        jwtPayload,
        config.jwtRefreshSecretKey as string,
        config.jwtRefreshExpiresIn as string,
    );

    user.password = "";

    return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(token, config.jwtRefreshSecretKey as string) as JwtPayload;

    const { email } = decoded;

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        address: user.address,
        role: user.role,
    };

    const accessToken = createToken(jwtPayload, config.jwtSecretKey as string, config.jwtExpiresIn as string);

    return {
        accessToken,
    };
};

export const AuthServices = {
    signUpUser,
    LoginUser,
    refreshToken,
};
