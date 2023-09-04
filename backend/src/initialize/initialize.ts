import initializeDB from "./initializeDB.js";
import initializeRoutes from "./initializeRoutes.js";
import initializeSessionCache from "./initializeSessionCache.js";

export default async function initialize() {
  return await Promise.all([
    runAsync(
      initializeRoutes,
      "Initializing routes",
      "✅ Routes initialized",
      "❌ Routes failed to initialize"
    ),

    runAsync(
      initializeDB,
      "Initializing DB",
      "✅ Database initialized",
      "❌ Database failed to initialize"
    ),

    runAsync(
      initializeSessionCache,
      "Initializing session cache",
      "✅ Session cache initialized",
      "❌ Session cache failed to initialize"
    ),
  ]);
}

async function runAsync<T>(
  func: () => Promise<T>,
  start: string,
  success: string,
  failure: string
): Promise<T> {
  try {
    console.log(start);
    const result = await func();
    console.log(success);
    return result;
  } catch (e) {
    console.error(failure);
    console.error(e);
    console.error("Server shutting down...");
    process.exit(1);
  }
}
