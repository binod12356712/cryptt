const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    dob: { type: Date, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    contact: { type: String, required: true },
    identityProof: { type: String, required: true },
    photo: { type: String, required: true },
    status: { type: String, default: "pending" }, // Default status
  },
  { timestamps: true }
);

const KYC = mongoose.model("KYC", kycSchema);
module.exports = KYC;
