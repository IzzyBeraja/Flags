import type { PrismaClient, User } from "@prisma/client";

import { exclude } from "./QueryFunctions";

import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

type UserWithoutPassword = Omit<User, "password">;

export type CreateUser =
  | { success: true; createdUser: UserWithoutPassword }
  | { success: false; error: string };

export type GetUser =
  | { success: true; user: UserWithoutPassword }
  | { success: false; error: string };

export async function createUser(
  prisma: PrismaClient,
  newUser: Prisma.UserCreateInput
): Promise<CreateUser> {
  const hashedPassword = await bcrypt.hash(newUser.password, SALT_ROUNDS);

  try {
    const createUserRequest = await prisma.user.create({
      data: { ...newUser, password: hashedPassword },
    });

    const createdUser = exclude(createUserRequest, ["password"]);

    return { createdUser, success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: error.message, success: false };
    }
    return { error: "Something went wrong", success: false };
  }
}

export async function getUser(prisma: PrismaClient, userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return user && exclude(user, ["password"]);
}

//> TODO - Find a better name for this
export async function loginUser(
  prisma: PrismaClient,
  email: string,
  password: string
): Promise<GetUser> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user == null) {
      return {
        error: "No user with that email found",
        success: false,
      };
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (!passwordMatch) {
      return {
        error: "Bad email and password combination",
        success: false,
      };
    }

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        error: error.message,
        success: false,
      };
    }
    return {
      error: "Something went wrong",
      success: false,
    };
  }
}
