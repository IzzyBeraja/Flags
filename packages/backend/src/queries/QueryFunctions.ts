// Exclude keys from user
export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  keys.forEach(key => delete user[key]);
  return user;
}
