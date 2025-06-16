const Cart = require("../models/Cart");
const {
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//Create new Cart

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(202).json(savedCart);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Update Cart
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(202).json(updatedCart);
  } catch (error) {
    res.status(404).json("error");
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(202).json("Cart successfully deleted");
  } catch (error) {
    res.status(404).json("Error occured while deleting the Cart");
  }
});

//Find Carts
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(202).json(cart);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get all Carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(202).json(cart);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
