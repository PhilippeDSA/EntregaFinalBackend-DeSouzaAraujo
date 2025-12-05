import { Router } from "express";
import CartDao from "../dao/CartDao.js";

const cartService = new CartDao();
const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  const cart = await cartService.createCart();
  res.status(201).json(cart);
});

// Obtener carrito (con populate)
router.get("/:cid", async (req, res) => {
  const cart = await cartService.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json(cart);
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json(cart);
});

// 🗑 Eliminar un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const cart = await cartService.removeProduct(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json({ message: "Producto eliminado", cart });
});

// 🔁 Actualizar TODOS los productos del carrito
router.put("/:cid", async (req, res) => {
  const cart = await cartService.updateCart(req.params.cid, req.body.products);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json({ message: "Carrito actualizado", cart });
});

// 🔢 Modificar cantidad de un producto específico
router.put("/:cid/product/:pid", async (req, res) => {
  const cart = await cartService.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    req.body.quantity
  );
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json({ message: "Cantidad actualizada", cart });
});

// 🧹 Vaciar carrito
router.delete("/:cid", async (req, res) => {
  const cart = await cartService.clearCart(req.params.cid);
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  res.json({ message: "Carrito vaciado", cart });
});

export default router;
