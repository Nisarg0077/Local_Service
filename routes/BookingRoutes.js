const express = require("express");
const router = express.Router();
const Bookings = require("../models/Bookings");
const Provider = require("../models/Provider");
const User = require("../models/user");
const Service = require("../models/Service");
const { sendEmail } = require("../utils/mailer");
const mongoose = require("mongoose");

// router.post("/add", async (req, res) => {
//     try {
//         const provider = await Provider.findOne({
//             service: req.body.service,
//             location: req.body.location,
//             available: true
//         });

//         if (!provider) {
//             return res.send("No provider available");
//         }

//         const booking = new Booking({
//             userId: req.body.userId,
//             providerId: provider._id,
//             service: req.body.service,
//             date: req.body.date
//         });

//         await booking.save();

//         res.send("Booking successful");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Server error");
//     }
// });


router.post("/", async (req, res) => {
    try {
        // console.log(req.body);
        const booking = new Bookings({
            bookingId: req.body.bookingId,
            customerId: req.body.customerId,
            providerId: req.body.providerId,
            serviceId: req.body.serviceId,
            date: req.body.date,
            time: req.body.time,
            address: req.body.address,
            note: req.body.note,
            amount: req.body.amount,
            status: "Pending"
        });

        // console.log(booking)
        await booking.save();

        // Send Email Notification to Customer
        try {
            // Safer lookups to avoid CastError with custom IDs
            let customer = await User.findOne({ uid: booking.customerId });
            if (!customer && mongoose.Types.ObjectId.isValid(booking.customerId)) {
                customer = await User.findById(booking.customerId);
            }

            let provider = await Provider.findOne({ providerId: booking.providerId });
            if (!provider && mongoose.Types.ObjectId.isValid(booking.providerId)) {
                provider = await Provider.findById(booking.providerId);
            }

            const service = await Service.findOne({ id: booking.serviceId });

            if (customer && customer.email) {
                const subject = `Booking Confirmation - ${service ? service.title : "Service"}`;
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                        <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
                        <p>Hi <strong>${customer.name}</strong>,</p>
                        <p>Your booking for <strong>${service ? service.title : "the service"}</strong> has been received and is currently <strong>Pending</strong>.</p>
                        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
                            <p style="margin: 5px 0;"><strong>Service:</strong> ${service ? service.title : "N/A"}</p>
                            <p style="margin: 5px 0;"><strong>Provider:</strong> ${provider ? provider.name : "N/A"}</p>
                            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.time}</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${booking.status}</p>
                        </div>
                        <p>The provider will review your booking shortly. You will receive another update once the status changes.</p>
                        <p>Best regards,<br><strong>Smart Local Service Team</strong></p>
                    </div>
                `;
                await sendEmail(customer.email, subject, htmlContent);
            }
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
        }

        res.json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    const bookings = await Bookings.find();
    res.json(bookings);
});


router.get("/user/:id", async (req, res) => {
    try {
        const bookings = await Bookings.find({ customerId: req.params.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Bookings.findByIdAndUpdate(req.params.id, { status }, { new: true });

        // Send Status Update Email to Customer
        if (booking) {
            try {
                // Safer lookups to avoid CastError with custom IDs
                let customer = await User.findOne({ uid: booking.customerId });
                if (!customer && mongoose.Types.ObjectId.isValid(booking.customerId)) {
                    customer = await User.findById(booking.customerId);
                }

                let provider = await Provider.findOne({ providerId: booking.providerId });
                if (!provider && mongoose.Types.ObjectId.isValid(booking.providerId)) {
                    provider = await Provider.findById(booking.providerId);
                }

                const service = await Service.findOne({ id: booking.serviceId });

                if (customer && customer.email) {
                    const subject = `Booking Status Updated: ${status}`;
                    const statusColor = status === "Cancelled" || status === "Rejected" ? "#f44336" : status === "Accepted" ? "#4CAF50" : "#2196F3";

                    const htmlContent = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: ${statusColor};">Booking Status Updated</h2>
                            <p>Hi <strong>${customer.name}</strong>,</p>
                            <p>The status of your booking for <strong>${service ? service.title : "the service"}</strong> has been updated to: <span style="font-weight: bold; color: ${statusColor};">${status}</span>.</p>
                            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0; margin: 20px 0;">
                                <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
                                <p style="margin: 5px 0;"><strong>Service:</strong> ${service ? service.title : "N/A"}</p>
                                <p style="margin: 5px 0;"><strong>Provider:</strong> ${provider ? provider.name : "N/A"}</p>
                                <p style="margin: 5px 0;"><strong>New Status:</strong> ${status}</p>
                            </div>
                            <p>Thank you for choosing Smart Local Service!</p>
                            <p>Best regards,<br><strong>Smart Local Service Team</strong></p>
                        </div>
                    `;
                    await sendEmail(customer.email, subject, htmlContent);
                }
            } catch (emailError) {
                console.error("Status update email failed:", emailError);
            }
        }

        res.json(booking);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error");
    }
});

// router.get("/provider/:id", async (req, res) => {
//     const { id } = req.params;
//     const bookings = await Bookings.find({ providerId: id });
//     res.json(bookings);
// });


router.get("/provider/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // console.log("Provider ID:", id);

        const bookings = await Bookings.find({ providerId: id }).sort({ createdAt: -1 });

        // console.log("Bookings:", bookings);

        res.status(200).json(bookings);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;