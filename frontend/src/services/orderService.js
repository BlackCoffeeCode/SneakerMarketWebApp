import api from "./api";

export const createOrder = async () => {
  const res = await api.post("/orders");
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};
