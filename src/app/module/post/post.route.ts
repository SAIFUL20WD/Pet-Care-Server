import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { postValidations } from "./post.validation";
import { PostControllers } from "./post.controller";

const router = express.Router();

router.post("/", auth(false), validateRequest(postValidations.createPostValidationSchema), PostControllers.createPost);

router.get("/", PostControllers.getAllPost);

router.get("/get-user-post", auth(false), PostControllers.getPostsByUser);

router.get("/:id", PostControllers.getPostById);

router.put(
    "/:id",
    auth(false),
    validateRequest(postValidations.updatePostValidationSchema),
    PostControllers.updatePost,
);

router.delete("/:id", /*auth(false),*/ PostControllers.deletePost);

router.patch("/:id/comment", PostControllers.createComment);

router.patch("/:id/vote", PostControllers.vote);

router.patch("/status/:id", PostControllers.postStatusChange);

export const PostRoutes = router;
