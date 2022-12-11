import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getUser,
} from "../controllers/user.controllers.js";

const router = Router();

router
  .route("/")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);
router.route("/getUser/:id").get(getUser);
router.route("/password").post(changeUserPassword);

export default router;
