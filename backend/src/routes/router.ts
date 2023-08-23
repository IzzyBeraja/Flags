import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const router = Router();

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
buildRoutes(currentDirectory);

console.log("Building routes");

function buildRoutes(routesDirectory: string) {
  fs.readdirSync(routesDirectory).forEach(async file => {
    const fullPath = path.join(routesDirectory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) return buildRoutes(fullPath);

    if (file.endsWith(".routes.js") || file.endsWith(".routes.ts")) {
      const routeUrl = pathToFileURL(fullPath).href;
      const relativePath = path
        .relative(currentDirectory, fullPath)
        .replace(".routes.js", "")
        .replace(".routes.ts", "");

      const route = await import(routeUrl);
      router.use(`/${relativePath}`, route.default);
    }
  });
}

export default router;
