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
exports.paymentServices = void 0;
const payment_utils_1 = require("./payment.utils");
const fs_1 = require("fs");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../user/user.model"));
const payment_modal_1 = __importDefault(require("./payment.modal"));
dotenv_1.default.config();
const subscribe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No user found");
    }
    else if (user.isPremiumUser === "yes") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already subscribed");
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
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    const newPayment = yield payment_modal_1.default.create({ userId: user._id, transcationId: transactionId, status: "pending" });
    if (!newPayment) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to payment");
    }
    return paymentSession;
});
const confirmationServiceForSubscription = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let message = "";
    const link = process.env.CLIENT_URL;
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        const payment = yield payment_modal_1.default.findOneAndUpdate({ transcationId: transactionId }, { status: "success" });
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to payment");
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(payment.userId, { isPremiumUser: "yes" });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update user subscription");
        }
        message = "Your Payment is Successful!";
    }
    else {
        message = "Payment Failed!";
    }
    const filePath = (0, path_1.join)(__dirname, "../../../../public/confirmation.html");
    let template = (0, fs_1.readFileSync)(filePath, "utf-8");
    template = template.replace("{{message}}", message);
    template = template.replace("{{link}}", `${link}`);
    return template;
});
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_modal_1.default.find({}).populate("userId");
    return payments;
});
exports.paymentServices = {
    subscribe,
    confirmationServiceForSubscription,
    getAllPayments,
};
