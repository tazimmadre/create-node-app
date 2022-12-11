import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";
import md5 from "md5";
import { SECRETS } from "../../util/config.js";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    mobile: {
      type: Number,
      unique: true

    },
    password: {
      type: String,
      trim: true,
    },
    userType: {
      type: String,
      default: "user" //admin user employer
    },
    approved: {
      type: Boolean,
      default: "false"
    },
    photo: {
      type: String,
      default:
        `https://avatars.dicebear.com/api/bottts/tazim.svg`,
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);

    next();
  }
);

UserSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

export const User = model("users", UserSchema);
