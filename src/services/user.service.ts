import prisma from "../utils/prisma.util";
import { TRegisterUserInput, TLoginUserInput } from "../schemas/user.schema";
import { hash, verify } from "../utils/argon2.util";
import { signJwt } from "../utils/jwt.util";
import { IOutput } from "../interfaces/output.interface";

export interface IUser {
  id: number;
  username: string;
}

export const getUsersService = async (): Promise<IOutput<IUser[]>> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true },
    });
    return { success: true, error: null, data: users };
  } catch (err) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while getting the users, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};

export const registerUserService = async ({
  password,
  username,
}: TRegisterUserInput): Promise<IOutput<IUser>> => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return {
        success: false,
        error: {
          status: 400,
          message: "Name is already taken...",
        },
        data: null,
      };
    }

    const hashed = await hash(password);
    const newUser = await prisma.user.create({
      data: { password: hashed, username },
      select: {
        id: true,
        username: true,
      },
    });
    const token = signJwt({ sub: newUser.id });
    return {
      success: true,
      error: null,
      data: newUser,
      token,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        status: 500,
        message:
          "An error occurred while creating the user account, please try again later...",
      },

      data: null,
    };
  }
};

export const loginUserService = async ({
  password,
  username: name,
}: TLoginUserInput): Promise<IOutput<IUser>> => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { username: name },
    });

    if (!userExists) {
      return {
        success: false,
        error: {
          status: 400,
          message:
            "No user associated with the provided name, please create an account first...",
        },
        data: null,
      };
    }

    const isValid = await verify(userExists.password, password);

    if (!isValid) {
      return {
        success: false,
        error: {
          status: 400,
          message: "Incorrect name or password...",
        },
        data: null,
      };
    }

    const token = signJwt({ sub: userExists.id });
    const { id, username } = userExists;
    return {
      success: true,
      error: null,
      data: { id, username },
      token,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "An error occurred while login the user, please try again later...",
        status: 500,
      },
      data: null,
    };
  }
};
