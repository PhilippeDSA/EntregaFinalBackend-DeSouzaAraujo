import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    description: String,
    code: {
        type: String, unique: true
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    thumbnails: [String],
    status: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);
export const ProductModel = mongoose.model("Product", productSchema);