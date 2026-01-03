import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// =======================================
// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
// =======================================
export const createOrder = async (req, res) => {
  try {
    // Safety check (should never fail now, but defensive coding)
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Find user's cart and populate sneaker details
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.sneaker"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Remove items whose sneakers were deleted
    const orderItems = cart.items
      .filter((item) => item.sneaker) // 🔥 VERY IMPORTANT
      .map((item) => ({
        sneaker: item.sneaker._id,
        quantity: item.quantity,
        size: item.size,
        price: item.sneaker.price,
      }));

    // If all items were invalid
    if (orderItems.length === 0) {
      return res.status(400).json({
        message: "All items in cart are no longer available",
      });
    }

    // Calculate total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================================
// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
// =======================================
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const orders = await Order.find({ user: req.user._id }).populate(
      "orderItems.sneaker"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================================
// @desc    Get all orders (ADMIN)
// @route   GET /api/orders
// @access  Private/Admin
// =======================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.sneaker");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
