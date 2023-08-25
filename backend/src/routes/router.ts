import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "ALL";

const expressRouter = Router();
const filename = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const allRoutes = new Set();

try {
  buildRoutes(currentDirectory);
  console.log("✅ Routes initialized");
} catch (error) {
  console.error("❌ Routes failed to initialize");
  console.error(error);
}

function buildRoutes(routesDirectory: string) {
  fs.readdirSync(routesDirectory).forEach(async file => {
    if (file === filename) return;

    const fullPath = path.join(routesDirectory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) return buildRoutes(fullPath);

    if (!file.endsWith(".routes.js") && !file.endsWith(".routes.ts"))
      return console.log(`- Ignored file: ${file}`);

    const routeUrl = pathToFileURL(fullPath).href;
    const relativePath = `/${path.relative(currentDirectory, routesDirectory).replace(/\\/g, "/")}`;

    const router = (await import(routeUrl)).default as Router;
    if (router == null || typeof router !== "function") {
      return console.error(
        `❌ Route ${relativePath} failed to initialize. Did you export a default function?`
      );
    }

    const routePath = router.stack[0].route.path;
    const routeMethod: Method = router.stack[0].route.stack[0].method.toUpperCase();

    addRoute(routeMethod, relativePath, `${relativePath}${routePath}`, router);
  });
}

function addRoute(method: Method, directory: string, path: string, router: Router) {
  if (allRoutes.has(`${method} ${path}`)) {
    return console.error(`❌ Route ${method} ${path} already exists`);
  }

  expressRouter.use(directory, router);
  allRoutes.add(`${method} ${path}`);
  console.log(`- Initialized Route: ${method}\t${path}`);
}

export default expressRouter;
