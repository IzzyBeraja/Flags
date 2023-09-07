import type { JSONSchemaType } from "ajv";
import type { RequestHandler } from "express";

import { validateSchema } from "../validation/validateRequest";

import Ajv from "ajv";
import allowErrorMessages from "ajv-errors";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const acceptedMethods = {
  DELETE: "delete",
  GET: "get",
  PATCH: "patch",
  POST: "post",
  PUT: "put",
} as const;
type Method = keyof typeof acceptedMethods;

type RouteSchema = JSONSchemaType<unknown> | undefined;

export type RouteModule = {
  method?: Method | undefined;
  route?: RequestHandler | undefined;
  requestSchema?: RouteSchema | undefined;
};

type NewRouteData = {
  method: Method;
  route: RequestHandler;
  routePath: string;
  requestSchema: RouteSchema;
};

export type RouteError = {
  message: string;
  routePath: string;
};

export const allRoutes = new Set();

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
      console.log(`- Ignored file: ${file}`);
      continue;
    }

    const routeName = file.replace(".routes.js", "");

    // Example: /api/Auth/login
    const routePath = `/${path.relative(routesDirectory, cwd).replace(/\\/g, "/")}/${
      routeName === "index" ? "" : routeName
    }`;

    const routeUrl = pathToFileURL(fullPath).href;

    //? What happens if the route has not exports?
    const { method, route, requestSchema }: RouteModule = await import(routeUrl);

    if (method == null || typeof method !== "string" || !acceptedMethods[method]) {
      errors.push({ message: `Invalid method`, routePath });
      continue;
    }

    if (route == null || typeof route !== "function") {
      errors.push({ message: `Invalid route handler`, routePath });
      continue;
    }

    const newRouteData: NewRouteData = {
      method,
      requestSchema,
      route,
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
  const { method, routePath, route, requestSchema } = routeData;
  const requestHandlers: Array<RequestHandler> = [];

  const key = `${method} ${routePath}`;

  if (allRoutes.has(key)) {
    errors.push({ message: `Route already exists`, routePath });
    return;
  }

  const requestValidator = requestSchema != null && ajv.compile(requestSchema);

  requestValidator && requestHandlers.push(validateSchema(requestValidator));
  requestHandlers.push(route);

  expressRouter[acceptedMethods[method]](routePath, ...requestHandlers);
  allRoutes.add(key);
}

export default async function initializeRoutes(
  errors: Array<RouteError>,
  router?: Router,
  ajv?: Ajv
) {
  const expressRouter = router ?? Router();
  const ajvInstance = ajv ?? new Ajv({ allErrors: true });

  allowErrorMessages(ajvInstance);
  await buildRoutes(expressRouter, ajvInstance, routesDirectory, errors);

  return expressRouter;
}
