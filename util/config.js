import { config } from "dotenv";
config();

const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "1y",
  node_env: process.env.NODE_ENV,
};

export { SECRETS };
