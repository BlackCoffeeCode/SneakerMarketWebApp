import User from "../models/User.js";

// USER → BECOME ADMIN (SELLER)
export const becomeAdmin = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.role = "admin";
  user.activeRole = "admin";
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    activeRole: user.activeRole,
    token: req.headers.authorization.split(" ")[1],
  });
};

// SWITCH ROLE (ADMIN ↔ USER)
export const switchRole = async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.user._id);

  if (role === "admin" && user.role !== "admin") {
    return res.status(403).json({ message: "Not an admin" });
  }

  user.activeRole = role;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    activeRole: user.activeRole,
    token: req.headers.authorization.split(" ")[1],
  });
};
