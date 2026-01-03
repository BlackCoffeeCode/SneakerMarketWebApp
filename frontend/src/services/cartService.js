import api from "./api";

export const addToCart = async (data) => {
  const res = await api.post("/cart", data);
  return res.data;
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await api.put(`/cart/${itemId}`, { quantity });
  return res.data;
};

export const removeFromCart = async (itemId) => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data;
};
