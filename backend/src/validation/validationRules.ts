import type { JSONSchemaType } from "ajv";

//= Username =//

export const usernameSchema: JSONSchemaType<string> = {
  maxLength: 25,
  minLength: 3,
  type: "string",
};

//= Email =//

export const emailSchema: JSONSchemaType<string> = {
  errorMessage: "Email must be a valid email address",
  pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$",
  type: "string",
};

//= Password =//

const maxPasswordLength = 64;
const minPasswordLength = 6;

export const passwordSchema: JSONSchemaType<string> = {
  allOf: [
    {
      errorMessage: "Password must contain at least one lowercase letter",
      pattern: "^(?=.*[a-z])",
    },
    {
      errorMessage: "Password must contain at least one uppercase letter",
      pattern: "^(?=.*[A-Z])",
    },
    {
      errorMessage: "Password must contain at least one number",
      pattern: "^(?=.*[0-9])",
    },
    {
      errorMessage: "Password must contain at least one special character",
      pattern: "^(?=.*[!@#$%^&*])",
    },
    {
      errorMessage: `Password must be at most ${maxPasswordLength} characters`,
      maxLength: maxPasswordLength,
    },
    {
      errorMessage: `Password must be at least ${minPasswordLength} characters`,
      minLength: minPasswordLength,
    },
  ],
  type: "string",
};

//= Name =//

export const nameSchema: JSONSchemaType<string> = {
  maxLength: 25,
  minLength: 1,
  type: "string",
};
