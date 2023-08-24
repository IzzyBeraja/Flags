import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const router = Router();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

try {
  await buildRoutes(currentDirectory);
  console.log("✅ Routes initialized");
} catch (error) {
  console.error("❌ Routes failed to initialize");
  console.error(error);
}

async function buildRoutes(routesDirectory: string) {
  fs.readdirSync(routesDirectory).forEach(async file => {
    const fullPath = path.join(routesDirectory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) return buildRoutes(fullPath);

    if (file.endsWith(".routes.js") || file.endsWith(".routes.ts")) {
      const routeUrl = pathToFileURL(fullPath).href;
      const relativePath = path
        .relative(currentDirectory, fullPath)
        .replace(/\\/g, "/")
        .replace(".routes.js", "")
        .replace(".routes.ts", "");

      const route = await import(routeUrl);
      if (route.default == null || typeof route.default !== "function")
        return console.error(`❌ Route ${relativePath} failed to initialize`);
      router.use(`/${relativePath}`, route.default);
    }
  });
}

export default router;
