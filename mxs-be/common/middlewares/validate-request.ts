import _ from "lodash";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // remove the fields that are not allowed to be updated from the user side
  req.body = _.omit(req.body, [
    "createdTime",
    "lastModifiedTime",
    "createdBy",
    "lastModifiedBy",
    "createdAt",
    "updatedAt",
    "version",
  ]);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
