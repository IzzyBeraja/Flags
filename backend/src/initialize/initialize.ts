import initializeDB from "./initializeDB.js";
import initializeRoutes from "./initializeRoutes.js";
import initializeSessionCache from "./initializeSessionCache.js";

export default async function initializeServices() {
  await Promise.all([
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

async function runAsync(
  func: () => Promise<void>,
  start: string,
  success: string,
  failure: string
) {
  try {
    console.log(start);
    await func();
    console.log(success);
  } catch (e) {
    console.error(failure);
    console.error(e);
    console.error("Server shutting down...");
    process.exit(1);
  }
}
