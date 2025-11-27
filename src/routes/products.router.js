import { Router } from "express";
import ProductDao from "../dao/productDao";
const productService = new ProductDao();

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await productService.getProducts();
  res.json(products);
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const product = await productService.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
});

// POST /api/products
router.post("/", async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const updated = await productService.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ message: "Producto no encontrado" });
  res.json(updated);
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const deleted = await productService.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
  res.json({ message: "Producto eliminado correctamente" });
});

export default router;
