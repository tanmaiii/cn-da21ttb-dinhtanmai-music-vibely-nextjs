import { NextFunction, Request, Response } from "express";
import RoleService from "../services/Role.service";
import { StatusCodes } from "http-status-codes";

export const getAllRolesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await RoleService.getRoles();
    res.status(StatusCodes.OK).json({ data: roles, message: "Get roles successfully" });
  } catch (error) {
    next(error);
  }
};
