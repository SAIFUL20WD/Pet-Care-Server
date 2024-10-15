import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";
import { authValidations } from "./auth.validation";

const router = express.Router();

router.post("/register", validateRequest(userValidations.createUserValidationSchema), AuthControllers.signUpUser);

router.post("/login", validateRequest(authValidations.loginValidationSchema), AuthControllers.loginUser);

router.post(
    "/refresh-token",
    validateRequest(authValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.post("/password-recovery" /* Controller */);

export const AuthRoutes = router;
