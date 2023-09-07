import type { RouteError } from "./initializeRoutes.js";

import initializeDB from "./initializeDB.js";
import initializeRoutes, { allRoutes } from "./initializeRoutes.js";
import initializeSessionCache from "./initializeSessionCache.js";

export default async function initialize() {
  const routeErrors: Array<RouteError> = [];
  const dbErrors: Array<string> = [];
  const cacheErrors: Array<string> = [];

  const results = await Promise.all([
    initializeRoutes(routeErrors),
    initializeDB(dbErrors),
    initializeSessionCache(cacheErrors),
  ]);

  console.group("🌐 Routes");
  console.group(`Built ${allRoutes.size} routes`);
  allRoutes.forEach(route => console.log(route));
  console.groupEnd();
  console.group(`Found ${routeErrors.length} errors`);
  routeErrors.forEach(({ message, routePath }) => console.log(`${routePath} - ${message}`));
  console.groupEnd();
  console.groupEnd();

  console.group("📦 Database");
  if (dbErrors.length > 0) {
    console.group(`Found ${dbErrors.length} errors`);
    dbErrors.forEach(error => console.log(error));
    console.groupEnd();
  } else {
    console.log("Database connected succesesfully");
  }
  console.groupEnd();

  console.group("💸 Session Cache");
  if (cacheErrors.length > 0) {
    console.group(`Found ${cacheErrors.length} errors`);
    cacheErrors.forEach(error => console.log(error));
    console.groupEnd();
  } else {
    console.log("Session Cache connected succesesfully");
  }
  console.groupEnd();

  return results;
}
