const Order = require("../models/Order");
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//Create new Order

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(202).json(savedOrder);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(202).json(updatedOrder);
  } catch (error) {
    res.status(404).json("error");
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(202).json("Order successfully deleted");
  } catch (error) {
    res.status(404).json("Error occured while deleting the Order");
  }
});

//Find Orders
router.get("/find/:userId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(202).json(order);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get all Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(202).json(orders);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get Monthly Income

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(202).json(income);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
