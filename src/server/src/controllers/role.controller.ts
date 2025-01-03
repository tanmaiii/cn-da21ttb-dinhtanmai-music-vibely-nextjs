import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateRoleInput,
  DeleteRoleInput,
  GetRoleInput,
  UpdateRoleInput,
} from "../schema/role.schema";
import RoleService from "../services/Role.service";
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

export const getRoleByIdHandler = async (
  req: Request<GetRoleInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);

    if (!role) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");
    }

    res.status(StatusCodes.OK).json({ data: role });
  } catch (error) {
    next(error);
  }
};

export const createRoleHandler = async (
  req: Request<{}, {}, CreateRoleInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.createRole({
      name: req.body.name,
    });

    const PermissionsIs = req.body.permissions;

    if (PermissionsIs) {
      await RoleService.addPermissionToRole(role.id, PermissionsIs);
    }

    const roleNew = await RoleService.getRoleById(role.id);

    res
      .status(StatusCodes.CREATED)
      .json({ data: roleNew, message: "Create role successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateRoleHandler = async (
  req: Request<UpdateRoleInput["params"], {}, UpdateRoleInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);

    if (!role) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Role not found");
    }

    await RoleService.updateRole(req.params.id, {
      name: req.body.name,
    });

    const PermissionsIs = req.body.permissions;

    if (PermissionsIs && PermissionsIs?.length > 0) {
      await RoleService.updatePermissionToRole(req.params.id, PermissionsIs);
    }

    const newRole = await RoleService.getRoleById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: newRole, message: "Update role successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteRoleHandler = async (
  req: Request<DeleteRoleInput["params"], {}, {}>,
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
