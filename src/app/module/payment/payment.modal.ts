import { Schema, model } from "mongoose";
import { TPayment } from "./payment.interface";

const postSchema = new Schema<TPayment>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
        transcationId: { type: String, required: true },
        status: { type: String, enum: ["success", "pending", "failed"] },
    },
    { timestamps: true, versionKey: false },
);

const Payment = model<TPayment>("payment", postSchema);

export default Payment;
