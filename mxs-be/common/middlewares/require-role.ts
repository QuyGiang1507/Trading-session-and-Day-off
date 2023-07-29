import { Request, Response, NextFunction } from "express";
import { NotPermittedError } from "../errors/not-permitted-error";
import { userSession } from "../services/userSession";

export const requireRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.currentUser) {
  //     throw new NotPermittedError();
  // }

  // Get roles
  let roleKey = `${req.method}${req.route.path}`;
  roleKey = roleKey.replace(/\//g, "_").replace(/_:\w+/g, "").toUpperCase();
  req["roleKey"] = roleKey;
  // //console.log(roleKey);
  // if (!await userSession.validateRole(req, roleKey)){
  //     throw new NotPermittedError();
  // }
  next();
};
