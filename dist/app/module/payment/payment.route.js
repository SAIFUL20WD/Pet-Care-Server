"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.get("/subscribe", payment_controller_1.paymentController.subscribe);
router.post("/subscription/confirmation", payment_controller_1.paymentController.confirmationControllerForSubscription);
router.get("/", payment_controller_1.paymentController.getAllPayments);
exports.paymentRoutes = router;
