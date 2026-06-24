import httpStatus from "http-status";
import { Request, Response } from "express";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user registerd",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: true,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register",
      error:(error as Error).message
    });
  }
};

export const userController = {
  registerUser,
};
