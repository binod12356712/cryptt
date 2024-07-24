const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const nodemailer = require("nodemailer");
const kycRoutes = require("./Routes/KycRoute");
const User = require("./models/User"); // Ensure this path is correct\
const KYC = require("./models/KycModel");
// const Wallet = require("./models/Wallet"); // Ensure this path is correct
const cloudinary = require("cloudinary").v2;
const app = express();
const PORT = 3001;
const jwtSecret = "abcdefghijklmnopqrstuvwxyz";
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dsnmhnj0b",
  api_key: "812327346814326",
  api_secret: "35duA2Z6IV4sNVzcOIsZVsrffrQ",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});
const upload = multer({ storage });

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const Connection_url =
  "mongodb+srv://prabesh:prabesh@fyp.ubddnoe.mongodb.net/Crypto?retryWrites=true&w=majority";

mongoose
  .connect(Connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch((error) => console.log(error.message));

mongoose.set("strictQuery", true);
const transporter = nodemailer.createTransport({
  service: "Gmail",
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "np03cs4s220296@heraldcollege.edu.np",
    pass: "drni kowm ahrn cabp",
  },
});
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No such user found" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Use updateOne to update only the required fields
    await User.updateOne(
      { email },
      {
        $set: {
          verificationCode,
          verificationCodeExpires: Date.now() + 3600000, // 1 hour from now
        },
      }
    );

    const mailOptions = {
      from: "np03cs4s220296@heraldcollege.edu.np",
      to: user.email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.json({ message: "Verification code sent to your email" });
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/verify-code", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }
    res.json({ success: true, message: "Verification code is valid" });
  } catch (error) {
    console.error("Error in verify code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/verify/otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("Received request to verify OTP:", { email, otp });

  try {
    const user = await User.findOne({
      email: email,
      otp: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired OTP");
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // OTP is valid, save the user
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const data = {
      user: {
        id: user._id,
      },
    };
    const authToken = jwt.sign(data, jwtSecret);

    res.json({
      success: true,
      message: "OTP verified successfully",
      authToken,
      userdata: { _id: user._id, walletAddress: user.walletAddress },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No such user found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { verificationCode: "", verificationCodeExpires: "" },
      }
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Schema Definitions
const predictionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  direction: { type: String, required: true },
  amount: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  predictedAt: { type: Date, default: Date.now },
  fee: { type: Number, required: true },
  uid: { type: Number, required: true }, // Ensure uid is required here
  result: { type: Object, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  walletAddress: { type: String, required: true },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  balances: {
    type: Map,
    of: Number,
    default: { usd: 0, bitcoin: 0, ethereum: 0 },
  },
});
const Wallet = mongoose.model("Wallet", walletSchema);

const depositSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    proof: { type: String, required: true },
    approved: { type: Boolean, default: false },
    selectedSymbol: { type: String, required: true },
    status: { type: String, default: "pending" }, // Set default status to pending
    uid: { type: String, required: true }, // Add uid field
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);

const withdrawSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Withdraw = mongoose.model("Withdraw", withdrawSchema);

const conversionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fromSymbol: { type: String, required: true },
    toSymbol: { type: String, required: true },
    amount: { type: Number, required: true },
    convertedAmount: { type: Number, required: true },
    status: { type: String, default: "completed" }, // Set default status to completed
  },
  { timestamps: true }
);

const Conversion = mongoose.model("Conversion", conversionSchema);

app.post("/api/convert", async (req, res) => {
  const { userId, fromSymbol, toSymbol, amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balances.get(fromSymbol.toLowerCase()) < amount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: { ids: toSymbol, vs_currencies: "usd" },
      }
    );

    const cryptoPrice = response.data[toSymbol].usd;
    const cryptoAmount = amount / cryptoPrice;

    wallet.balances.set(
      fromSymbol.toLowerCase(),
      wallet.balances.get(fromSymbol.toLowerCase()) - amount
    );

    if (!wallet.balances.get(toSymbol.toLowerCase())) {
      wallet.balances.set(toSymbol.toLowerCase(), 0);
    }

    wallet.balances.set(
      toSymbol.toLowerCase(),
      wallet.balances.get(toSymbol.toLowerCase()) + cryptoAmount
    );

    await wallet.save();

    const conversion = new Conversion({
      userId,
      fromSymbol,
      toSymbol,
      amount,
      convertedAmount: cryptoAmount,
      status: "completed", // Explicitly set the status to completed
    });

    await conversion.save();

    res.json({ success: true, balances: wallet.balances });
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });
    const sends = await Send.find({ userId }).sort({ createdAt: -1 });
    const withdraws = await Withdraw.find({ userId }).sort({ createdAt: -1 });
    const conversions = await Conversion.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({ deposits, sends, withdraws, conversions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const sendSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "pending" }, // Set default status to pending
  },
  { timestamps: true }
);

