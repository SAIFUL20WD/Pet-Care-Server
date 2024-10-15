import express from "express";
import auth from "../../middleware/auth";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get("/", auth(true), UserControllers.getAllUser);

router.get("/me", auth(false), UserControllers.getUser);

router.get("/me/follow", auth(false), UserControllers.getUserFollow);

router.put(
    "/me/:id",
    // auth(false),
    validateRequest(userValidations.updateUserValidationSchema),
    UserControllers.updateUser,
);

router.put("/:id", auth(true), UserControllers.updateUserById);

router.delete("/:id", auth(true), UserControllers.deleteUser);

router.patch("/:id/follow", UserControllers.followUser);

export const UserRoutes = router;
