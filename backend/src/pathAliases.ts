import moduleAlias from "module-alias";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

moduleAlias.addAliases({
  "@initialize": dir + "./dist/initialize",
  "@middleware": dir + "/middleware",
  "@queries": dir + "/queries",
  "@routes": dir + "/routes",
  "@types": dir + "/types",
  "@utils": dir + "/utils",
  "@validation": dir + "/validation",
});

console.log(dir + "/initialize");
