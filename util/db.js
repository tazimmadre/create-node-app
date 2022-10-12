import mongoose from "mongoose";

export const connect = (url = process.env.MONGO_CONNECTION_STRING) => {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
