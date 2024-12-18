import { NextFunction, Request, Response } from "express";
import RoleService from "../services/Role.service";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

export const getAllRolesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await RoleService.getRoles();
    res
      .status(StatusCodes.OK)
      .json({ data: roles, message: "Get roles successfully" });
  } catch (error) {
    next(error);
  }
};

export const createRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.createRole(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ data: role, message: "Create role successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);

    if (!role) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");
    }

    await RoleService.updateRole(req.params.id, req.body);

    const newRole = await RoleService.getRoleById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: newRole, message: "Update role successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);

    if (!role) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");
    }

    await role.destroy();

    res.status(StatusCodes.OK).json({ message: "Delete role successfully" });
  } catch (error) {
    next(error);
  }
};