const Send = mongoose.model("Send", sendSchema);

const deliveryTimes = [
  { time: 60, interest: 0.1, minAmount: 50 },
  { time: 120, interest: 0.35, minAmount: 1000 },
  { time: 129600, interest: 2.15, minAmount: 50000 },
  { time: 604800, interest: 3.15, minAmount: 100000 },
  { time: 2592000, interest: 5.2, minAmount: 200000 },
];

// Routes
app.get("/api/prices", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 250,
          page: 1,
          sparkline: true,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching prices:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });
    // Fetch other transactions if needed, like sends, withdraws, conversions

    res.json({ deposits /*, sends, withdraws, conversions*/ });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });
    const sends = await Send.find({ userId }).sort({ createdAt: -1 });
    const withdraws = await Withdraw.find({ userId }).sort({ createdAt: -1 });

    res.json({ deposits, sends, withdraws });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// New route to fetch transaction details by ID
app.get("/api/transaction/:id", async (req, res) => {
  const { id } = req.params;

  try {
    let transaction = await Deposit.findById(id);
    if (!transaction) {
      transaction = await Send.findById(id);
      if (!transaction) {
        transaction = await Withdraw.findById(id);
        if (!transaction) {
          transaction = await Conversion.findById(id); // Add this line to check for conversions
          if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
          }
        }
      }
    }

    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/predict", async (req, res) => {
  const {
    symbol,
    direction,
    amount,
    deliveryTime,
    currentPrice,
    uid,
    userId,
    walletAddress,
  } = req.body;
  const selectedTime = deliveryTimes.find((time) => time.time === deliveryTime);

  if (!selectedTime) {
    return res.status(400).json({ error: "Invalid delivery time selected." });
  }

  if (amount < selectedTime.minAmount) {
    return res.status(400).json({
      error: `Minimum amount for this delivery time is ${selectedTime.minAmount}`,
    });
  }

  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price`,
    {
      params: { ids: symbol, vs_currencies: "usd" },
    }
  );

  const cryptoPrice = response.data[symbol].usd;
  const cryptoAmount = amount / cryptoPrice;
  const wallet = await Wallet.findOne({ userId });

  if (!wallet || wallet.balances.get("usd") < amount) {
    return res.status(400).json({ error: "Insufficient USD balance." });
  }

  const prediction = new Prediction({
    symbol,
    direction,
    amount,
    deliveryTime,
    currentPrice: cryptoPrice,
    predictedAt: Date.now(),
    fee: amount * 0.001,
    uid,
    userId,
    walletAddress,
  });

  try {
    wallet.balances.set("usd", wallet.balances.get("usd") - amount);
    await wallet.save();
    await prediction.save();

    setTimeout(async () => {
      try {
        const result = await evaluatePrediction(
          prediction._id,
          selectedTime.interest
        );
        console.log("Evaluation result:", result);
      } catch (error) {
        console.error("Error evaluating prediction:", error);
      }
    }, deliveryTime * 1000);

    res.json(prediction);
  } catch (error) {
    console.error("Error saving prediction:", error);
    res.status(500).json({ error: error.message });
  }
});

const evaluatePrediction = async (predictionId, interestRate) => {
  const prediction = await Prediction.findById(predictionId);
  if (!prediction) throw new Error("Prediction not found");

  const { symbol, direction, amount, currentPrice, fee, result, userId } =
    prediction;

  // If result is already set by admin, return it
  if (result) {
    const profit = result.success ? (amount - fee) * interestRate : 0; // Only profit amount
    const totalProfit = result.success ? amount - fee + profit : 0; // Total amount after profit
    const updatedResult = {
      success: result.success,
      profit,
      totalProfit,
      message: result.success
        ? `Admin approved profit of ${profit} USD`
        : "Admin approved loss",
    };
    await Prediction.findByIdAndUpdate(predictionId, { result: updatedResult });
    return updatedResult;
  }

  // Fetch current price to evaluate prediction
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price`,
    {
      params: { ids: symbol, vs_currencies: "usd" },
    }
  );

  const newPrice = response.data[symbol].usd;
  let evalResult;

  if (
    (direction === "up" && newPrice > currentPrice) ||
    (direction === "down" && newPrice < currentPrice)
  ) {
    const profit = (amount - fee) * interestRate; // Only profit amount
    const totalProfit = amount - fee + profit; // Total amount after profit
    evalResult = {
      success: true,
      profit,
      totalProfit,
      message: `You have earned ${profit} USD`,
    };
    await Wallet.updateOne(
      { userId },
      { $inc: { "balances.usd": totalProfit } },
      { upsert: true }
    );
  } else {
    evalResult = {
      success: false,
      loss: amount,
      message: "You have lost all your money",
    };
  }

  await Prediction.findByIdAndUpdate(predictionId, { result: evalResult });
  return evalResult;
};
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await User.find({}, "_id email userId"); // Fetch only the required fields
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/wallets", async (req, res) => {
  try {
    const wallets = await Wallet.find().lean(); // Use lean() for better performance
    const userIds = wallets.map((wallet) => wallet.userId);
    const users = await User.find({ _id: { $in: userIds } }, "userId").lean();
    const userMap = users.reduce((map, user) => {
      map[user._id] = user.userId;
      return map;
    }, {});

    const walletsWithUserIds = wallets.map((wallet) => ({
      ...wallet,
      userId: userMap[wallet.userId],
    }));

    res.json(walletsWithUserIds);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/api/wallet/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Wallet.findByIdAndDelete(id);
    res.json({ message: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/api/deposits/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deposit = await Deposit.findById(id);
    if (!deposit) {
      console.error(`Deposit with id ${id} not found`);
      return res.status(404).json({ error: "Deposit not found" });
    }

    await Deposit.findByIdAndDelete(id); // Use findByIdAndDelete instead of remove
    res.json({ message: "Deposit declined and deleted successfully" });
  } catch (error) {
    console.error(`Error declining deposit with id ${id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/prediction/:id/result", async (req, res) => {
  const { id } = req.params;
  const { success } = req.body;

  try {
    const prediction = await Prediction.findById(id);
    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    if (success === null) {
      return res.json({ success: true, message: "Default result kept" });
    }

    const profit = success ? (prediction.amount - prediction.fee) * 0.1 : 0; // Only profit amount
    const totalProfit = success
      ? prediction.amount - prediction.fee + profit
      : 0; // Total amount after profit
    const result = {
      success,
      amount: prediction.amount,
      profit,
      totalProfit,
      message: success
        ? `Admin approved profit of ${profit} USD`
        : "Admin approved loss",
    };

    await Prediction.findByIdAndUpdate(id, { result });

    await Wallet.updateOne(
      { userId: prediction.userId },
      {
        $inc: {
          "balances.usd": success ? totalProfit : 0,
        },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating prediction result:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/prediction/:id", async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction)
      return res.status(404).json({ error: "Prediction not found" });
    res.json(prediction);
  } catch (error) {
    console.error("Error fetching prediction result:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/predictions", async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ predictedAt: -1 });
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/predictions/user/:userId", async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId });
    if (!predictions.length)
      return res
        .status(404)
        .json({ error: "No predictions found for this user" });
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/predictions/waiting", async (req, res) => {
  try {
    const predictions = await Prediction.find({ result: null });
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching waiting predictions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Wallet Routes
app.post("/api/wallet", async (req, res) => {
  const { userId, symbol, amount } = req.body;

  try {
    await Wallet.updateOne(
      { userId },
      { $set: { [`balances.${symbol}`]: amount } },
      { upsert: true }
    );
    res.json({ success: true, message: "Wallet balance updated successfully" });
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/cryptos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 250,
          page: 1,
          sparkline: false,
        },
      }
    );
    const cryptos = response.data.map((crypto) => ({
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      logo: crypto.image,
    }));
    res.json(cryptos);
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/wallet/:userId", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet)
      return res.status(404).json({ error: "Wallet not found for this user" });
    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/convert", async (req, res) => {
  const { userId, fromSymbol, toSymbol, amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balances.get(fromSymbol.toLowerCase()) < amount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: { ids: toSymbol.toLowerCase(), vs_currencies: "usd" },
      }
    );

    const cryptoPrice = response.data[toSymbol.toLowerCase()]?.usd;

    if (!cryptoPrice) {
      return res.status(400).json({ error: "Invalid cryptocurrency symbol." });
    }

    const cryptoAmount = amount / cryptoPrice;

    wallet.balances.set(
      fromSymbol.toLowerCase(),
      wallet.balances.get(fromSymbol.toLowerCase()) - amount
    );

    if (!wallet.balances.get(toSymbol.toLowerCase())) {
      wallet.balances.set(toSymbol.toLowerCase(), 0);
    }

    wallet.balances.set(
      toSymbol.toLowerCase(),
      wallet.balances.get(toSymbol.toLowerCase()) + cryptoAmount
    );

    await wallet.save();

    const conversion = new Conversion({
      userId,
      fromSymbol,
      toSymbol,
      amount,
      convertedAmount: cryptoAmount,
      status: "completed",
    });

    await conversion.save();

    res.json({ success: true, balances: wallet.balances });
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/wallet/:userId/balances", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });

    if (!wallet) {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 250,
            page: 1,
            sparkline: true,
          },
        }
      );

      const coins = response.data;
      const initialBalances = { usd: 0 };
      coins.forEach((coin) => {
        initialBalances[coin.id] = 0;
      });

      wallet = new Wallet({
        userId: req.params.userId,
        balances: initialBalances,
      });
      await wallet.save();
    }

    const symbols = Array.from(wallet.balances.keys());
    if (!symbols.length) {
      return res.json({ balances: wallet.balances, prices: {} });
    }

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids: symbols.join(","), vs_currencies: "usd" },
      }
    );

    const prices = response.data;
    res.json({ balances: wallet.balances, prices });
  } catch (error) {
    console.error("Error fetching wallet balances and prices:", error);
    res.status(500).json({ error: error.message });
  }
});

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

app.post("/api/deposit", upload.single("proof"), async (req, res) => {
  const { userId, amount, selectedSymbol } = req.body;
  const proof = req.file ? req.file.path : null;
  const uid = req.body.uid; // Add this line to get the UID from the request body

  if (!proof) {
    console.error("Proof of payment file is missing.");
    return res.status(400).json({ error: "Proof of payment is required." });
  }

  const deposit = new Deposit({ userId, amount, proof, selectedSymbol, uid }); // Add uid here

  try {
    await deposit.save();
    res.json({
      success: true,
      message: "Deposit request submitted successfully",
    });
  } catch (error) {
    console.error("Error saving deposit request:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find({ approved: false }).populate(
      "userId",
      "userId"
    );
    res.json(deposits);
  } catch (error) {
    console.error("Error fetching deposits:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/deposits/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    const deposit = await Deposit.findById(id);
    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    const wallet = await Wallet.findOne({ userId: deposit.userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    deposit.approved = true;
    await deposit.save();

    const symbol = deposit.selectedSymbol.toLowerCase();

    if (!wallet.balances.get(symbol)) {
      wallet.balances.set(symbol, 0);
    }
    wallet.balances.set(symbol, wallet.balances.get(symbol) + deposit.amount);

    await wallet.save();

    res.json({
      success: true,
      message: "Deposit approved and balance updated",
    });
  } catch (error) {
    console.error("Error approving deposit:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/withdraw", async (req, res) => {
  const { userId, symbol, amount } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (
      !wallet ||
      !wallet.balances.get(symbol) ||
      wallet.balances.get(symbol) < amount
    ) {
      return res
        .status(400)
        .json({ error: "Insufficient balance for withdrawal" });
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: { ids: symbol, vs_currencies: "usd" },
      }
    );

    const cryptoPrice = response.data[symbol].usd;
    const usdAmount = amount * cryptoPrice;

    wallet.balances.set(symbol, wallet.balances.get(symbol) - amount);
    wallet.balances.set("usd", wallet.balances.get("usd") + usdAmount);
    await wallet.save();

    res.json({
      success: true,
      message: "Withdrawal completed and USD balance updated",
      usdAmount,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/send", async (req, res) => {
  const { userId, symbol, amount, address } = req.body;

  try {
    const wallet = await Wallet.findOne({ userId });
    const currentBalance = wallet.balances.get(symbol.toLowerCase());

    if (!wallet || currentBalance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct only the specified amount
    wallet.balances.set(symbol.toLowerCase(), currentBalance - amount);
    await wallet.save();

    const sendRequest = new Send({
      userId,
      symbol,
      amount,
      address,
      status: "pending",
    });
    await sendRequest.save();

    res.json({
      success: true,
      message: "Send request submitted and pending admin approval",
    });
  } catch (error) {
    console.error("Error creating send request:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/send-requests", async (req, res) => {
  try {
    const sendRequests = await Send.find({ status: "pending" });
    res.json(sendRequests);
  } catch (error) {
    console.error("Error fetching send requests:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/send-requests/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const sendRequest = await Send.findById(id);
    if (!sendRequest)
      return res.status(404).json({ error: "Send request not found" });

    sendRequest.status = status;
    await sendRequest.save();

    res.json({ success: true, message: `Send request marked as ${status}` });
  } catch (error) {
    console.error("Error updating send request status:", error);
    res.status(500).json({ error: error.message });
  }
});

// Function to generate a random 6-digit user ID
const generateUserId = async () => {
  let userId;
  let userExists;
  do {
    userId = Math.floor(100000 + Math.random() * 900000).toString();
    userExists = await User.findOne({ userId });
  } while (userExists);
  return userId;
};

// Function to generate a random 12-character wallet address
const generateWalletAddress = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let walletAddress;
  let addressExists;
  do {
    walletAddress = "";
    for (let i = 0; i < 12; i++) {
      walletAddress += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    addressExists = await User.findOne({ walletAddress });
  } while (addressExists);
  return walletAddress;
};

app.post(
  "/api/register/createuser",
  body("email", "Invalid email").isEmail(),
  body("password", "Password too short").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ success: false, userExist: true });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      const userId = await generateUserId();
      const walletAddress = await generateWalletAddress();

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Create user object and save it
      const user = new User({
        email: req.body.email,
        password: securePassword,
        userId: userId,
        walletAddress: walletAddress,
        otp: otp, // Save OTP
        otpExpires: Date.now() + 3600000, // 1 hour expiration
      });

      await user.save(); // Save user data to the database

      const logoPath = path.join(__dirname, "logo2.png");

      const mailOptions = {
        from: "np03cs4s220296@heraldcollege.edu.np",
        to: user.email,
        subject: "Thank you for signing up!",
        html: `
          <div style="text-align: center;">
            <h3>Thank you for signing up!</h3>
            <img src="cid:unique@logo2.png" style="width: 400px; height: auto;" />
            <p>Your OTP code is ${otp}</p>
          </div>
        `,
        attachments: [
          {
            filename: "logo2.png",
            path: logoPath,
            cid: "unique@logo2.png",
          },
        ],
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          await User.deleteOne({ _id: user._id }); // Delete user data if email fails
          return res.status(500).json({ message: "Error sending email" });
        } else {
          console.log("Email sent: " + info.response);
          res.json({
            success: true,
            userExist: false,
            userdata: {
              email: user.email,
              userId: user.userId,
              walletAddress: user.walletAddress,
              otp: otp,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.use("/api/register", require("./Routes/Signup"));
app.use("/api", kycRoutes);
app.get("/api/kyc", async (req, res) => {
  try {
    const kycRequests = await KYC.find({ status: "pending" });
    res.json(kycRequests);
  } catch (error) {
    console.error("Error fetching KYC requests:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/kyc/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    await KYC.findByIdAndUpdate(id, { status: "approved" });
    res.json({ success: true, message: "KYC approved successfully" });
  } catch (error) {
    console.error("Error approving KYC:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/kyc/:id/reject", async (req, res) => {
  const { id } = req.params;

  try {
    await KYC.findByIdAndUpdate(id, { status: "rejected" });
    res.json({ success: true, message: "KYC rejected successfully" });
  } catch (error) {
    console.error("Error rejecting KYC:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post(
  "/api/kyc",
  upload.fields([
    { name: "identityProof", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    const { userId, dob, country, address, zip, contact } = req.body;
    const identityProof = req.files["identityProof"]
      ? req.files["identityProof"][0].path
      : null;
    const photo = req.files["photo"] ? req.files["photo"][0].path : null;

    if (!identityProof || !photo) {
      return res
        .status(400)
        .json({ error: "Identity proof and photo are required." });
    }

    const kycData = new KYC({
      userId,
      dob,
      country,
      address,
      zip,
      contact,
      identityProof,
      photo,
      status: "pending",
    });

    try {
      await kycData.save();
      res.json({ success: true, message: "KYC submitted successfully" });
    } catch (error) {
      console.error("Error saving KYC data:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/api/kyc/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const kyc = await KYC.findOne({ userId });
    if (!kyc) {
      return res.status(404).json({ error: "KYC not found" });
    }
    res.json(kyc);
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: error.message });
  }
});
const agentSchema = new mongoose.Schema({
  agentId: { type: String, unique: true },
  name: { type: String, unique: true },
  team: String,
  password: String,
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const Agent = mongoose.model("Agent", agentSchema);

// Helper functions
const generateAgentId = async () => {
  let agentId;
  let agentExists;
  do {
    agentId = `AG${Math.floor(1000 + Math.random() * 9000)}`;
    agentExists = await Agent.findOne({ agentId });
  } while (agentExists);
  return agentId;
};
app.get("/api/profit-stats/:userId", async (req, res) => {
  const { userId } = req.params;
  const { period } = req.query;

  const periods = {
    "1H": 60 * 60 * 1000,
    "6H": 6 * 60 * 60 * 1000,
    "1D": 24 * 60 * 60 * 1000,
    "1W": 7 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
  };

  const currentTime = new Date();
  const pastTime = new Date(currentTime - periods[period]);

  try {
    const predictions = await Prediction.find({
      userId,
      predictedAt: { $gte: pastTime },
    });

    if (!predictions.length) {
      return res.status(404).json({ error: `No data found for ${period}` });
    }
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.post("/api/agent/signup", async (req, res) => {
  const { name, team, password } = req.body;

  const agentId = await generateAgentId();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newAgent = new Agent({
    agentId,
    name,
    team,
    password: hashedPassword,
  });

  try {
    await newAgent.save();
    res
      .status(201)
      .json({ message: "Agent signup successful. Awaiting admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Error signing up agent.", error });
  }
});

app.post("/api/agent/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const agent = await Agent.findOne({ name });
    if (!agent) {
      return res.status(400).json({ message: "Agent not found." });
    }

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ agentId: agent._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
});

// Admin routes
app.get("/api/admin/agents", async (req, res) => {
  try {
    const agents = await Agent.find({ approved: false });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents.", error });
  }
});

app.post("/api/admin/agents/:id/approve", async (req, res) => {
  try {
    await Agent.findByIdAndUpdate(req.params.id, { approved: true });
    res.json({ message: "Agent approved." });
  } catch (error) {
    res.status(500).json({ message: "Error approving agent.", error });
  }
});

app.post("/api/admin/agents/:id/decline", async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent declined." });
  } catch (error) {
    res.status(500).json({ message: "Error declining agent.", error });
  }
});
app.get("/api/agents", async (req, res) => {
  try {
    const agents = await Agent.find({});
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents.", error });
  }
});
app.delete("/api/agents/:id", async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting agent.", error });
  }
});
