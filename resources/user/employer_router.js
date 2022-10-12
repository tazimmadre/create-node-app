import { Router } from "express";


import {
    updateEmployerProfile,
    deleteEmployer,
getEmployers,
getUser
} from "./user.controllers.js";

const router = Router();



router.route("/delete/:id").delete(deleteEmployer);
router.route("/edit/:id").put(updateEmployerProfile);
router.route("/view").get(getEmployers);
router.route("/view/:id").get(getUser);



export default router;
