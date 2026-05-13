const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Provider = require("../models/Provider");
const Cookie = require("../models/Cookie");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");

// Register
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { role, email } = req.body;
    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : req.body.avatar;

    const existingUser = await User.findOne({ email });
    const existingProvider = await Provider.findOne({ email });

    if (existingUser || existingProvider) {
      return res.json({ message: "This user is alredy exists.", reg: false });
    }

    if (role === "provider") {
      const providerData = { ...req.body, avatar: avatarPath };
      if (providerData.uid) {
        providerData.providerId = providerData.uid;
      }
      const provider = new Provider(providerData);
      await provider.save();
      console.log("REGISTER HIT - PROVIDER");
      return res.json({ message: "Provider Registered", reg: true });
    } else {
      const userData = { ...req.body, avatar: avatarPath };
      const user = new User(userData);
      await user.save();
      console.log("REGISTER HIT");
      return res.json({ message: "User Registered", reg: true });
    }
  } catch (error) {
    res.json({ message: "This user is alredy exists.", reg: false });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  let isProvider = false;
  let role = user ? user.role : null;

  if (!user) {
    user = await Provider.findOne({ email });
    isProvider = !!user;
    role = "provider";
  }

  if (!user || user.password !== password) {
    return res.json({
      log: false,
      message: "Invalid email or password",
    });
  }

  const userObj = user.toObject();
  if (isProvider) {
    userObj.role = "provider";
    if (!userObj.uid) userObj.uid = userObj.providerId || "";
  }

  console.log("Logging in user:", userObj);

  // Check for existing valid cookie (less than 7 days old)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let existingCookie = await Cookie.findOne({
    uid: userObj.uid,
    createdAt: { $gte: sevenDaysAgo },
  }).sort({ createdAt: -1 });

  let token;
  if (existingCookie) {
    // Use existing token
    token = existingCookie.token;
    // Verify the JWT is still valid (not expired)
    try {
      jwt.verify(token, "secretkey");
    } catch (err) {
      // JWT expired, create new one
      token = jwt.sign({ id: user._id, role: role }, "secretkey", {
        expiresIn: "24h",
      });
      // Update the cookie with new token
      existingCookie.token = token;
      existingCookie.createdAt = new Date();
      await existingCookie.save();
    }
  } else {
    // Create new token and cookie
    token = jwt.sign({ id: user._id, role: role }, "secretkey", {
      expiresIn: "24h",
    });

    // Delete any old cookies for this user
    await Cookie.deleteMany({ uid: userObj.uid });

    // Create new cookie
    const cookie = new Cookie({
      uid: userObj.uid,
      token,
      createdAt: new Date(),
    });
    await cookie.save();
  }

  // Set browser cookie (valid for 7 days)
  res.cookie(
    "slms_session",
    JSON.stringify({
      uid: userObj.uid,
      createdAt: new Date().toISOString(),
    }),
    {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: false, // Allow frontend JS to read it
      path: "/",
    },
  );

  res.json({
    log: true,
    user: userObj,
    token,
  });
});

router.get("/", async (req, res) => {
  const users = await User.find();
  const providers = await Provider.find();

  const mappedProviders = providers.map((p) => {
    const obj = p.toObject();
    obj.role = "provider";
    obj.uid = obj.providerId || "";
    return obj;
  });

  res.json([...users, ...mappedProviders]);
});

// router.put("/:id", async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json({ message: "User Updated", user });
//     }
//     catch (error) {
//         res.json({ message: "User Update Failed", user });
//     }
// });
//

router.put("/:id", upload.single("avatar"), async (req, res) => {
  console.log("Update User Route HIT");
  // console.log(req.body);
  // console.log(req.file);
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { uid: req.params.id },
      updateData,
      { new: true },
    );

    res.json({ message: "User Updated", user });
  } catch (error) {
    res.status(500).json({
      message: "User Update Failed",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User Deleted", user });
  } catch (error) {
    res.json({ message: "User Delete Failed", user });
  }
});

router.get("/users", async (req, res) => {
  const users = await User.find();
  const providers = await Provider.find();

  const mappedProviders = providers.map((p) => {
    const obj = p.toObject();
    obj.role = "provider";
    obj.uid = obj.providerId || "";
    return obj;
  });

  res.json([...users, ...mappedProviders]);
});

router.get("/:id", async (req, res) => {
  try {
    let user;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(req.params.id);
      if (!user) {
        user = await Provider.findById(req.params.id);
      }
    }
    if (!user) {
      user = await User.findOne({ uid: req.params.id });
    }
    if (!user) {
      user = await Provider.findOne({ providerId: req.params.id });
    }
    if (!user) {
      user = await Provider.findOne({ uid: req.params.id });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

router.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User favorites fetched successfully",
      favorites: user.favorites || [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    const { userId, favorites } = req.body;
    // console.log("Backend favorites update hit:");
    // console.log("userId (uid):", userId);
    // console.log("favorites:", favorites);

    if (!userId) {
      return res.status(400).json({ message: "userId (uid) is required" });
    }

    const user = await User.findOneAndUpdate(
      { uid: userId },
      { favorites },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User Updated",
      user,
    });
  } catch (error) {
    console.error("Backend error updating favorites:", error);
    res.status(500).json({
      message: "User Update Failed",
      error: error.message,
    });
  }
});

// Validate cookie - checks if cookie exists in DB and is less than 7 days old
router.post("/validate-cookie", async (req, res) => {
  try {
    const { token, uid } = req.body;

    if (!token || !uid) {
      return res.json({ valid: false });
    }

    // Check if cookie exists in DB and is less than 7 days old
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const cookie = await Cookie.findOne({
      uid: uid,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 });

    if (!cookie) {
      // No valid cookie in DB - clean up and return
      return res.json({ valid: false });
    }

    // Get user data (need _id for JWT signing)
    let user = await User.findOne({ uid });
    let isProvider = false;
    let role = "customer";

    if (!user) {
      user = await Provider.findOne({ providerId: uid });
      if (user) {
        isProvider = true;
        role = "provider";
      }
    }

    if (!user) {
      return res.json({ valid: false });
    }

    // Try verify JWT - if expired, issue a new one
    let newToken = token;
    try {
      jwt.verify(token, "secretkey");
    } catch (err) {
      // JWT expired, issue a new one with 24h expiry
      newToken = jwt.sign({ id: user._id, role: role }, "secretkey", {
        expiresIn: "24h",
      });
      // Update cookie with new token
      cookie.token = newToken;
      cookie.createdAt = new Date();
      await cookie.save();
    }

    const userObj = user.toObject();
    if (isProvider) {
      userObj.role = "provider";
      userObj.uid = userObj.providerId || "";
    }

    return res.json({ valid: true, user: userObj, newToken });
  } catch (error) {
    console.error("Validate cookie error:", error);
    return res.json({ valid: false });
  }
});

// Logout - clear cookies from DB
router.post("/logout", async (req, res) => {
  try {
    const { uid } = req.body;

    if (uid) {
      // Delete all cookies for this user
      await Cookie.deleteMany({ uid });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

module.exports = router;
