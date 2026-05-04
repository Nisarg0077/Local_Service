const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Provider = require("../models/Provider");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");

// Register
router.post("/register", upload.single("avatar"), async (req, res) => {
    try {
        const { role, email } = req.body;
        const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : req.body.avatar;

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
    }
    catch (error) {
        res.json({ message: "This user is alredy exists.", reg: false })

    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
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
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, role: role },
        "secretkey",
        { expiresIn: "1h" }
    );

    const userObj = user.toObject();
    if (isProvider) {
        userObj.role = "provider";
        if (!userObj.uid) userObj.uid = userObj.providerId || "";
    }

    res.json({
        log: true,
        user: userObj,
        token
    });
});

router.get("/", async (req, res) => {
    const users = await User.find();
    const providers = await Provider.find();

    const mappedProviders = providers.map(p => {
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
            { new: true }
        );

        res.json({ message: "User Updated", user });

    } catch (error) {
        res.status(500).json({
            message: "User Update Failed",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted", user });
    }
    catch (error) {
        res.json({ message: "User Delete Failed", user });
    }
});

router.get("/users", async (req, res) => {
    const users = await User.find();
    const providers = await Provider.find();

    const mappedProviders = providers.map(p => {
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
        res.status(500).json({ message: "Error fetching user", error: error.message });
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
            favorites: user.favorites || []
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch favorites",
            error: error.message
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
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User Updated",
            user
        });

    } catch (error) {
        console.error("Backend error updating favorites:", error);
        res.status(500).json({
            message: "User Update Failed",
            error: error.message
        });
    }
});

module.exports = router;