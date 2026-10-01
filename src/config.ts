import dotenv from "dotenv";
dotenv.config();

export const config = {
  dbUrl: getEnv("DATABASE_URL"),
};

function getEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${varName} is missing or empty`);
  }
  return value;
}
