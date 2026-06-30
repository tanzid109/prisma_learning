import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../../utils/jwt";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user registered successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { accessToken } = req.cookies;

    // const verifiedToken = jwtUtils.verifyToken(
    //   accessToken,
    //   config.jwt_access_secret as string,
    // );

    // if (typeof verifiedToken === "string") {
    //   throw new Error(verifiedToken);
    // }

    const profile = await userService.getMyProfileFromDB(
      req.user?.id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrived Successfully",
      data: profile,
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;
    const updatedProfile = await userService.updateMyProfileInDB(
      userId,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user updated successfully",
      data: { updatedProfile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
