import Ajv from "ajv";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export const ajv = new Ajv({ allErrors: true });
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const routesDirectory = path.resolve(currentDir, "../routes");

const compileSchemas = (cwd: string) => {
  fs.readdirSync(cwd).forEach(async file => {
    const fullPath = path.join(cwd, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) return compileSchemas(fullPath);

    if (!file.endsWith(".routes.js") && !file.endsWith(".routes.ts"))
      return console.log(`- Ignored file: ${file}`);

    const routeUrl = pathToFileURL(fullPath).href;
    const route = await import(routeUrl);
    const route_id = route.route_id;
    const requestSchema = route.requestSchema;

    if (route_id == null) {
      return console.log(`- Ignored file: ${file} because it does not have a route_id`);
    }

    if (requestSchema == null) {
      return console.log(`- Ignored file: ${file} because it does not have a requestSchema`);
    }

    ajv.addSchema(requestSchema, route_id);
  });
};

export default function initializeValidation() {
  compileSchemas(routesDirectory);
  ajv.getSchema("");
}

// const ajv = new Ajv({ allErrors: true });
