import { Types } from "mongoose";

export type TPayment = {
    userId: Types.ObjectId;
    transcationId: string;
    status: "success" | "pending" | "failed";
};
