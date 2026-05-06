const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing && String(existing._id) !== req.params.id) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    category.name = name.trim();
    await category.save();
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
