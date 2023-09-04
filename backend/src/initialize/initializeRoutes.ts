import type { JSONSchemaType } from "ajv";

import Ajv from "ajv";
import addAjvErrors from "ajv-errors";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "ALL";
type RouteSchema = JSONSchemaType<unknown> | null;
type RouteId = string | null;

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

    if (!file.endsWith(".routes.js") && !file.endsWith(".routes.ts")) {
      console.log(`- Ignored file: ${file}`);
      continue;
    }

    const routeUrl = pathToFileURL(fullPath).href;
    const route = await import(routeUrl);
    const route_id: RouteId = route.route_id;
    const requestSchema: RouteSchema = route.requestSchema;
    const subRoute = route.default.stack[0].route.path as string;
    const method = route.default.stack[0].route.stack[0].method.toUpperCase() as Method;
    const parentRoute = `/${path.relative(routesDirectory, cwd).replace(/\\/g, "/")}`;
    const routePath = [parentRoute, subRoute].join("");

    console.group(`  ${routePath}`);

    const newRouteData: NewRouteData = {
      method,
      parentRoute,
      routePath,
      router: route.default,
    };

    if (createRoute(expressRouter, newRouteData)) {
      generateSchema(requestSchema, route_id);
      console.groupEnd();
    }
  }
}

type NewRouteData = {
  method: Method;
  parentRoute: string;
  routePath: string;
  /** The route information for a singular route */
  router: Router;
};

function createRoute(
  expressRouter: Router,
  { parentRoute, method, routePath, router }: NewRouteData
): boolean {
  const key = `${method} ${routePath}`;

  if (allRoutes.has(key)) {
    console.error(`❌ Route ${method} ${routePath} already exists`);
    return false;
  }

  expressRouter.use(parentRoute, router);
  allRoutes.add(key);
  console.log(`  - (Route) Initialized ${method}`);
  return true;
}

function generateSchema(requestSchema: RouteSchema, route_id: RouteId) {
  if (route_id == null) {
    console.log("\x1b[2m%s\x1b[0m", `  - (Schema) Skipped - missing route_id`);
    return;
  }

  if (requestSchema == null) {
    console.log(`  - (Schema) Skipped - missing requestSchema`);
    return;
  }

  ajv.addSchema(requestSchema, route_id);
}

export default async function initializeRoutes() {
  const expressRouter = Router();

  addAjvErrors(ajv);
  await buildRoutes(expressRouter, routesDirectory);
  ajv.getSchema("");

  return expressRouter;
}
