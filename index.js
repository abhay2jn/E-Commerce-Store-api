const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/user.js");
const authRoute = require("./routes/auth.js");
const productRoute = require("./routes/product.js");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const PORT = process.env.PORT;

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(PORT, () => {
  console.log(`Backend is running on localhost:${PORT}`);
});
