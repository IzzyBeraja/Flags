import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 *
 * @param password - The plaintext password to hash
 */
export async function hash(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 *
 * @param password - The plaintext password to compare
 * @param hash - The hashed password to compare against
 */
export async function compare(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
