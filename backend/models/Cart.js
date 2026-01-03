import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        sneaker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sneaker",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
