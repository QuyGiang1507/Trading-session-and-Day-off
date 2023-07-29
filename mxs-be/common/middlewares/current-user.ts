import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userSession } from "../services/userSession";

interface UserPayload {
  id: string;
  email: string;
  sessionId: string;
  verifyPIN: boolean;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = null;

  if (!token && req.session?.jwt) {
    token = req.session.jwt;
  }

  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;

    if (payload && payload.id) {
      if (await userSession.validate(payload)) req.currentUser = payload;
    }
  } catch (err) {}

  next();
};
