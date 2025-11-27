import { Router } from "express";
import CartDao from "../dao/CartDao.js";
const cartService = new CartDao();

const router = Router();

// POST /api/carts
router.post("/", async (req, res) => {
  const cart = await cartService.createCart();
  res.status(201).json(cart);
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  const cart = await cartService.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json(cart);
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json(cart);
});

export default router;
