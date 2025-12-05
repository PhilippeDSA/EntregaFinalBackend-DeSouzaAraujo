import mongoose from "mongoose";
import { CartModel } from "../models/cartmodel.js";

export default class CartDao {

    // obtener carrito con populate
    getCartById = async (cid) => {
        return await CartModel.findById(cid).populate("products.product");
    };

    // crear carrito vacio
    createCart = async () => {
        return await CartModel.create({ products: [] });
    };

    // 🚀 AGREGAR PRODUCTO AL CARRITO (Optimizado con operadores atómicos)
    addProductToCart = async (cid, pid) => {
        const cartId = new mongoose.Types.ObjectId(cid);
        const productId = new mongoose.Types.ObjectId(pid);

        // 1. INTENTAR INCREMENTAR: Busca el producto y aumenta la cantidad en 1 ($inc)
        let updatedCart = await CartModel.findOneAndUpdate(
            {
                _id: cartId,
                "products.product": productId
            },
            {
                $inc: { "products.$.quantity": 1 } // Incrementa quantity del producto encontrado
            },
            { new: true } // Retorna el documento actualizado
        ).populate("products.product");

        // 2. SI NO EXISTÍA (findOneAndUpdate no encontró coincidencia), lo agregamos ($push)
        if (!updatedCart) {
            updatedCart = await CartModel.findByIdAndUpdate(
                cartId,
                { $push: { products: { product: productId, quantity: 1 } } },
                { new: true }
            ).populate("products.product");
        }

        return updatedCart;
    };

    // actualizar carrito completo
    updateCart = async (cid, products) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        );
    };

    // eliminar un producto del carrito
    removeProduct = async (cid, pid) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    };

    // 🔢 Modificar cantidad de un producto específico (Corregido el error de comparación)
    updateProductQuantity = async (cid, pid, quantity) => {
        const cart = await CartModel.findById(cid);
        if (!cart) return null;

        const product = cart.products.find(
            p => p.product.toString() === pid // 🔑 CORREGIDO: Compara con 'pid'
        );
        if (!product) return null;
        product.quantity = quantity;
        return await cart.save();
    }

    // eliminar carrito
    deleteCart = async (cid) => {
        return await CartModel.findByIdAndDelete(cid);
    };

    // vaciar carrito
    clearCart = async (cid) => {
        return await CartModel.findByIdAndUpdate(cid,
            { products: [] },
            { new: true },
        );
    };
}