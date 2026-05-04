const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Service = require("../models/Service");

const updateServiceRating = async (serviceId) => {
    try {
        const reviews = await Review.find({ serviceId, approved: true });
        const reviewCount = reviews.length;
        let avgRating = 0;
        
        if (reviewCount > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            avgRating = Number((totalRating / reviewCount).toFixed(2));
        }

        await Service.updateOne(
            { id: serviceId },
            {
                rating: avgRating,
                reviewCount: reviewCount
            }
        );
    } catch (error) {
        console.error("Error updating service rating:", error);
    }
};

router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

router.post("/", async (req, res) => {
    const { serviceId, userId, userName, rating, comment } = req.body;

    const review = new Review({
        serviceId,
        userId,
        userName,
        rating,
        comment
    });

    await review.save();
    res.send("Review added");
});

router.get("/approved", async (req, res) => {
    const reviews = await Review.find({ approved: true });
    res.json(reviews);
});


router.get("/approved/:serviceIds", async (req, res) => {
    const { serviceIds } = req.params;
    const serviceIdsArray = serviceIds.split(',');
    // console.log(serviceIdsArray);
    const reviews = await Review.find({ approved: true, serviceId: { $in: serviceIdsArray } });
    res.json(reviews);
});


router.get("/pending", async (req, res) => {
    const reviews = await Review.find({ approved: false });
    res.json(reviews);
});

// Get reviews submitted by a specific user
router.get("/user/:userId", async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/approve/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (review) {
            await updateServiceRating(review.serviceId);
        }
        res.send("Approved");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


router.delete("/:id", async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});

module.exports = router;