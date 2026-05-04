const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const upload = require("../middleware/upload");

// Add service (admin)
router.post("/add", upload.single("image"), async (req, res) => {
    const imagePath = req.file ? `/uploads/services/${req.file.filename}` : req.body.image;
    const service = new Service({ ...req.body, image: imagePath });
    await service.save();
    res.send("Service added");
});

// Get all services
router.get("/", async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

router.get("/:id", async (req, res) => {
    const service = await Service.findById(req.params.id);
    // console.log(service);
    res.json(service);
});

router.put("/:id", upload.single("image"), async (req, res) => {
    const updateData = { ...req.body };
    if (req.file) {
        updateData.image = `/uploads/services/${req.file.filename}`;
    }
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(service);
});

router.delete("/:id", async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);
    res.json(service);
});

router.get("/provider/:id", async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const services = await Service.find({ providerId: id });
    res.json(services);
});

module.exports = router;