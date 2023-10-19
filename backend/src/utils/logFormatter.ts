import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { IncomingMessage, ServerResponse } from "http";
import type { FormatFn as MorganFormatFn, TokenIndexer as MorganTokenIndexer } from "morgan";

import chalk from "chalk";

type FormatFn = MorganFormatFn<ExpressRequest, ExpressResponse>;
type TokenIndexer = MorganTokenIndexer<ExpressRequest, ExpressResponse>;

const logFormatter: FormatFn = (
  tokens: TokenIndexer,
  req: IncomingMessage & ExpressRequest,
  res: ServerResponse & ExpressResponse
) => {
  const status = tokens["status"](req, res);
  const statusColor = status?.startsWith("2")
    ? chalk.bgGreen
    : status?.startsWith("3")
    ? chalk.bgYellow
    : chalk.bgRed;

  const responseTime = tokens["response-time"](req, res);
  const responseMessage = ` ${Array(10 - (responseTime?.length ?? 0)).join(" ")}${responseTime}ms `;

  const method = tokens["method"](req, res);
  const methodColor =
    method === "GET"
      ? chalk.bgGreen
      : method === "POST"
      ? chalk.bgYellow
      : method === "PUT"
      ? chalk.bgBlue
      : method === "PATCH"
      ? chalk.bgMagenta
      : chalk.bgRed;
  const methodMessage = methodColor(` ${method}${Array(8 - (method?.length ?? 0)).join(" ")} `);

  return [
    `[FLAGS] ${new Date().toISOString()} `,
    statusColor(` ${status} `),
    responseMessage,
    methodMessage,
    ` ${tokens["url"](req, res)}`,
  ].join("|");
};

export default logFormatter;
