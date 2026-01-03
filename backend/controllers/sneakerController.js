import Sneaker from "../models/Sneaker.js";

// ===============================
// @desc    Create a sneaker (ADMIN)
// @route   POST /api/sneakers
// @access  Private (Admin)
// ===============================
export const createSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.create({
      ...req.body,
      createdBy: req.user._id, // admin user
    });

    res.status(201).json(sneaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// @desc    Get all sneakers (PUBLIC)
// @route   GET /api/sneakers
// @access  Public
// ===============================
export const getSneakers = async (req, res) => {
  try {
    const sneakers = await Sneaker.find()
      .populate("createdBy", "name email");

    res.status(200).json(sneakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// @desc    Get single sneaker
// @route   GET /api/sneakers/:id
// @access  Public
// ===============================
export const getSneakerById = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!sneaker) {
      return res.status(404).json({ message: "Sneaker not found" });
    }

    res.json(sneaker);
  } catch (error) {
    res.status(400).json({ message: "Invalid sneaker ID" });
  }
};

// ===============================
// @desc    Update sneaker (ADMIN)
// @route   PUT /api/sneakers/:id
// @access  Private (Admin)
// ===============================
export const updateSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id);

    if (!sneaker) {
      return res.status(404).json({ message: "Sneaker not found" });
    }

    const updatedSneaker = await Sneaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSneaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// @desc    Delete sneaker (ADMIN)
// @route   DELETE /api/sneakers/:id
// @access  Private (Admin)
// ===============================
export const deleteSneaker = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id);

    if (!sneaker) {
      return res.status(404).json({ message: "Sneaker not found" });
    }

    await sneaker.deleteOne();

    res.json({ message: "Sneaker deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
