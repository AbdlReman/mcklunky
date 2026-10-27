import mongoose, { Schema } from "mongoose";
import { slugify } from "@/lib/slugify";

const CategorySchema = new Schema(
  {
    wpId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = slugify(String(this.name));
  }
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
