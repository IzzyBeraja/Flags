import type { NextFunction, Request, Response } from "express";

import { BAD_REQUEST } from "../errors/errorCodes.js";
import { ajv } from "../initialize/initializeRoutes.js";

export function validateSchema(schema: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.getSchema(schema);

    if (validate == null || validate(req.body)) return next();

    const errors: Record<string, string[]> = {};
    validate.errors?.forEach(error => {
      if (error.message == null) return;

      const key = error.instancePath.slice(1) || "additionalErrors";
      errors[key] = errors[key] == null ? [error.message] : [...errors[key], error.message];
    });

    return res.status(BAD_REQUEST).send({ errors });
  };
}
