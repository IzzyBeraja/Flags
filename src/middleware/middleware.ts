import bodyParser from "body-parser";
import cors from "cors";

const middleware = [cors<cors.CorsRequest>(), bodyParser.json()];

export { middleware };
