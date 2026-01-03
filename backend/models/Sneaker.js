import mongoose from "mongoose";

const sneakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [Number],
      default: [],
    },
    images: {
      type: [String],
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      required: true, // Unique ID for every sneaker
    },
    sustainability: {
      carbonFootprint: { type: Number, default: 0 }, // kg CO2e
      recycledMaterial: { type: Number, default: 0 }, // %
      repairable: { type: Boolean, default: false },
      wears: { type: Number, default: 0 }, // Expected lifespan in wears
    },
    description: {
      type: String,
    },
    category: {
      type: [String],
      default: [],
    },
    model3D: {
      type: String, // AR model path (future)
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sneaker", sneakerSchema);
