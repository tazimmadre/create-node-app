import { Router } from "express";
import { upload } from "../../util/s3-spaces.js";

import {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  changeUserPassword,
  deleteUser,

  updatePublicUrl,
  addLanguage,
  deleteLanguage,
  getDashboardDetails,
  getUsers,
  getHashKey,
  getUser,
  updateAccountActive,
  newsLetterSignUp,
  newsLetterUnsuscribe,
  getNewsLetterSignUp,
} from "./user.controllers.js";

const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .delete(deleteUser);

router.route("/getUsers").get(getUsers);
router.route("/getUser/:id").get(getUser);
router.route("/profile/username").put(updatePublicUrl);
router.route("/languages/").post(addLanguage);
router.route("/languages/:id").delete(deleteLanguage);
router.route("/updateActive/:id").patch(updateAccountActive);
router.route("/password").post(changeUserPassword);
router.get("/details", getDashboardDetails);
router.post("/payment_gateway/payumoney", getHashKey);
router.post("/subscribeNewsLetter", newsLetterSignUp);
router.get("/getNewsLetter", getNewsLetterSignUp);
router.post("/delNewsLetter/:id", newsLetterUnsuscribe);

export default router;
