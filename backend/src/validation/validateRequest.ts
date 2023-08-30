import type { NextFunction, Request, Response } from "express";

import { BAD_REQUEST } from "../errors/errorCodes";
import { ajv } from "../initialize/initializeRoutes";

export function validateSchema(schema: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.getSchema(schema);

    if (validate == null) return next();

    if (validate(req.body)) {
      console.log("No Errors");
      return next();
    }

    console.log(validate.errors);
    return res.status(BAD_REQUEST).send(validate.errors);
  };
}
