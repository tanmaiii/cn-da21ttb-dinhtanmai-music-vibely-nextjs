import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PermissionsService from "../services/Permissions.service";
import {
  CreatePermissionsInput,
  DeletePermissionsInput,
  UpdatePermissionsInput,
} from "../schema/permissions.schema";

export const getAllPermissionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await PermissionsService.getPermissions();
    res
      .status(StatusCodes.OK)
      .json({ data: permissions, message: "Get roles successfully" });
  } catch (error) {
    next(error);
  }
};

export const createPermissionsHandler = async (
  req: Request<{}, {}, CreatePermissionsInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await PermissionsService.createPermission(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ data: permissions, message: "Create roles successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatePermissionsHandler = async (
  req: Request<
    UpdatePermissionsInput["params"],
    {},
    UpdatePermissionsInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissions = await PermissionsService.updatePermission(
      req.params.id,
      req.body
    );

    res
      .status(StatusCodes.OK)
      .json({ data: permissions, message: "Update roles successfully" });
  } catch (error) {
    next(error);
  }
};

export const deletePermissionsHandler = async (
  req: Request<DeletePermissionsInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await PermissionsService.deletePermission(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ message: "Delete roles successfully" });
  } catch (error) {
    next(error);
  }
};
