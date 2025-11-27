import { CartModel } from "../models/cartmodel";

export default class CartDao {
    getCartById = async (cid) => {
        return await CartModel.findById(cid).populate("products.product");
    };
    createCart = async () => {
        return await CartModel.create({ products: [] });
    };

    addProductsToCart = async (cid, pid) => {
        const cart = await CartModel.findById(cid);
        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        return await cart.save();
    };
    updateCart = async (cid, products) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        );
    };
    deleteProductFromCart = async (cid, pid) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    };
    deleteCart = async (cid) => {
        return await CartModel.findByIdAndDelete(cid);
    };
}