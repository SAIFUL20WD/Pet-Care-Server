"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(true), user_controller_1.UserControllers.getAllUser);
router.get("/me", (0, auth_1.default)(false), user_controller_1.UserControllers.getUser);
router.get("/me/follow", (0, auth_1.default)(false), user_controller_1.UserControllers.getUserFollow);
router.put("/me/:id", 
// auth(false),
(0, validateRequest_1.default)(user_validation_1.userValidations.updateUserValidationSchema), user_controller_1.UserControllers.updateUser);
router.put("/:id", (0, auth_1.default)(true), user_controller_1.UserControllers.updateUserById);
router.delete("/:id", (0, auth_1.default)(true), user_controller_1.UserControllers.deleteUser);
router.patch("/:id/follow", user_controller_1.UserControllers.followUser);
exports.UserRoutes = router;
