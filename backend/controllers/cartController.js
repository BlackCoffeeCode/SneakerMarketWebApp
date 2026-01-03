import Cart from "../models/Cart.js";

// @desc    Get logged-in user's cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.sneaker");

    if (cart) {
      // Filter out items where the sneaker product was deleted
      cart.items = cart.items.filter(item => item.sneaker !== null);
      await cart.save(); // Optional: Persist the cleanup
    }

    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res) => {
  try {
    console.log(req.body);
    const { sneakerId, quantity, size } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.sneaker.toString() === sneakerId &&
        item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        sneaker: sneakerId,
        quantity,
        size,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.sneaker");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      await cart.save();
      // Re-populate to return full object
      await cart.populate("items.sneaker");
      res.json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.sneaker");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    await cart.save();
    // Re-populate
    await cart.populate("items.sneaker");
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
