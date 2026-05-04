const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");
const upload = require("../middleware/upload");

// Add provider
router.post("/add", upload.single("avatar"), async (req, res) => {
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : req.body.avatar;
    const provider = new Provider({ ...req.body, avatar: avatarPath });
    await provider.save();
    res.send("Provider added");
});

// Get providers
router.get("/", async (req, res) => {
    const providers = await Provider.find();
    res.json(providers);
});
// Get provider by ID
router.get("/:providerId", async (req, res) => {
    try {
        let provider;
        if (req.params.providerId.match(/^[0-9a-fA-F]{24}$/)) {
            provider = await Provider.findById(req.params.providerId);
        }
        if (!provider) {
            provider = await Provider.findOne({ providerId: req.params.providerId });
        }
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }
        res.json(provider);
    } catch (error) {
        res.status(500).json({ message: "Error fetching provider", error: error.message });
    }
});

// Update provider
// router.put("/:providerId", async (req, res) => {
//     try {
//         let provider;
//         if (req.params.providerId.match(/^[0-9a-fA-F]{24}$/)) {
//             provider = await Provider.findByIdAndUpdate(req.params.providerId, req.body, { new: true });
//         }

//         if (!provider) {

//             provider = await Provider.findOneAndUpdate({ providerId: req.params.providerId }, req.body, { new: true });
//         }
//         if (!provider) {
//             return res.status(404).json({ message: "Provider not found" });
//         }
//         res.json({ message: "Provider Updated", provider });
//     } catch (error) {
//         res.status(500).json({ message: "Provider Update Failed", error: error.message });
//     }
// });



router.put("/:providerId", upload.single("avatar"), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        // Convert address -> area if address is sent
        // console.log(req.body);
        if (updateData.address) {
            updateData.area = updateData.address;
            delete updateData.address;
        }

        let provider;

        if (req.params.providerId.match(/^[0-9a-fA-F]{24}$/)) {
            provider = await Provider.findByIdAndUpdate(
                req.params.providerId,
                updateData,
                { new: true }
            );
        }

        if (!provider) {
            provider = await Provider.findOneAndUpdate(
                { providerId: req.params.providerId },
                updateData,
                { new: true }
            );
        }

        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        res.json({
            message: "Provider Updated",
            provider
        });

    } catch (error) {
        res.status(500).json({
            message: "Provider Update Failed",
            error: error.message
        });
    }
});

module.exports = router;