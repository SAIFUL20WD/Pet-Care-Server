import { initiatePayment, verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import User from "../user/user.model";
import Payment from "./payment.modal";

dotenv.config();

const subscribe = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "No user found");
    } else if (user.isPremiumUser === "yes") {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already subscribed");
    }

    const transactionId = `TXN-${Date.now()}`;

    const paymentData = {
        transactionId: transactionId,
        totalPrice: 100,
        custormerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    };

    const paymentSession = await initiatePayment(paymentData);

    const newPayment = await Payment.create({ userId: user._id, transcationId: transactionId, status: "pending" });
    if (!newPayment) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to payment");
    }

    return paymentSession;
};

const confirmationServiceForSubscription = async (transactionId: string, status: string) => {
    const verifyResponse = await verifyPayment(transactionId);
    let message = "";
    const link = process.env.CLIENT_URL;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const payment = await Payment.findOneAndUpdate({ transcationId: transactionId }, { status: "success" });
        if (!payment) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to payment");
        }

        const updatedUser = await User.findByIdAndUpdate(payment.userId, { isPremiumUser: "yes" });
        if (!updatedUser) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update user subscription");
        }
        message = "Your Payment is Successful!";
    } else {
        message = "Payment Failed!";
    }
    const filePath = join(__dirname, "../../../../public/confirmation.html");
    let template = readFileSync(filePath, "utf-8");
    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);
    return template;
};

const getAllPayments = async () => {
    const payments = await Payment.find({}).populate("userId");
    return payments;
};

export const paymentServices = {
    subscribe,
    confirmationServiceForSubscription,
    getAllPayments,
};
