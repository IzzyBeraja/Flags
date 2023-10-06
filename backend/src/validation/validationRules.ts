import type { JSONSchemaType } from "ajv";

//= Username =//

const maxUsernameLength = 25;
const minUsernameLength = 3;

export const usernameSchema: JSONSchemaType<string> = {
  errorMessage: {
    maxLength: `Username must be at most ${maxUsernameLength} characters`,
    minLength: `Username must be at least ${minUsernameLength} characters`,
  },
  maxLength: maxUsernameLength,
  minLength: minUsernameLength,
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

const maxNameLength = 35;
const minNameLength = 1;

export const nameSchema: JSONSchemaType<string> = {
  errorMessage: {
    maxLength: `Name must be at most ${maxNameLength} characters`,
    minLength: `Name must be at least ${minNameLength} character`,
  },
  maxLength: maxNameLength,
  minLength: minNameLength,
  type: "string",
};

//= Description =//

const maxDescriptionLength = 200;

export const descriptionSchema: JSONSchemaType<string> = {
  errorMessage: {
    maxLength: `Description must be at most ${maxDescriptionLength} characters`,
  },
  maxLength: maxNameLength,
  type: "string",
};
