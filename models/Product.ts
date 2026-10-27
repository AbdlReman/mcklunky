import mongoose, { Schema } from "mongoose";
import { slugify } from "@/lib/slugify";

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    wpId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory", default: null },
    price: { type: Number, required: true, min: 0 },
    regularPrice: { type: Number, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    onSale: { type: Boolean, default: false },
    currency: { type: String, default: "GBP" },
    tags: { type: [String], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    inStock: { type: Boolean, default: true },
    status: { type: String, enum: ["publish", "draft"], default: "publish" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(String(this.name));
  }
  if (this.regularPrice == null && this.price != null) {
    this.regularPrice = this.price;
  }
  if (this.onSale && this.salePrice != null && Number(this.salePrice) > 0) {
    this.price = Number(this.salePrice);
  } else if (!this.onSale && this.regularPrice != null) {
    this.price = Number(this.regularPrice);
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
