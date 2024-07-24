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

const jwtSecret = "abcdefghijklmnopqrstuvwxyz";
const app = express();
const PORT = 3001;

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

// Schema Definitions
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 5 },
  userId: { type: String, unique: true, required: true },
  walletAddress: { type: String, unique: true, required: true },
});
const User = mongoose.model("User", userSchema);

const predictionSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  direction: { type: String, required: true },
  amount: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  predictedAt: { type: Date, default: Date.now },
  fee: { type: Number, required: true },
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
    usd: { type: Number, default: 0 },
    bitcoin: { type: Number, default: 0 },
    ethereum: { type: Number, default: 0 },
    // Add more cryptocurrencies as needed
  },
});
const Wallet = mongoose.model("Wallet", walletSchema);

const depositSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  proof: { type: String, required: true },
  approved: { type: Boolean, default: false },
});
const Deposit = mongoose.model("Deposit", depositSchema);

const withdrawSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  approved: { type: Boolean, default: false },
});
const Withdraw = mongoose.model("Withdraw", withdrawSchema);

const sendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  symbol: { type: String, required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "pending" },
});
const Send = mongoose.model("Send", sendSchema);

const deliveryTimes = [
  { time: 60, interest: 0.1, minAmount: 20 },
  { time: 600, interest: 0.3, minAmount: 50 },
  { time: 3600, interest: 0.5, minAmount: 100 },
  { time: 86400, interest: 1.0, minAmount: 200 },
];
const formatDeliveryTime = (seconds) => {
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)} days`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} hours`;
  if (seconds >= 60) return `${seconds / 60} minutes`;
  return `${seconds} seconds`;
};

// Utility functions
const generateUserId = async () => {
  let userId;
  let userExists;
  do {
    userId = Math.floor(100000 + Math.random() * 900000).toString();
    userExists = await User.findOne({ userId });
  } while (userExists);
  return userId;
};

// Routes
app.post(
  "/register/createuser",
  body("email", "Invalid email").isEmail(),
  body("password", "Password too short").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ success: false, userExist: true });
      }

      const userId = await generateUserId();

      const user = new User({
        email: req.body.email,
        password: securePassword,
        userId: userId,
      });
      await user.save();

      // Initialize wallet with zero balances
      const wallet = new Wallet({
        userId: user._id,
        balances: {
          usd: 0,
          bitcoin: 0,
          ethereum: 0,
        },
      });
      await wallet.save();

      const data = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(data, jwtSecret);

      res.json({
        success: true,
        userExist: false,
        authToken,
        userdata: { _id: user._id },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

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

app.post("/api/predict", async (req, res) => {
  const {
    symbol,
    direction,
    amount,
    deliveryTime,
    currentPrice,
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

  if (result) {
    const profit = result.success ? (amount - fee) * interestRate : 0; // Only profit amount
    const updatedResult = {
      success: result.success,
      profit,
      message: result.success
        ? `Admin approved profit of ${profit} USD`
        : "Admin approved loss",
    };
    await Prediction.findByIdAndUpdate(predictionId, { result: updatedResult });
    return updatedResult;
  }

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
    evalResult = {
      success: true,
      profit,
      message: `You have earned ${profit} USD`,
    };
    await Wallet.updateOne(
      { userId },
      { $inc: { "balances.usd": profit } },
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

app.post("/api/prediction/:id/result", async (req, res) => {
  const { id } = req.params;
  const { success } = req.body;

  try {
    const prediction = await Prediction.findById(id);
    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    const profit = success ? (prediction.amount - prediction.fee) * 0.1 : 0; // Only profit amount
    const result = {
      success,
      amount: prediction.amount,
      profit,
      message: success
        ? `Admin approved profit of ${profit} USD`
        : "Admin approved loss",
    };

    await Prediction.findByIdAndUpdate(id, { result });

    await Wallet.updateOne(
      { userId: prediction.userId },
      {
        $inc: {
          "balances.usd": success ? profit : 0,
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
    console.error("Error fetching prediction:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/predictions/user/:userId", async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId });
    if (!predictions.length) {
      return res
        .status(404)
        .json({ error: "No predictions found for this user" });
    }
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
      const initialBalances = {};
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/api/deposit", upload.single("proof"), async (req, res) => {
  const { userId, amount } = req.body;
  const proof = req.file.path;

  const deposit = new Deposit({ userId, amount, proof });

  try {
    await deposit.save();
    res.json({
      success: true,
      message: "Deposit request submitted successfully",
    });
  } catch (error) {
    console.error("Error saving deposit request:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find({ approved: false });
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

    deposit.approved = true;
    await deposit.save();

    await Wallet.updateOne(
      { userId: deposit.userId },
      { $inc: { "balances.usd": deposit.amount } },
      { upsert: true }
    );

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
    if (!wallet || wallet.balances.get(symbol) < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const sendRequest = new Send({
      userId,
      symbol,
      amount,
      address,
      status: "pending",
    });
    await sendRequest.save();

    wallet.balances.set(symbol, wallet.balances.get(symbol) - amount);
    await wallet.save();

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
