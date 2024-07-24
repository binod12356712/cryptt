const express = require("express");
const multer = require("multer");
const path = require("path");
const KYC = require("../models/KycModel");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/kyc",
  upload.fields([
    { name: "identityProof", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    const { userId, dob, country, address, zip, contact } = req.body;
    const identityProof = req.files["identityProof"][0].path;
    const photo = req.files["photo"][0].path;

    try {
      const kycData = new KYC({
        userId,
        dob,
        country,
        address,
        zip,
        contact,
        identityProof,
        photo,
      });
      await kycData.save();
      res.json({ success: true, message: "KYC submitted successfully" });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
