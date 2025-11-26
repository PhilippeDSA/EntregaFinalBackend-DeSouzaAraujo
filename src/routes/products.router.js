import { Router } from "express";
import ProductManager from "../manager/productManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/product.json");

// GET /api/products
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
});

// POST /api/products
router.post("/", async (req, res) => {
  const product = await productManager.addProduct(req.body);
  req.io.emit("productsUpdated", await productManager.getProducts());
  res.status(201).json(product);
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ message: "Producto no encontrado" });
  req.io.emit("productsUpdated", await productManager.getProducts());
  res.json(updated);
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
  req.io.emit("productsUpdated", await productManager.getProducts());
  res.json({ message: "Producto eliminado correctamente" });
});

export default router;
