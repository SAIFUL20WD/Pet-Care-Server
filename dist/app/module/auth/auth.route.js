"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.userValidations.createUserValidationSchema), auth_controller_1.AuthControllers.signUpUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.authValidations.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.authValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
router.post("/password-recovery" /* Controller */);
exports.AuthRoutes = router;
