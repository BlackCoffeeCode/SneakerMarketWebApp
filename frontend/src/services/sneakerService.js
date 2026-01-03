import api from "./api";

export const getBackendSneakers = async () => {
  const response = await api.get("/sneakers");
  return response.data; // ✅ now safe
};
