import { config } from "dotenv";
config();

const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "1y",
  node_env: process.env.NODE_ENV,
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
  region: process.env.COGNITO_REGION,
  aws_accessKey_Id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_key_Id: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

export { SECRETS };
