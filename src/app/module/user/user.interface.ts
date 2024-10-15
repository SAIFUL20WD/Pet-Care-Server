import { Types } from "mongoose";

export type TUser = {
    name: string;
    email: string;
    password: string;
    image: string;
    phone: string;
    address: string;
    bio: string;
    following: Types.ObjectId[];
    follower: Types.ObjectId[];
    isPremiumUser: string;
    role: "admin" | "user";
};
