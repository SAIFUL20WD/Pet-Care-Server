"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "user" },
    transcationId: { type: String, required: true },
    status: { type: String, enum: ["success", "pending", "failed"] },
}, { timestamps: true, versionKey: false });
const Payment = (0, mongoose_1.model)("payment", postSchema);
exports.default = Payment;
