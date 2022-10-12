import { User } from "../resources/user/user.model.js";

export const getUserById = async (req, res, next) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: "ID required" });
  }
  const user = await User.findOne({ username });
  req.user = user;
  next();
};
