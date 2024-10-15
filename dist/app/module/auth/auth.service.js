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
exports.AuthServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_util_1 = __importDefault(require("./auth.util"));
const config_1 = __importDefault(require("../../config"));
const signUpUser = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.create(payLoad);
    return user;
});
const LoginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No user exists with given email");
    }
    const passwordMatched = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password does not match!");
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        address: user.address,
        isPremiumUser: user.isPremiumUser,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.default)(jwtPayload, config_1.default.jwtSecretKey, config_1.default.jwtExpiresIn);
    const refreshToken = (0, auth_util_1.default)(jwtPayload, config_1.default.jwtRefreshSecretKey, config_1.default.jwtRefreshExpiresIn);
    user.password = "";
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtRefreshSecretKey);
    const { email } = decoded;
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        address: user.address,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.default)(jwtPayload, config_1.default.jwtSecretKey, config_1.default.jwtExpiresIn);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    signUpUser,
    LoginUser,
    refreshToken,
};
