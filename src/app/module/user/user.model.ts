import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<TUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: {
            type: String,
            default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        bio: { type: String, default: "404 bio not found" },
        following: { type: [Schema.Types.ObjectId], ref: "user" },
        follower: { type: [Schema.Types.ObjectId], ref: "user" },
        isPremiumUser: { type: String, default: "no" },
        role: {
            type: String,
            enum: ["admin", "user"],
            // required: true,
            default: "user",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    },
);

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, Number(config.saltRound));
    next();
});

const User = model<TUser>("user", userSchema);

export default User;
