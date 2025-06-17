const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

const User = require("./models/User");

// ✅ TEMP FIX: Rebuild indexes ONCE to enforce uniqueness
mongoose.connection.once("open", async () => {
  try {
    await User.init(); // Ensure schema indexes are applied
    console.log("✅ Indexes ensured");
  } catch (err) {
    console.error("❌ Index setup error:", err.message);
  }
});


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
