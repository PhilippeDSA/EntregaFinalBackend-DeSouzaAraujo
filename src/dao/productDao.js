import { ProductModel } from "../models/productmodel.js";

export default class productDao {

    async getProducts() {
        return await ProductModel.find();
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async createProduct(data) {
        return await ProductModel.create(data);
    }

    async updateProduct(id, data) {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}
