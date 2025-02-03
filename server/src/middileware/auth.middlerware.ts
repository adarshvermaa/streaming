import { IncomingHttpHeaders } from "http";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { ERROR } from "../constant/errorHandler/errorManagement";
import { errorHandler } from "./errorHandler";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    workspaceId?: string;
  }
}

export const authrization = async (
  req: Request & { headers: IncomingHttpHeaders },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res
        .status(401)
        .send({ message: ERROR.UNAUTHORIZED, status: false, code: 401 });
      return;
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY) as {
      [key: string]: any;
    };
    if (!decoded) {
      res
        .status(401)
        .send({ message: ERROR.UNAUTHORIZED, status: false, code: 401 });
      return;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp > decoded.exp) {
      res
        .status(400)
        .send({ message: ERROR.TOKEN_EXPIRED, status: false, code: 400 });
      return;
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    next(error);
  }
};
export const isBlongToWorkspace = async (
  req: Request & { headers: IncomingHttpHeaders },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workspaceId = req.headers["workspace-id"];
    if (workspaceId) {
      req.workspaceId = Array.isArray(workspaceId)
        ? workspaceId[0]
        : workspaceId;
      next();
    } else {
      res
        .status(401)
        .send({ message: ERROR.UNAUTHORIZED, status: false, code: 401 });
    }
  } catch (error) {
    next(error);
  }
};
