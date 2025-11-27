import mongoose from "mongoose";


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

export const ProductModel = mongoose.model("Product", productSchema);