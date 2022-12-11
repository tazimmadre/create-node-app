import { newToken, verifyToken } from "./jwt.js";

const signup = async (req, res, next) => {
  const Model = req.model;
  let { mobile, name, password, photo } = req.body;

  if (!mobile || !name || !password) return res.status(400).send({ message: "Required fields missing" });

  if (req.body.userType === "admin") return res.status(400).send({ message: "You are not authorised to create admin user" });

  const user = await Model.findOne({ mobile: req.body.mobile });

  if (user) return res.status(200).send({ status: "failed", message: "Mobile No is already in use" })

  else {
    try {
      if (!photo) {
        photo = `https://avatars.dicebear.com/api/bottts/${name}.svg`
      }
      const user = await Model.create({ ...req.body, approved: true, active: true });
      const userfound = await Model.findOne({ mobile: mobile }).select("name mobile photo");
      return res.status(201).send({ status: "OK", data: userfound, token: newToken(user) });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e.message });
    }
  }
};

const signin = async (req, res) => {
  const Model = req.model;
  const { mobile, password } = req.body;

  if (!mobile || !password) return res.status(400).send({ message: "Mobile and password required" });

  const user = await Model.findOne({ mobile });

  if (!user) return res.status(200).send({ status: "failed", message: "Mobile No not registered" });

  if (user.active === "false") return res.status(200).send({ status: "failed", message: "Account is suspended.Please contact admin." });

  try {
    const match = await user.checkPassword(password);
    if (!match) {
      if (user.loginAttempts === 4) {
        await Model.findOneAndUpdate({ mobile }, {
          active: false,
          $inc: { loginAttempts: 1 }
        })
        setTimeout(async () => {
          await Model.findOneAndUpdate({ mobile }, {
            active: true,
            loginAttempts: 0
          })
        }, 300000)
        return res.status(200).send({ status: "failed", message: "You had 5 unsuccessful login attempts, try after 5 minutes." });
      }
      return res.status(200).send({ status: "failed", message: "Invalid Password" });
    }
    const userfound = await Model.findOne({ mobile }).select("name mobile photo");
    return res.status(201).send({ status: "ok", userData: userfound, token: newToken(user) });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const requiresLogin = async (req, res, next) => {
  const Model = req.model;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "User not authorized" });
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
    const payload = await verifyToken(token);
    const user = await Model.findById(payload.id)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const requiresAdminLogin = async (req, res, next) => {
  const Model = req.model;
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "User not authorized" });
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.status(401).send({ message: "Token not found" });
  }
  try {
    const payload = await verifyToken(token);
    const user = await Model.findOne({ _id: payload.id, userType: 'admin' })
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

const adminSignin = async (req, res) => {
  const Model = req.model;

  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Email and password required" });
  const user = await Model.findOne({ email: req.body.email }).exec();
  if (!user) {
    return res.status(400).send({ message: "Email not registered" });
  }

  try {
    const match = await user.checkPassword(req.body.password);

    if (!match || user.userType === "user") {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    if (!user.approved) {
      return res.status(401).send({ message: "Please contact admin to approve ur account" });
    }
    const token = newToken(user);

    return res.status(201).send({ status: "ok", token: token });
  } catch (e) {
    console.log(e);
    return res.status(401).send({ message: "Not Authorized" });
  }
}

const adminSignUp = async (req, res, next) => {
  const Model = req.model;
  if (
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send({
      message: "Required fields missing",
    });
  }
  const user = await Model.findOne({ email: req.body.email });
  if (user)
    return res
      .status(200)
      .send({ status: "failed", message: "Email is already in use" });
  else {
    try {
      const user = await Model.create({ ...req.body, approved: true, userType: 'admin' });
      return res.status(201).send({ status: "ok", data: user });
    } catch (e) {
      console.log(e);
      return res
        .status(400)
        .send({ status: "Error Communicating with server" });
    }
  }
};

export { signup, signin, requiresLogin, adminSignin, requiresAdminLogin, adminSignUp };
