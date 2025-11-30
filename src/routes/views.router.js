import { Router } from "express";
import { ProductModel } from "../models/productmodel.js"



const router = Router();


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
//realTimeProducts
router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
});

//redirect
router.get("/", (req, res) => {
    res.redirect("/home");
});


export default router;