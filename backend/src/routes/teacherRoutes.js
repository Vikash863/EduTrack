// import express from "express";
// import { registerTeacher, loginTeacher, getTeacherProfile } from "../controllers/teacherController.js";
// import auth from "../middlewares/auth.middleware.js"; // ✅ FIXED

// const router = express.Router();

// router.post("/register", registerTeacher);
// router.post("/login", loginTeacher);
// router.get("/profile", auth, getTeacherProfile);

// export default router;


import express from "express";
import {
  registerTeacher,
  loginTeacher,
  getTeacherProfile
} from "../controllers/teacherController.js";

import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.get("/profile", auth, getTeacherProfile);

export default router;