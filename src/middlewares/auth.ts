import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { jwtUtils } from "../../utils/jwt";
import config from "../config";
import { sendResponse } from "../../utils/sendResponse";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: string;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error("You are not logged in.please logged in");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }
    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (!requiredRoles.includes(role)) {
      sendResponse(res, {
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden,You don't have permission",
        data: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id, name, email, role },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.activeStatus === "INACTIVE") {
      throw new Error("Your account is blocked.please contact support");
    }

    req.user = {
      name,
      email,
      id,
      role,
    };
    next();
  });
};
