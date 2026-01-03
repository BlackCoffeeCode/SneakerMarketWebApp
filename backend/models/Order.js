import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        sneaker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sneaker",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);



export default mongoose.model("Order", orderSchema);
