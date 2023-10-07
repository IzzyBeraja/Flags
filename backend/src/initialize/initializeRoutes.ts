import type { ResultAsync } from "../types/types";
import type { JSONSchemaType } from "ajv";
import type { RequestHandler } from "express";

import { validateSchema } from "../validation/validateRequest";

import Ajv from "ajv";
import allowErrorMessages from "ajv-errors";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const validMethods = ["Get", "Post", "Put", "Patch", "Delete"] as const;
export type Method = (typeof validMethods)[number];

export const allRoutes = new Map<string, RouteMetadata>();

type RouteSchema = JSONSchemaType<unknown> | undefined;

type RouteFunctions<T, Name extends string = ""> = {
  [key in Method as `${key}${Name}`]?: T | undefined;
};

export type RouteModule = RouteFunctions<RouteSchema, "RequestSchema"> &
  RouteFunctions<RouteSchema, "ResponseSchema"> &
  RouteFunctions<RequestHandler>;

export type RouteDetails = {
  method: Lowercase<Method>;
  requestSchema?: RouteSchema | undefined;
  responseSchema?: RouteSchema | undefined;
  route: RequestHandler;
};

type RouteMetadata = {
  method: Lowercase<Method>;
  hasRequestSchema: boolean;
  hasResponseSchema: boolean;
  routePath: string;
};

type NewRouteData = {
  routePath: string;
  routeDetails: RouteDetails[];
};

export type RouteError = {
  message: string;
  routePath: string;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const routesDirectory = path.resolve(currentDir, "../routes");

async function buildRoutes(
  expressRouter: Router,
  ajv: Ajv,
  cwd: string,
  errors: Array<RouteError>
): Promise<void> {
  const files = fs.readdirSync(cwd);

  for (const file of files) {
    const fullPath = path.join(cwd, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await buildRoutes(expressRouter, ajv, fullPath, errors);
      continue;
    }

    if (!file.endsWith(".routes.js")) {
      continue;
    }

    const routeName = file.replace(".routes.js", "");

    // Example: /api/Auth/login
    const routePath = `/${path
      .relative(routesDirectory, cwd)
      .replace(/\\/g, "/")}/${routeName}`.replace(/\/$/, "");

    const routeUrl = pathToFileURL(fullPath).href;

    const routeModule: RouteModule = await import(routeUrl);

    const routeDetails: RouteDetails[] = [];

    validMethods.forEach(method => {
      const route = routeModule[method];

      if (route == null) {
        return;
      }

      if (typeof route !== "function") {
        errors.push({ message: `${method} route must be a function`, routePath });
        return;
      }

      routeDetails.push({
        method: method.toLowerCase() as Lowercase<Method>,
        requestSchema: routeModule[`${method}RequestSchema`],
        responseSchema: routeModule[`${method}ResponseSchema`],
        route,
      });
    });

    if (routeDetails.length === 0) {
      errors.push({ message: `No valid routes found`, routePath });
      continue;
    }

    const newRouteData: NewRouteData = {
      routeDetails,
      routePath,
    };

    createRoute(expressRouter, ajv, newRouteData, errors);
  }
}

function createRoute(
  expressRouter: Router,
  ajv: Ajv,
  routeData: NewRouteData,
  errors: Array<RouteError>
) {
  const { routePath, routeDetails } = routeData;

  //> Not including ResponseSchema until I add docs as it's not used for
  //> route generation currently
  routeDetails.forEach(routeDetail => {
    const { method, route, requestSchema, responseSchema } = routeDetail;
    const requestHandlers: Array<RequestHandler> = [];
    const routeMetadata = {
      hasRequestSchema: requestSchema != null,
      hasResponseSchema: responseSchema != null,
      method,
      routePath,
    };

    const key = `${method} ${routePath}`;

    if (allRoutes.get(key)) {
      errors.push({ message: `Duplicate route method combination: (${key})`, routePath });
      return;
    }

    const requestValidator = requestSchema != null && ajv.compile(requestSchema);

    requestValidator && requestHandlers.push(validateSchema(requestValidator));
    requestHandlers.push(route);

    expressRouter[method](routePath, ...requestHandlers);
    allRoutes.set(key, routeMetadata);
  });
}

export default async function initializeRoutes(
  router?: Router,
  ajv?: Ajv
): ResultAsync<Router, RouteError[]> {
  const expressRouter = router ?? Router();
  const ajvInstance = ajv ?? new Ajv({ allErrors: true });
  const errors: Array<RouteError> = [];

  allowErrorMessages(ajvInstance);
  await buildRoutes(expressRouter, ajvInstance, routesDirectory, errors);

  return errors.length > 0 ? [null, errors] : [expressRouter, null];
}
