import { Router } from "express";
import productDao from "../dao/productDao.js"
import { ProductModel } from "../models/productmodel.js";
const productService = new productDao();

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {};
    if (query) filter.category = query;

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;

    const result = await ProductModel.paginate(filter, {
      page,
      limit,
      sort: sortOption,
      lean: true
    });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
    });

  } catch (error) {
    console.error("Error en paginación", error);
    res.status(500).json({ status: "error", error });
  }
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
