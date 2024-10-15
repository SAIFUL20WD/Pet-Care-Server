import express from "express";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.get("/subscribe", paymentController.subscribe);

router.post("/subscription/confirmation", paymentController.confirmationControllerForSubscription);

router.get("/", paymentController.getAllPayments);

export const paymentRoutes = router;
