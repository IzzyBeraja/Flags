import helmet from "helmet";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: helmet.contentSecurityPolicy.getDefaultDirectives(),
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" } /* default */,
  crossOriginResourcePolicy: { policy: "same-site" } /* default */,
  originAgentCluster: true /* default */,
  referrerPolicy: { policy: "no-referrer" } /* default */,
  strictTransportSecurity: process.env["NODE_ENV"] === "production" && {
    includeSubDomains: true,
    maxAge: 15552000,
  } /* default (Disabled in Dev) */,
  xContentTypeOptions: true /* default */,
  xDnsPrefetchControl: { allow: false } /* default */,
  xDownloadOptions: true /* default */,
  xFrameOptions: { action: "sameorigin" } /* default */,
  xPermittedCrossDomainPolicies: { permittedPolicies: "none" } /* default */,
  xPoweredBy: true /* default */,
  xXssProtection: true /* default */,
});
