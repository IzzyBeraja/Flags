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
      buildRoutes(fullPath);
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

    createRoute(routeMethod, relativeRoutePath, `${relativeRoutePath}${routePath}`, route.default);
    generateSchema(relativeRoutePath, requestSchema, route_id);
  }
}

function createRoute(method: Method, directory: string, path: string, router: Router) {
  if (allRoutes.has(`${method} ${path}`)) {
    return console.error(`❌ Route ${method} ${path} already exists`);
  }

  expressRouter.use(directory, router);
  allRoutes.add(`${method} ${path}`);
  console.log(` - (Route) Initialized Route: ${method}\t${path}`);
}

function generateSchema(route: string, requestSchema: RouteSchema, route_id: RouteId) {
  if (route_id == null) {
    console.log(` - (Schema) Ignored file: ${route} because it does not have a route_id`);
    return;
  }

  if (requestSchema == null) {
    console.log(` - (Schema) Ignored file: ${route} because it does not have a requestSchema`);
    return;
  }

  ajv.addSchema(requestSchema, route_id);
}

export default async function initializeRoutes() {
  await buildRoutes(routesDirectory);
  ajv.getSchema("");
}
