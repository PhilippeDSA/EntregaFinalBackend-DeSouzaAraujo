import { Router } from "express";
import { ProductModel } from "../models/productmodel.js"
import { CartModel } from "../models/cartmodel.js";
import CartDao from "../dao/CartDao.js";

const cartService = new CartDao(); // Inicializa el DAO
const router = Router();


const getOrCreateCartId = async (req) => {



    let cartId = req.cookies?.cartId;

    if (!cartId) {
        const newCart = await cartService.createCart();
        cartId = newCart._id.toString();


    }
    return cartId;
};

//home-page
router.get("/home", async (req, res) => {
    try {
        const products = await ProductModel.find().lean();
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener Productos", error);
        res.status(500).send("Error interno del servidor");
    };
});

// 🔄 PRODUCTS VIEW (CORREGIDO)
router.get("/products", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await fetch(`http://localhost:8080/api/products?page=${page}`);
        const data = await response.json(); // Data contiene el payload de paginación

        // 🔑 OBTENER/CREAR ID DE CARRITO DINÁMICO
        const dynamicCartId = await getOrCreateCartId(req); // Usamos la función temporal

        res.render("product", { // 🔑 Renderizar la plantilla correcta
            payload: data,
            cartId: dynamicCartId, // 🔑 Pasar el ID de carrito dinámico a la vista
            title: "Listado de Productos"
        });
    } catch (error) {
        console.error("Error al obtener productos paginados:", error);
        res.status(500).send("Error al cargar la vista de productos");
    }
});

//realTimeProducts
router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
});

// Vista del carrito
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
            .populate("products.product")
            .lean();

        if (!cart) return res.status(404).send("Carrito no encontrado");

        // Calcular total en backend
        const total = cart.products.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        res.render("cart", { cart, total });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el carrito");
    }
});

router.get("/products/:pid", async (req, res) => {
    const response = await fetch(`http://localhost:8080/api/products/${req.params.pid}`);
    const product = await response.json();
    res.render("productDetail", { product });
});

//redirect
router.get("/", (req, res) => {
    res.redirect("/home");
});


export default router;