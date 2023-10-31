import { createCipheriv, createDecipheriv } from "crypto";

const algorithm = "aes-256-ecb";

/**
 * Encrypts an api key using the API_KEY_ENCRYPTION_KEY environment variable
 *
 * @param apiKey Plain text API key
 * @param encryption_key Custom key (used for testing)
 * @returns Hex encoded encrypted API key
 */
export const encryptApiKey = (apiKey: string, encryption_key?: string): string => {
  const secret = encryption_key ?? process.env["API_KEY_ENCRYPTION_KEY"];

  if (secret == null) throw new Error("API_KEY_ENCRYPTION_KEY is not defined");

  const secretBuffer = Buffer.from(secret, "utf-8");

  const cipher = createCipheriv(algorithm, secretBuffer, null);
  const encryptedText = Buffer.concat([cipher.update(apiKey), cipher.final()]);
  return encryptedText.toString("hex");
};

/**
 * Decrypts an encrypted api key using the API_KEY_ENCRYPTION_KEY environment variable
 *
 * @param encryptedApiKey Hex encoded encrypted API key
 * @param encryption_key Custom key (used for testing)
 * @returns Plain text API key
 */
export const decryptApiKey = (encryptedApiKey: string, encryption_key?: string): string => {
  const secret = encryption_key ?? process.env["API_KEY_ENCRYPTION_KEY"];

  if (secret == null) throw new Error("API_KEY_ENCRYPTION_KEY is not defined");

  const secretBuffer = Buffer.from(secret, "utf-8");
  const encryptedKeyBuffer = Buffer.from(encryptedApiKey, "hex");

  const decipher = createDecipheriv(algorithm, secretBuffer, null);
  const decryptedText = Buffer.concat([decipher.update(encryptedKeyBuffer), decipher.final()]);
  return decryptedText.toString();
};

/**
 * Generates a random API key
 *
 * @param [prefix=""] Prefix string for the key (e.g. fkey_ -> fkey_123123...)
 * @param [length=64] - Total length of the key including prefix
 * @returns A randomly generated API key
 */
export const generateApiKey = (prefix?: string, length?: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const keyPrefix = prefix ?? "";
  const keyLength = (length ?? 64) - keyPrefix.length - 1;

  let result = "";

  for (let i = 0; i < keyLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${keyPrefix}${result}`;
};
