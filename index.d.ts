declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    JWT_PUBLIC: string;
    JWT_PRIVATE: string;
    ACCESS_TOKEN_EXP: string;
    NODE_ENV: "dev" | "test" | "prod";
  }
}

declare namespace Express {
  export interface Request {
    user: { id: number; username: string };
  }
}
