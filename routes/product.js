const Product = require("../models/Product");
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//Create new Product

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(202).json(savedProduct);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(202).json(updatedProduct);
  } catch (error) {
    res.status(404).json("error");
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(202).json("Product successfully deleted");
  } catch (error) {
    res.status(404).json("Error occured while deleting the product");
  }
});

//Find Products
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(202).json(product);
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get all Products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(4);
    } else if (qCategory) {
      products = await Product.find({ category: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }
    res.status(202).json(products);
  } catch (error) {
    res.status(404).json("Error while showing all users");
  }
});

module.exports = router;
