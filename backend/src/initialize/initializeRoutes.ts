import type { JSONSchemaType } from "ajv";

import Ajv from "ajv";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "ALL";
type RouteSchema = JSONSchemaType<unknown> | null;
type RouteId = string | null;

export const expressRouter = Router();
export const ajv = new Ajv({ allErrors: true });

const allRoutes = new Set();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const routesDirectory = path.resolve(currentDir, "../routes");

async function buildRoutes(cwd: string): Promise<void> {
  const files = fs.readdirSync(cwd);

  for (const file of files) {
    const fullPath = path.join(cwd, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await buildRoutes(fullPath);
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
    const routePath = route.default.stack[0].route.path as string;
    const routeMethod = route.default.stack[0].route.stack[0].method.toUpperCase() as Method;
    const relativeRoutePath = `/${path.relative(routesDirectory, cwd).replace(/\\/g, "/")}`;
    const routeName = [relativeRoutePath, routePath].join("");

    console.group(`  ${routeName}`);
    if (createRoute(routeMethod, relativeRoutePath, routeName, route.default))
      generateSchema(requestSchema, route_id);
    console.groupEnd();
  }
}

function createRoute(method: Method, directory: string, path: string, router: Router): boolean {
  const key = `${method} ${path}`;

  if (allRoutes.has(key)) {
    console.error(`❌ Route ${method} ${path} already exists`);
    return false;
  }

  expressRouter.use(directory, router);
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
  await buildRoutes(routesDirectory);
  ajv.getSchema("");
}
