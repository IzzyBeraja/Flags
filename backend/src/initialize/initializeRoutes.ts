import type { JSONSchemaType } from "ajv";
import type { RequestHandler } from "express";

import { validate } from "../validation/validateRequest";

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
type RouteSchema = JSONSchemaType<unknown> | null;

type NewRouteData = {
  method: Method;
  route: RequestHandler;
  routePath: string;
  routeSchema: { requestSchema?: RouteSchema; responseSchema?: RouteSchema };
};

export const ajv = new Ajv({ allErrors: true });

const allRoutes = new Set();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const routesDirectory = path.resolve(currentDir, "../routes");

async function buildRoutes(expressRouter: Router, cwd: string): Promise<void> {
  const files = fs.readdirSync(cwd);

  for (const file of files) {
    const fullPath = path.join(cwd, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await buildRoutes(expressRouter, fullPath);
      continue;
    }

    if (!file.endsWith(".routes.js")) {
      console.log(`- Ignored file: ${file}`);
      continue;
    }

    const routeUrl = pathToFileURL(fullPath).href;

    //? What happens if the route has not exports?
    const { method, route, requestSchema } = await import(routeUrl);

    const routeName = file.replace(".routes.js", "");

    // Example: /api/Auth/login
    const routePath = `/${path.relative(routesDirectory, cwd).replace(/\\/g, "/")}/${
      routeName === "index" ? "" : routeName
    }`;

    console.group(`  ${routePath}`);

    const newRouteData: NewRouteData = {
      method,
      route,
      routePath,
      routeSchema: { requestSchema },
    };

    createRoute(expressRouter, newRouteData);

    console.groupEnd();
  }
}

function createRoute(expressRouter: Router, routeData: NewRouteData) {
  const { method, routePath, route, routeSchema } = routeData;
  const requestHandlers = [];

  const key = `${method} ${routePath}`;

  if (acceptedMethods[method] == null) {
    console.error(`❌ Method ${method} is not an accepted method`);
    return;
  }

  if (allRoutes.has(key)) {
    console.error(`❌ Route ${method} ${routePath} already exists`);
    return;
  }

  const requestValidator =
    routeSchema.requestSchema != null && ajv.compile(routeSchema.requestSchema);

  requestValidator && requestHandlers.push(validate(requestValidator));

  requestHandlers.push(route);

  expressRouter[acceptedMethods[method]](routePath, ...requestHandlers);
  allRoutes.add(key);
  console.log(`  - (Route) Initialized ${method}`);
  return true;
}

export default async function initializeRoutes() {
  const expressRouter = Router();

  allowErrorMessages(ajv);
  await buildRoutes(expressRouter, routesDirectory);

  return expressRouter;
}
