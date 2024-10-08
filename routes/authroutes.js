import express from "express";
import {
  editProfile,
  getAuthCheck,
  getUser,
  googleAuth,
  googleAuthCallback,
  loginFailed,
  loginSuccess,
  logoutUser,
  signupUser,
} from "../controllers/authcontroller.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Input validation: Check for empty fields
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required!",
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "An error occurred during login." });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials, please try again!" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed!" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          profile_picture: user.profile_picture,
          bio: user.bio,
        },
      });
    });
  })(req, res, next);
});

router.post("/signup", signupUser);

router.post("/editProfile", editProfile);

router.post("/logout", logoutUser);

router.get("/api/auth/check", getAuthCheck);

router.get("/user", getUser);

router.get("/auth/google", googleAuth);

router.get("/auth/google/callback", googleAuthCallback);

router.get("/login/failed", loginFailed);

router.get("/login/success", loginSuccess);

export default router;
