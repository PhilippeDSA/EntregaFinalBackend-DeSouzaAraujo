import { Router } from "express";
import productDao from "../dao/productDao.js";
import { ProductModel } from "../models/productmodel.js";

const productService = new productDao();
const router = Router();

/* =======================================================
   GET /api/products  → paginación + filtros + orden
   ======================================================= */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    // Filtros
    let filter = {};
    if (query) {
      filter.$or = [
        { category: query },
        { status: query === "true" }
      ];
    }

    // Ordenamiento
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    // Paginación
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
    console.error("Error en paginación de productos:", error);
    res.status(500).json({ status: "error", error });
  }
});


/* =======================================================
   GET /api/products/:pid → obtener 1 producto (JSON)
   ======================================================= */
router.get("/:pid", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);

  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


/* =======================================================
   POST /api/products → crear producto
   ======================================================= */
router.post("/", async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);

  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


/* =======================================================
   PUT /api/products/:pid → actualizar producto
   ======================================================= */
router.put("/:pid", async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.pid, req.body);

    if (!updated) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(updated);

  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


/* =======================================================
   DELETE /api/products/:pid → eliminar producto
   ======================================================= */
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.pid);

    if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


export default router;
