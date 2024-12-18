import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PermissionsService from "../services/Permissions.service";

export const getAllHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await PermissionsService.getPermissions();
    res.status(StatusCodes.OK).json({ data:permissions, message: "Get roles successfully" });
  } catch (error) {
    next(error);
  }
};