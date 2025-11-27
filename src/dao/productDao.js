import { ProductModel } from "../models/productmodel";

export default class ProductDao {
    getProducts = async () => {
        return await ProductModel.find();
    }

    getProductById = async (pid) => {
        return await ProductModel.findById(pid);
    }
    createProduct = async (productData) => {
        return await ProductModel.create(productData);
    }
    updateProduct = async (pid, productData) => {
        return await ProductModel.findByIdAndUpdate(pid, productData, { new: true });
    }
    deleteProduct = async (pid) => {
        return await ProductModel.findByIdAndDelete(pid);
    }
}