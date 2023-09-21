import type { ValidateFunction } from "ajv";
import type { NextFunction, Request, Response } from "express";

import { BAD_REQUEST } from "../errors/errorCodes.js";

export function validateSchema<T>(validateFunction: ValidateFunction<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (validateFunction(req.body)) return next();

    const errors: Record<string, string[]> = {};
    validateFunction.errors?.forEach(error => {
      if (error.message == null) return;

      const key = error.instancePath.slice(1) || "additionalErrors";
      errors[key] = errors[key] == null ? [error.message] : [...errors[key], error.message];
    });

    return res.status(BAD_REQUEST).json({ errors });
  };
}
